import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet } from 'react-native';
import { throttle, debounce } from 'throttle-debounce';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import filter from 'lodash/filter';
import isFunction from 'lodash/isFunction';
import isEqual from 'lodash/isEqual';
import { isEmpty } from '../utils';
import { withTheme } from '../Theme';
import Screen, { withKeyboard } from '../Screen';
import EventHandler from '../EventHandler';
import View from '../View';
import StylePropType from '../StylePropType';
import DefaultInput from '../TextInput';
import DefaultMenu from './Menu';

const defaultGetItemValue = item => item;

const defaultIsMatch = (text, item, { getItemValue }) => {
  if (text === '' || `${getItemValue(item)}`.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
    return true;
  }
  return false;
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
  'items',
  'getItemValue',
  'onChangeText',
  'onKeyPress',
  'onSelect',
  'onSubmitEditing',
  'isMatch',
  'Input',
  'Menu',
  'menuStyle',
  'Item',
  'itemStyle',
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
];

class Autocomplete extends EventHandler {
  static propTypes = {
    keyboard: PropTypes.number.isRequired,
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
    getItemValue: PropTypes.func,
    onChangeText: PropTypes.func,
    onKeyPress: PropTypes.func,
    onSelect: PropTypes.func,
    onRef: PropTypes.func,
    onSubmitEditing: PropTypes.func,
    isMatch: PropTypes.func,
    Input: PropTypes.elementType,
    Menu: PropTypes.elementType,
    menuStyle: StylePropType,
    containerStyle: StylePropType,
    name: PropTypes.string,
    value: PropTypes.any, // eslint-disable-line
    itemHeight: PropTypes.number,
    spinnerHeight: PropTypes.number,
    emptyResultHeight: PropTypes.number,
    throttleDelay: PropTypes.number,
    debounceDelay: PropTypes.number,
    throttleDebounceThreshold: PropTypes.number,
  };

  static defaultProps = {
    items: [],
    getItemValue: defaultGetItemValue,
    onChangeText: noop,
    onKeyPress: noop,
    onSelect: noop,
    onRef: noop,
    onSubmitEditing: noop,
    isMatch: defaultIsMatch,
    Input: DefaultInput,
    Menu: DefaultMenu,
    menuStyle: null,
    containerStyle: null,
    name: undefined,
    value: undefined,
    itemHeight: 30,
    spinnerHeight: 30,
    emptyResultHeight: 30,
    throttleDelay: 500,
    debounceDelay: 500,
    throttleDebounceThreshold: 3,
  };

  constructor(props) {
    super(props);
    const {
      items,
      value,
      name,
      throttleDelay,
      debounceDelay,
    } = props;
    this.fy = 0;
    this.state = {
      items: isFunction(items) ? [] : items,
      open: false,
      loading: isFunction(items),
      highlightedIndex: 0,
      keyboardOffset: null,
    };
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
    if (Platform.OS === 'web') {
      window.addEventListener('click', this.clickListener);
    }
    this.mounted = true;
    this.onMount();
  }

  componentWillUnmount() {
    this.mounted = false;
    if (Platform.OS === 'web') {
      window.removeEventListener('click', this.clickListener);
    }
  }

  onChangeText = (text) => {
    const { onChangeText, throttleDebounceThreshold } = this.props;
    onChangeText(text);
    this.onMount(() => this.setState({
      open: true,
      loading: true,
    }));
    if (text.length > throttleDebounceThreshold) {
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

  clickListener = (event) => {
    if (Platform.OS === 'web') {
      if (!isField(event.target, this.fieldRegex)) {
        this.onMount(() => this.setState({ open: false }));
      }
    }
  };

  getParams() {
    return { ...this.props, ...this.state };
  }

  filterItems(text, items) {
    const { isMatch } = this.props;
    return filter(items, item => isMatch(text, item, this.getParams()));
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
    if (isFunction(items)) {
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

  updateItems = async (text) => {
    const items = await this.getItems(text);
    const highlightedIndex = isEqual(items, this.state.items) ? this.state.highlightedIndex : 0;
    this.onMount(() => this.setState({
      items,
      highlightedIndex,
      loading: this.request.loading,
    }));
  };

  render() {
    const {
      open,
      items,
      loading,
      keyboardOffset,
    } = this.state;
    const {
      Menu,
      Input,
      style,
      itemHeight,
      spinnerHeight,
      emptyResultHeight,
      menuStyle,
      keyboard,
      containerStyle,
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

    return (
      <View className={this.id} style={[{ minWidth, maxWidth, width }, containerStyle]}>
        <Input
          {...props}
          onRef={this.onRef}
          onKeyPress={this.onKeyPress}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onSubmitEditing}
        />
        {open && !isEmpty(props.value) ? (
          <Menu
            {...this.props}
            {...this.state}
            style={[
              this.menuStyle,
              { height },
              mobileMenuStyle,
              menuStyle,
            ]}
            onSelect={this.onSelect}
          />
        ) : null}
      </View>
    );
  }
}

export default withTheme('Autocomplete')(withKeyboard()(Autocomplete));
