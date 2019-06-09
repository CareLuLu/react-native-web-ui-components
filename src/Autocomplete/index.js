import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet } from 'react-native';
import {
  noop,
  omit,
  filter,
  isFunction,
} from 'lodash';
import { withTheme } from '../Theme';
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
  'containerStyle',
];

class Autocomplete extends EventHandler {
  static propTypes = {
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
  };

  constructor(props) {
    super(props);
    const { items, value, name } = props;
    this.state = {
      items: isFunction(items) ? [] : items,
      open: false,
      loading: isFunction(items),
      highlightedIndex: 0,
    };
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
    const { onChangeText } = this.props;
    onChangeText(text);
    this.onMount(() => this.setState({
      open: true,
      loading: true,
      highlightedIndex: 0,
    }));
    this.updateItems(text);
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
    const { onRef } = this.props;
    if (isFunction(onRef)) {
      onRef(input);
    }
    if (input) {
      input.measure((fx, fy, width, height, px, py) => {
        if (Platform.OS === 'web') {
          this.menuStyle = {
            width,
            top: height,
            left: fx,
            maxHeight: 200,
          };
        } else {
          const maxHeight = Math.max(0, Math.min(200, py));
          this.menuStyle = {
            width,
            maxHeight,
            top: fy - maxHeight,
            left: fx,
          };
        }
      });
    }
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
    if (isFunction(items)) {
      items = await items(parsedText, this.getParams());
    } else {
      items = this.filterItems(parsedText, items);
    }
    return items;
  }

  async updateItems(text) {
    const items = await this.getItems(text);
    this.onMount(() => this.setState({
      items,
      loading: false,
      highlightedIndex: 0,
    }));
  }

  render() {
    const { open } = this.state;
    const {
      Menu,
      Input,
      style,
      menuStyle,
      containerStyle,
    } = this.props;
    const props = omit(this.props, propNames);
    if (Platform.OS === 'web') {
      props.autoComplete = 'off';
    } else {
      props.autoCompleteType = 'off';
    }
    const { minWidth, maxWidth, width } = StyleSheet.flatten([style]);
    return (
      <View className={this.id} style={[{ minWidth, maxWidth, width }, containerStyle]}>
        <Input
          {...props}
          onRef={this.onRef}
          onKeyPress={this.onKeyPress}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onSubmitEditing}
        />
        {open ? (
          <Menu
            {...this.props}
            {...this.state}
            style={[
              this.menuStyle,
              menuStyle,
            ]}
            onSelect={this.onSelect}
          />
        ) : null}
      </View>
    );
  }
}

export default withTheme('Autocomplete')(Autocomplete);
