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

const defaultGetItemLabel = item => item;

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
  'onSelect',
  'onSubmitEditing',
  'isMatch',
  'Input',
  'inputProps',
  'Menu',
  'menuStyle',
  'menuOpen',
  'Item',
  'itemStyle',
  'itemActiveStyle',
  'itemHeight',
  'itemProps',
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
    onSelect: PropTypes.func,
    onRef: PropTypes.func,
    onSubmitEditing: PropTypes.func,
    isMatch: PropTypes.func,
    Input: PropTypes.elementType,
    inputProps: PropTypes.shape(),
    Menu: PropTypes.elementType,
    menuStyle: StylePropType,
    menuOpen: PropTypes.bool,
    containerStyle: StylePropType,
    name: PropTypes.string,
    value: PropTypes.any, // eslint-disable-line
    valueLabel: PropTypes.any, // eslint-disable-line
    itemHeight: PropTypes.number,
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
    getItemLabel: defaultGetItemLabel,
    onChangeText: noop,
    onKeyPress: noop,
    onSelect: noop,
    onRef: noop,
    onSubmitEditing: noop,
    isMatch: defaultIsMatch,
    Input: DefaultInput,
    inputProps: {},
    Menu: DefaultMenu,
    menuStyle: null,
    menuOpen: null,
    containerStyle: null,
    name: undefined,
    value: undefined,
    valueLabel: undefined,
    itemHeight: 30,
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
      const { items, value, getItemValue } = nextProps;
      let nextHighlightedIndex = prevState.highlightedIndex;
      let nextItems = prevState.items;
      if (!isFunction(items)) {
        nextItems = items;
        nextHighlightedIndex = -1;
        nextItems.forEach((item, i) => {
          if (getItemValue(item) === value) {
            nextHighlightedIndex = i;
          }
        });
      } else {
        setTimeout(() => this.updateItems(value));
      }
      return {
        items: nextItems,
        highlightedIndex: nextHighlightedIndex,
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
    } = props;
    this.fy = 0;
    this.state = {
      highlightedIndex,
      items: isFunction(items) ? [] : items,
      open: false,
      loading: isFunction(items),
      keyboardOffset: null,
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
        const { items, highlightedIndex } = this.state;
        const increment = key === 'ArrowUp' ? -1 : 1;
        let nextHighlightedIndex = (highlightedIndex + increment) % items.length;
        if (nextHighlightedIndex < 0) {
          nextHighlightedIndex = items.length + nextHighlightedIndex;
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

  onSubmitEditing = (event) => {
    const { open, items, highlightedIndex } = this.state;
    const { onSubmitEditing } = this.props;
    if (Platform.OS === 'web' && open && items.length > highlightedIndex) {
      this.onSelect(items[highlightedIndex], highlightedIndex);
      event.preventDefault();
    } else {
      onSubmitEditing(event);
    }
  };

  onSelect = (item, index) => {
    const { onSelect, getItemValue } = this.props;
    onSelect(getItemValue(item), item);
    this.onMount(() => this.setState({
      open: false,
      loading: false,
      highlightedIndex: index,
    }));
  };

  onSelectEmpty = () => {
    const { onSelect } = this.props;
    onSelect('', null);
    this.onMount(() => this.setState({
      open: false,
      loading: false,
      highlightedIndex: 0,
    }));
  };

  onRef = (input) => {
    const self = this;
    self.input = input;
    const { onRef } = self.props;
    if (isFunction(onRef)) {
      onRef(input);
    }
    setTimeout(() => {
      if (self.input) {
        self.input.measure((fx, fy, width, height, px, py) => {
          self.fy = fy;
          if (Platform.OS === 'web') {
            self.menuStyle = {
              width,
              top: height,
              left: fx,
              maxHeight: 200,
            };
          } else {
            const maxHeight = Math.max(0, Math.min(200, py));
            self.menuStyle = {
              width,
              maxHeight,
              top: fy - maxHeight,
              left: fx,
            };
          }
        });
      }
    });
  };

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
      items = this.filterItems(parsedText, items);
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
    const items = await this.getItems(text);
    const highlightedIndex = isEqual(items, this.state.items) ? this.state.highlightedIndex : 0;
    this.onMount(() => this.setState({
      items,
      highlightedIndex,
      loading: this.request.loading,
    }));
  };

  filterItems(text, items) {
    const { isMatch } = this.props;
    return filter(items, item => isMatch(text, item, this.getParams()));
  }

  render() {
    const {
      open,
      items,
      loading,
      keyboardOffset,
    } = this.state;
    const {
      Menu,
      menuOpen,
      Input,
      inputProps,
      style,
      itemHeight,
      spinnerHeight,
      emptyResultHeight,
      menuStyle,
      keyboard,
      value,
      valueLabel,
      containerStyle,
      className,
    } = this.props;
    const props = omit(this.props, propNames);
    if (Platform.OS === 'web') {
      props.autoComplete = 'off';
    } else {
      props.autoCompleteType = 'off';
    }
    const { minWidth, maxWidth, width } = StyleSheet.flatten([style]);
    const height = (
      2
      + (items.length * itemHeight)
      + (loading ? spinnerHeight : 0)
      + (!items.length && !loading ? emptyResultHeight : 0)
    );
    let mobileMenuStyle = null;
    if (Platform.OS !== 'web') {
      mobileMenuStyle = { top: this.fy - height + (keyboardOffset || 0) };
      if (keyboard > 0 && keyboardOffset === null) {
        setTimeout(this.onKeyboardOpen);
      }
      if (keyboard === 0 && keyboardOffset !== null) {
        setTimeout(this.onKeyboardClose);
      }
    }

    let showMenu = false;
    if (menuOpen !== null) {
      showMenu = menuOpen;
    } else {
      showMenu = open && !isEmpty(props.value);
    }

    let text = valueLabel;
    if (text === undefined) {
      text = value;
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
          onKeyPress={this.onKeyPress}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onSubmitEditing}
        />
        {showMenu ? (
          <Menu
            {...this.props}
            {...this.state}
            style={[
              this.menuStyle,
              { height },
              mobileMenuStyle,
              menuStyle,
            ]}
            items={items && items.current ? items.current : items}
            onSelect={this.onSelect}
            autocompleteId={this.id}
          />
        ) : null}
      </View>
    );
  }
}

export default withTheme('Autocomplete')(withKeyboard()(Autocomplete));
