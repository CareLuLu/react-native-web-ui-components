import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet } from 'react-native';
import { throttle, debounce } from 'throttle-debounce';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
import isFunction from 'lodash/isFunction';
import { isEmpty } from '../utils';
import { withTheme } from '../Theme';
import EventHandler from '../EventHandler';
import StylePropType from '../StylePropType';
import DefaultInput from '../TextInput';
import DefaultMenu from './Menu';
import View from '../View';

const propNames = [
  'allowEmpty',
  'items',
  'getItemValue',
  'getItemLabel',
  'onChangeText',
  'onKeyPress',
  'onFocus',
  'onSelect',
  'isMatch',
  'Input',
  'inputProps',
  'Menu',
  'menuStyle',
  'menuOpen',
  'menuVisibleWhenFocused',
  'closeMenuOnSelect',
  'blurOnSelect',
  'Item',
  'itemStyle',
  'itemActiveStyle',
  'itemHeight',
  'itemProps',
  'itemFilter',
  'Spinner',
  'spinnerHeight',
  'EmptyResult',
  'emptyResultHeight',
  'containerStyle',
  'throttleDelay',
  'debounceDelay',
  'throttleDebounceThreshold',
  'highlightedIndex',
  'className',
  'highlightMatches',
  'valueLabel',
];

const defaultGetItemValue = item => item;

const defaultIsMatch = (text, item, { getItemValue }) => {
  if (text === '' || `${getItemValue(item)}`.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
    return true;
  }
  return false;
};

const blankOr = (str) => {
  if (str === null || str === undefined) {
    return '';
  }
  return `${str}`;
};

const getEventValidationTime = () => {
  if (Platform.OS === 'web') {
    return 0;
  }
  return 400;
};

const wait = delay => new Promise(resolve => setTimeout(resolve, delay));

class Autocomplete extends EventHandler {
  static propTypes = {
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
    getItemValue: PropTypes.func,
    getItemLabel: PropTypes.func,
    onChangeText: PropTypes.func,
    onKeyPress: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onSelect: PropTypes.func,
    onRef: PropTypes.func,
    isMatch: PropTypes.func,
    maxMatches: PropTypes.number,
    Input: PropTypes.elementType,
    inputProps: PropTypes.shape(),
    Menu: PropTypes.elementType,
    menuStyle: StylePropType,
    menuOpen: PropTypes.bool,
    menuVisibleWhenFocused: PropTypes.bool,
    closeMenuOnSelect: PropTypes.bool,
    containerStyle: StylePropType,
    name: PropTypes.string,
    value: PropTypes.any, // eslint-disable-line
    valueLabel: PropTypes.any, // eslint-disable-line
    itemHeight: PropTypes.number,
    itemFilter: PropTypes.func,
    spinnerHeight: PropTypes.number,
    emptyResultHeight: PropTypes.number,
    throttleDelay: PropTypes.number,
    debounceDelay: PropTypes.number,
    throttleDebounceThreshold: PropTypes.number,
    style: StylePropType,
    allowEmpty: PropTypes.bool,
    highlightedIndex: PropTypes.number,
    className: PropTypes.string,
    highlightMatches: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
  };

  static defaultProps = {
    items: [],
    getItemValue: defaultGetItemValue,
    getItemLabel: undefined,
    onChangeText: noop,
    onKeyPress: noop,
    onFocus: noop,
    onBlur: noop,
    onSelect: noop,
    onRef: noop,
    isMatch: defaultIsMatch,
    maxMatches: null,
    Input: DefaultInput,
    inputProps: {},
    Menu: DefaultMenu,
    menuStyle: null,
    menuOpen: null,
    menuVisibleWhenFocused: null,
    closeMenuOnSelect: true,
    containerStyle: null,
    name: undefined,
    value: undefined,
    valueLabel: undefined,
    itemHeight: 30,
    itemFilter: () => true,
    spinnerHeight: 30,
    emptyResultHeight: 30,
    throttleDelay: 500,
    debounceDelay: 500,
    throttleDebounceThreshold: 3,
    style: {},
    allowEmpty: true,
    highlightedIndex: null,
    className: '',
    highlightMatches: true,
    disabled: false,
    readonly: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.menuOpen !== prevState.menuOpen) {
      return {
        dirty: true,
        menuOpen: nextProps.menuOpen,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    const {
      name,
      value,
      items,
      select,
      menuOpen,
      throttleDelay,
      debounceDelay,
      highlightedIndex,
    } = props;

    this.randomId = Math.random().toString(36).substr(2, 9);
    this.id = `Autocomplete__${name || this.randomId}`;

    this.state = {
      menuOpen,
      highlightedIndex: highlightedIndex || 0,
      open: false,
      dirty: false,
      menuStyle: null,
      loading: isFunction(items),
      items: isFunction(items) ? [] : items,
    };

    // Setup throttle/debounce.
    this.updateItemsThrottled = this.updateItems;
    this.updateItemsDebounced = this.updateItems;
    if (!select) {
      this.updateItemsThrottled = throttle(throttleDelay, this.updateItems);
      this.updateItemsDebounced = debounce(debounceDelay, this.updateItems);
    }

    // Filter items that should be displayed using itemFilter.
    const [filteredItems] = this.filterItems(this.state.items);
    this.filteredItems = filteredItems;

    // Calculate items if necessary.
    setTimeout(() => this.updateItems(value));
  }

  onRef = (input) => {
    this.input = input;
    const { onRef } = this.props;
    if (isFunction(onRef)) {
      onRef(input);
    }
  };

  onLayout = () => {
    const self = this;

    // Make sure the menu is properly lined up.
    if (self.input) {
      self.input.measure((fx, fy, width, height) => {
        const { menuStyle } = self.state;
        if (
          !menuStyle
          || menuStyle.width !== width
          || menuStyle.top !== height
          || menuStyle.left !== fx
        ) {
          self.onMount(() => self.setState({
            menuStyle: {
              width,
              top: height,
              left: fx,
              maxHeight: 200,
            },
          }));
        }
      });
    }
  };

  onChangeText = (text) => {
    const { allowEmpty, onChangeText, throttleDebounceThreshold } = this.props;

    onChangeText(text);

    const nextState = {
      loading: true,
    };
    if (this.isUncontrolled()) {
      nextState.open = true;
    }

    this.onMount(() => this.setState(nextState));

    if (allowEmpty && !text.length) {
      this.onSelectEmpty();
    } else if (text.length > throttleDebounceThreshold) {
      this.updateItemsDebounced(text);
    } else {
      this.updateItemsThrottled(text);
    }
  };

  onKeyPress = (event) => {
    const { onKeyPress } = this.props;
    onKeyPress(event);

    // If the event hasn't been prevented.
    if (!event.isDefaultPrevented() && Platform.OS === 'web') {
      const { key } = event.nativeEvent;

      // If uncontrolled, close menu on escape.
      if (key === 'Escape' && this.isUncontrolled()) {
        event.preventDefault();
        this.onMount(() => this.setState({ open: false }));
      }

      // Move highlighted index based on arrows.
      if (key === 'ArrowUp' || key === 'ArrowDown') {
        const { highlightedIndex } = this.state;
        const increment = key === 'ArrowUp' ? -1 : 1;
        let nextHighlightedIndex = (highlightedIndex + increment) % this.filteredItems.length;
        if (nextHighlightedIndex < 0) {
          nextHighlightedIndex = this.filteredItems.length + nextHighlightedIndex;
        }
        event.preventDefault();
        this.onMount(() => this.setState({ highlightedIndex: nextHighlightedIndex }));
      }
    }
  };

  onFocus = (event) => {
    const { onFocus } = this.props;

    this.focusTimestamp = Date.now();

    onFocus(event);
    if (
      !event.isDefaultPrevented()
      && this.isUncontrolled()
      && this.isMenuVisibleWhenFocused()

      // Work around to be able to close menu on select.
      && this.isValidEvent(event)
    ) {
      this.onMount(() => this.setState({ open: true }));
    }
  };

  onClick = () => {
    if (this.isUncontrolled()) {
      const { open } = this.state;
      if (!this.focusTimestamp || Date.now() - this.focusTimestamp > 400) {
        this.onMount(() => this.setState({ open: !open }));
      } else {
        this.onMount(() => this.setState({ open: true }));
      }
    }
  };

  onBlur = (event) => {
    const { onBlur } = this.props;

    event.persist();

    // Delay the onBlur event to avoid calling onBlur
    // after clicking on the menu.
    setTimeout(() => {
      if (this.isValidEvent(event)) {
        onBlur(event);

        if (!event.isDefaultPrevented() && this.isUncontrolled()) {
          this.onMount(() => this.setState({ open: false }));
        }
      }
    }, getEventValidationTime());
  };

  onSubmitEditing = () => {
    const { highlightedIndex } = this.state;

    // Select the current highlighted index by pressing Enter.
    if (Platform.OS === 'web' && this.isMenuOpen() && this.filteredItems.length) {
      const index = Math.max(0, Math.min(this.filteredItems.length - 1, highlightedIndex));
      this.onSelect(this.filteredItems[index], index);
    }
  };

  onSelect = (item, index) => {
    const {
      select,
      onSelect,
      getItemValue,
      closeMenuOnSelect,
    } = this.props;

    this.selectTimestamp = Date.now();

    onSelect(item ? getItemValue(item) : '', item);

    const nextState = {
      loading: false,
      highlightedIndex: Math.max(0, index - (select ? 0 : 1)),
    };
    if (this.isUncontrolled()) {
      nextState.open = closeMenuOnSelect ? false : this.isMenuOpen();
    }
    this.onMount(() => this.setState(nextState));

    if (this.input) {
      // The trigger may have happened by clicking on the menu.
      // To make sure the focus is still on the TextInput, we call .focus().
      this.input.focus();
    }

    // Recalculate items in the background.
    this.updateItems();
  };

  onSelectEmpty = () => this.onSelect(null, 0);

  isValidEvent(event) {
    if (Platform.OS === 'web') {
      const { relatedTarget } = event.nativeEvent;
      if (!relatedTarget) {
        return true;
      }

      const parent = document.querySelector(`[data-class~="${this.id}"]`);
      if (!parent) {
        return true;
      }
      return !parent.contains(relatedTarget);
    }
    return (
      !this.selectTimestamp
      || Date.now() - this.selectTimestamp > 800
    );
  }

  isUncontrolled() {
    const { menuOpen } = this.props;
    return menuOpen === null;
  }

  isMenuOpen() {
    const { menuOpen, disabled, readonly } = this.props;

    if (disabled || readonly) {
      return false;
    }

    if (menuOpen !== null) {
      return menuOpen;
    }

    const { open } = this.state;
    return open;
  }

  isMenuVisibleWhenFocused() {
    const { menuVisibleWhenFocused } = this.props;
    if (menuVisibleWhenFocused !== null) {
      return menuVisibleWhenFocused;
    }
    if (this.filteredItems.length <= 20) {
      return true;
    }
    return false;
  }

  getParams() {
    return {
      ...this.props,
      ...this.state,
    };
  }

  async findItemMatches(text, items) {
    const { isMatch, maxMatches } = this.props;
    const list = items || [];

    const limit = maxMatches || 30;

    const requestId = this.request.id;
    const matches = [];
    const params = this.getParams();
    for (
      let i = 0;
      i < list.length && matches.length <= limit && this.request.id === requestId;
      i += 1
    ) {
      if (i > 0 && i % 30 === 0) {
        await wait(100); // eslint-disable-line
      }
      const item = list[i];
      if (isMatch(text, item, params)) {
        matches.push(item);
      }
    }
    return matches;
  }

  filterItems(items) {
    const { itemFilter } = this.props;
    const { highlightedIndex } = this.state;

    const nextFilteredItems = (
      items && items.current
        ? items.current
        : items
    ).filter(itemFilter);

    const nextHighlightedIndex = isEqual(nextFilteredItems, this.filteredItems)
      ? highlightedIndex : 0;

    return [nextFilteredItems, nextHighlightedIndex];
  }

  async getItems(text) {
    const { items: itemsProp } = this.props;
    const { items: itemsState } = this.state;

    let query = text;
    if (query === null || query === undefined) {
      query = '';
    }

    // There may be several requests being sent simultaneously,
    // so we need to know which one was the last one sent.
    const requestId = Math.random().toString(36).substr(2, 9);

    // This request is now the last request.
    this.request = {
      id: requestId,
      loading: true,
      items: itemsState,
    };

    // If items is a ref, use the action ref.
    if (itemsProp && itemsProp.current) {
      this.request.loading = false;
      this.request.items = itemsProp;
      return this.request.items;
    }

    let nextItems;
    if (!isFunction(itemsProp)) {
      nextItems = await this.findItemMatches(query, itemsProp);
    } else {
      nextItems = await itemsProp(query, this.getParams());
    }

    // If this request is still the latest request.
    if (this.request.id === requestId) {
      this.request.loading = false;
      this.request.items = nextItems;
    }

    return nextItems;
  }

  async updateItems(text) {
    this.onMount(() => this.setState({
      dirty: false,
    }));

    const items = await this.getItems(text);

    const [nextFilteredItems, nextHighlightedIndex] = this.filterItems(items);
    this.filteredItems = nextFilteredItems;

    this.onMount(() => this.setState({
      items,
      loading: this.request.loading,
      highlightedIndex: nextHighlightedIndex,
    }));
  }

  render() {
    const {
      Menu,
      Input,
      inputProps,
      style,
      itemHeight,
      spinnerHeight,
      emptyResultHeight,
      value,
      valueLabel,
      containerStyle,
      className,
      getItemValue,
      getItemLabel,
      menuStyle,
    } = this.props;

    const {
      open,
      dirty,
      items,
      loading,
      menuOpen,
      highlightedIndex,
      menuStyle: calculatedMenuStyle,
    } = this.state;

    const autoCompleteType = `random_${this.randomId}`;

    const props = omit(this.props, propNames);
    if (Platform.OS === 'web') {
      props.autoComplete = autoCompleteType;
    } else {
      props.autoCompleteType = autoCompleteType;
    }

    const { minWidth, maxWidth, width } = StyleSheet.flatten([style]);
    const { maxHeight } = StyleSheet.flatten([calculatedMenuStyle, menuStyle]);

    // Re-filter to make sure we display the latest values.
    const [currentFilteredItems, currentHighlightedIndex] = this.filterItems(items);
    this.filteredItems = currentFilteredItems;

    const height = (
      2
      + Math.min(currentFilteredItems.length * itemHeight, maxHeight)
      + (loading ? spinnerHeight : 0)
      + (!currentFilteredItems.length && !loading ? emptyResultHeight : 0)
    );

    let showMenu = false;
    if (menuOpen !== null) {
      showMenu = menuOpen;
    } else {
      showMenu = open && (this.isMenuVisibleWhenFocused() || !isEmpty(props.value));
    }

    let text = valueLabel;
    if (text === undefined) {
      text = value;
    }

    if (dirty || highlightedIndex !== currentHighlightedIndex) {
      setTimeout(() => this.updateItems(value));
    }

    if (showMenu) {
      this.onLayout();
    }

    return (
      <View
        className={`${className} Autocomplete__Container ${this.id}`}
        style={[{ minWidth, maxWidth, width }, containerStyle]}
      >
        <Input
          {...props}
          {...inputProps}
          value={blankOr(text)}
          blurOnSubmit={false}
          autoComplete={autoCompleteType}
          onRef={this.onRef}
          onLayout={this.onLayout}
          onKeyPress={this.onKeyPress}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onSubmitEditing}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onClick={this.onClick}
        />
        {showMenu ? (
          <Menu
            {...this.props}
            {...this.state}
            getItemLabel={getItemLabel === undefined ? getItemValue : getItemLabel}
            style={[
              calculatedMenuStyle,
              { height },
              menuStyle,
            ]}
            items={currentFilteredItems}
            onSelect={this.onSelect}
            autocompleteId={this.id}
          />
        ) : null}
      </View>
    );
  }
}

export default withTheme('Autocomplete')(Autocomplete);
