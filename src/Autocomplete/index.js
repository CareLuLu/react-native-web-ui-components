import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet } from 'react-native';
import { throttle, debounce } from 'throttle-debounce';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import filter from 'lodash/filter';
import isFunction from 'lodash/isFunction';
import isEqual from 'lodash/isEqual';
import { isEmpty, isSSR } from '../utils';
import { withTheme } from '../Theme';
import Screen, { withKeyboard } from '../Screen';
import View from '../View';
import StylePropType from '../StylePropType';
import DefaultInput from '../TextInput';
import DefaultMenu from './Menu';

/* eslint react/destructuring-assignment: 0 */

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

const isField = (element, classNameRegex) => {
  for (let node = element; node && node !== document; node = node.parentNode) {
    if (classNameRegex.test(node.getAttribute('data-class') || '')) {
      return true;
    }
  }
  return false;
};

const propNames = [
  'allowEmpty',
  'items',
  'getItemValue',
  'getItemLabel',
  'onChangeText',
  'onKeyPress',
  'onFocus',
  'onSelect',
  'onSubmitEditing',
  'isMatch',
  'Input',
  'inputProps',
  'Menu',
  'menuStyle',
  'menuOpen',
  'menuVisibleWhenFocused',
  'closeMenuOnSelect',
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
  'onMenuClose',
  'className',
  'highlightMatches',
  'valueLabel',
];

class Autocomplete extends React.Component {
  static propTypes = {
    keyboard: PropTypes.number.isRequired,
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
    getItemValue: PropTypes.func,
    getItemLabel: PropTypes.func,
    onChangeText: PropTypes.func,
    onKeyPress: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onSelect: PropTypes.func,
    onRef: PropTypes.func,
    onSubmitEditing: PropTypes.func,
    isMatch: PropTypes.func,
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
    onMenuClose: PropTypes.func,
    className: PropTypes.string,
    highlightMatches: PropTypes.bool,
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
    onSubmitEditing: noop,
    isMatch: defaultIsMatch,
    Input: DefaultInput,
    inputProps: {},
    Menu: DefaultMenu,
    menuStyle: null,
    menuOpen: null,
    menuVisibleWhenFocused: true,
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
    highlightedIndex: 0,
    onMenuClose: noop,
    className: '',
    highlightMatches: true,
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
      items,
      value,
      name,
      throttleDelay,
      debounceDelay,
      highlightedIndex,
      menuOpen,
    } = props;
    this.state = {
      menuOpen,
      highlightedIndex,
      items: isFunction(items) ? [] : items,
      open: false,
      dirty: false,
      loading: isFunction(items),
      keyboardOffset: null,
      menuStyle: null,
    };
    this.mountSteps = [];
    this.updateItemsThrottled = this.updateItems;
    this.updateItemsDebounced = this.updateItems;
    if (isFunction(items)) {
      this.updateItemsThrottled = throttle(throttleDelay, this.updateItems);
      this.updateItemsDebounced = debounce(debounceDelay, this.updateItems);
    }
    this.id = `Autocomplete__${name || Math.random().toString(36).substr(2, 9)}`;
    this.fieldRegex = new RegExp(`\\b${this.id}\\b`);

    const [filteredItems] = this.filterItems(this.state.items);
    this.filteredItems = filteredItems;

    setTimeout(() => this.updateItems(value));
  }

  componentDidMount() {
    if (Platform.OS === 'web' && !isSSR()) {
      window.addEventListener('click', this.clickListener);
    }
    this.mounted = true;
    this.onMount();
  }

  componentWillUnmount() {
    this.mounted = false;
    if (Platform.OS === 'web' && !isSSR()) {
      window.removeEventListener('click', this.clickListener);
    }
  }

  onMount(handler) {
    if (handler) {
      this.mountSteps.push(handler);
    }
    if (this.mounted) {
      const fn = this.mountSteps.shift();
      if (fn) {
        fn.call(this);
      }
    }
  }

  onChangeText = (text) => {
    const { allowEmpty, onChangeText, throttleDebounceThreshold } = this.props;
    onChangeText(text);
    this.onMount(() => this.setState({
      open: true,
      loading: true,
    }));
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
    if (!event.isDefaultPrevented() && Platform.OS === 'web') {
      const { key } = event.nativeEvent;
      if (key === 'Escape') {
        event.preventDefault();
        this.onMount(() => this.setState({ open: false }));
      } else if (key === 'ArrowUp' || key === 'ArrowDown') {
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

  onKeyboardOpen = () => {
    const self = this;
    self.onMount(() => self.setState({ keyboardOffset: 0 }));
    if (self.input) {
      self.input.measureInWindow((x, y) => {
        const { keyboard } = self.props;
        const keyboardOffset = Screen.getHeight() - keyboard - y;
        if (keyboard > 0 && keyboardOffset < 0) {
          self.onMount(() => self.setState({ keyboardOffset }));
        }
      });
    }
  };

  onKeyboardClose = () => this.onMount(() => this.setState({ keyboardOffset: null }));

  onFocus = () => {
    const { onFocus, menuVisibleWhenFocused } = this.props;
    if (
      menuVisibleWhenFocused
      && (
        !this.selectTimestamp
        || Date.now() - this.selectTimestamp > 800
      )
    ) {
      this.onMount(() => this.setState({ open: true }));
    }
    onFocus();
  };

  onBlur = () => {
    const { onBlur, onMenuClose } = this.props;

    setTimeout(() => {
      if (!this.selectTimestamp || Date.now() - this.selectTimestamp > 800) {
        onMenuClose();
        this.onMount(() => this.setState({ open: false }));
        onBlur();
      }
    }, 100);
  };

  onSubmitEditing = (event) => {
    const { open, highlightedIndex } = this.state;
    const { onSubmitEditing } = this.props;

    if (Platform.OS === 'web' && open && this.filteredItems.length) {
      const index = Math.min(this.filteredItems.length - 1, highlightedIndex);
      this.onSelect(this.filteredItems[index], index);
      event.preventDefault();
    } else {
      onSubmitEditing(event);
    }
  };

  onSelect = (item, index) => {
    const { onSelect, getItemValue, closeMenuOnSelect } = this.props;
    const { open } = this.state;

    this.selectTimestamp = Date.now();

    onSelect(getItemValue(item), item);
    this.onMount(() => this.setState({
      open: closeMenuOnSelect ? false : open,
      loading: false,
      highlightedIndex: index,
    }));

    if (this.input) {
      this.input.focus();
    }

    this.updateItems();
  };

  onSelectEmpty = () => {
    const { onSelect, closeMenuOnSelect } = this.props;
    const { open } = this.state;
    onSelect('', null);
    this.onMount(() => this.setState({
      open: closeMenuOnSelect ? false : open,
      loading: false,
      highlightedIndex: 0,
    }));
  };

  onRef = (input) => {
    this.input = input;
    const { onRef } = this.props;
    if (isFunction(onRef)) {
      onRef(input);
    }
  };

  onLayout = () => {
    const self = this;
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
  }

  getParams() {
    return { ...this.props, ...this.state };
  }

  async getItems(text) {
    let { items } = this.props;
    let parsedText = text;
    if (parsedText === null || parsedText === undefined) {
      parsedText = '';
    }
    const id = Math.random().toString(36).substr(2, 9);
    this.request = {
      id,
      loading: true,
      items: this.state.items,
    };
    if (items && items.current) {
      this.request.loading = false;
      this.request.items = items;
    } else if (isFunction(items)) {
      items = await items(parsedText, this.getParams());
      if (this.request.id === id) {
        this.request.loading = false;
        this.request.items = items;
      } else {
        return this.request.items;
      }
    } else {
      items = this.findItemMatches(parsedText, items);
      this.request.loading = false;
      this.request.items = items;
    }
    return items;
  }

  clickListener = (event) => {
    if (Platform.OS === 'web') {
      if (!isField(event.target, this.fieldRegex)) {
        const { onMenuClose } = this.props;
        onMenuClose();
        this.onMount(() => this.setState({ open: false }));
      }
    }
  };

  updateItems = async (text) => {
    this.onMount(() => this.setState({
      dirty: false,
    }));

    const items = await this.getItems(text);

    const [nextFilteredItems, nextHighlightedIndex] = this.filterItems(items);

    this.filteredItems = nextFilteredItems;

    this.onMount(() => this.setState({
      items,
      highlightedIndex: nextHighlightedIndex,
      loading: this.request.loading,
    }));
  };

  findItemMatches(text, items) {
    const { isMatch } = this.props;
    return filter(items, item => isMatch(text, item, this.getParams()));
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

  render() {
    const {
      open,
      dirty,
      items,
      loading,
      menuOpen,
      highlightedIndex,
      menuStyle: calculatedMenuStyle,
    } = this.state;

    const {
      Menu,
      Input,
      inputProps,
      style,
      itemHeight,
      spinnerHeight,
      emptyResultHeight,
      menuStyle,
      menuVisibleWhenFocused,
      value,
      valueLabel,
      containerStyle,
      className,
      getItemValue,
      getItemLabel,
    } = this.props;

    const autoCompleteType = `bad-browsers-${Math.random().toString(36).substr(2, 9)}`;

    const props = omit(this.props, propNames);
    if (Platform.OS === 'web') {
      props.autoComplete = autoCompleteType;
    } else {
      props.autoCompleteType = autoCompleteType;
    }

    const { minWidth, maxWidth, width } = StyleSheet.flatten([style]);
    const { maxHeight } = StyleSheet.flatten([calculatedMenuStyle, menuStyle]);

    const [currentFilteredItems, currentHighlightedIndex] = this.filterItems(items);

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
      showMenu = open && (menuVisibleWhenFocused || !isEmpty(props.value));
    }

    let text = valueLabel;
    if (text === undefined) {
      text = value;
    }

    if (dirty || highlightedIndex !== currentHighlightedIndex) {
      setTimeout(() => this.updateItems(value));
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
          onRef={this.onRef}
          onLayout={this.onLayout}
          onKeyPress={this.onKeyPress}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onSubmitEditing}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          autoComplete={autoCompleteType}
          blurOnSubmit={false}
        />
        {showMenu ? (
          <Menu
            {...this.props}
            {...this.state}
            getItemLabel={getItemLabel === undefined ? getItemValue : getItemLabel}
            style={[
              calculatedMenuStyle,
              { height },
              // mobileMenuStyle,
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

export default withTheme('Autocomplete')(withKeyboard()(Autocomplete));
