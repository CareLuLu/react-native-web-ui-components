import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import { withTheme } from '../Theme';
import EventHandler from '../EventHandler';
import StylePropType from '../StylePropType';
import DefaultTag from './Tag';
import DefaultInput from './Input';

const styles = StyleSheet.create({
  container: {
    paddingRight: 0,
    minHeight: 40,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  tagContainer: {
    zIndex: 11,
    paddingLeft: 12,
    width: '100%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  input: {
    paddingLeft: 12,
  },
  overlay: {
    position: 'absolute',
    zIndex: 10,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

const forbiddenProps = [
  'style',
  'tagStyle',
  'inputStyle',
  'Tag',
  'Input',
  'allowNew',
  'buildNew',
  'onChange',
];

class TagInput extends EventHandler {
  static propTypes = {
    themeInputStyle: PropTypes.shape().isRequired,
    allowNew: PropTypes.bool,
    buildNew: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    readonly: PropTypes.bool,
    getItemValue: PropTypes.func,
    style: StylePropType,
    tagStyle: StylePropType,
    tagContainerStyle: StylePropType,
    inputStyle: StylePropType,
    Tag: PropTypes.elementType,
    Input: PropTypes.elementType,
    autoFocus: PropTypes.bool,
    text: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    value: PropTypes.any, // eslint-disable-line
  };

  static defaultProps = {
    allowNew: true,
    buildNew: text => text,
    onChange: noop,
    onFocus: noop,
    onBlur: noop,
    readonly: false,
    getItemValue: item => item,
    style: null,
    tagStyle: null,
    tagContainerStyle: null,
    inputStyle: null,
    Tag: DefaultTag,
    Input: DefaultInput,
    autoFocus: false,
    text: '',
    value: undefined,
  };

  constructor(props) {
    super(props);

    const {
      text,
      value,
      autoFocus,
    } = props;

    this.tags = value || [];

    this.state = {
      text: `${text}`,
      focused: autoFocus,
    };
  }

  onInputRef = (ref) => {
    this.input = ref;
  };

  onInputChangeText = text => this.onMount(() => this.setState({ text }));

  onInputFocus = () => this.focus();

  onInputBlur = () => {
    const self = this;
    setTimeout(() => {
      if (!self.selectTimestamp || Date.now() - self.selectTimestamp > 800) {
        this.blur();
      }
    }, 100);
  };

  onInputSelect = (__, item) => {
    this.selectTimestamp = Date.now();
    const { onChange } = this.props;

    const { isSameItem, tags } = this;
    const duplicate = tags.reduce((r, tag) => (r || isSameItem(item, tag)), false);

    if (!duplicate) {
      onChange(tags.concat(item));
    }

    this.onMount(() => this.setState({ text: '' }));
  };

  onInputSubmit = () => {
    const { text } = this.state;
    const { allowNew, buildNew, onChange } = this.props;

    if (text && allowNew) {
      onChange(this.tags.concat(buildNew(text)));
      this.onMount(() => this.setState({ text: '' }));
    }
  };

  onTagDelete = (index) => {
    const { onChange } = this.props;
    onChange(this.tags.filter((tag, i) => (i !== index)));
  };

  focus = () => {
    const { focused } = this.state;

    if (!focused) {
      const { onFocus } = this.props;
      onFocus();

      this.onMount(() => this.setState({
        focused: true,
      }));
    }
  };

  blur = () => {
    const { onBlur } = this.props;
    onBlur();

    this.onMount(() => this.setState({
      focused: false,
    }));
  };

  itemFilter = (item) => {
    const { isSameItem, tags } = this;
    return tags.reduce((r, tag) => (r && !isSameItem(item, tag)), true);
  };

  isSameItem = (item1, item2) => {
    const { getItemValue } = this.props;
    return getItemValue(item1) === getItemValue(item2);
  };

  render() {
    const {
      value,
      Tag,
      tagStyle,
      tagContainerStyle,
      Input,
      inputStyle,
      style,
      getItemValue,
      themeInputStyle,
      readonly,
    } = this.props;

    this.tags = value || [];

    const { text, focused } = this.state;

    return (
      <View
        style={[
          styles.container,
          themeInputStyle.border,
          themeInputStyle.background,
          themeInputStyle.opacity,
          style,
        ]}
      >
        {this.tags.length ? (
          <View style={[styles.tagContainer, tagContainerStyle]}>
            {this.tags.map((tag, index) => (
              <Tag
                {...this.props}
                onDelete={readonly ? noop : this.onTagDelete}
                key={getItemValue(tag)}
                tag={tag}
                index={index}
                style={tagStyle}
              />
            ))}
            {!focused ? (
              <TouchableWithoutFeedback onPress={readonly ? noop : this.focus}>
                <View style={styles.overlay} />
              </TouchableWithoutFeedback>
            ) : null}
          </View>
        ) : null}
        {!this.tags.length && !focused ? (
          <TouchableWithoutFeedback onPress={readonly ? noop : this.focus}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        ) : null}
        {focused ? (
          <Input
            {...omit(this.props, forbiddenProps)}
            autoFocus
            closeMenuOnSelect={false}
            value={text}
            style={[styles.input, inputStyle]}
            itemFilter={this.itemFilter}
            onFocus={this.onInputFocus}
            onBlur={this.onInputBlur}
            onRef={this.onInputRef}
            onChangeText={this.onInputChangeText}
            onSelect={this.onInputSelect}
            onSubmitEditing={this.onInputSubmit}
          />
        ) : null}
      </View>
    );
  }
}

export default withTheme('TagInput')(TagInput);
