import React, { useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import reduce from 'lodash/reduce';
import isEqual from 'fast-deep-equal';
import { withTheme } from '../Theme';
import StylePropType from '../StylePropType';
import View from '../View';
import DefaultTag from './Tag';
import DefaultInput from './Input';

const defaultTags = [];

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

const styles = StyleSheet.create({
  container: {
    paddingLeft: 12,
    paddingRight: 0,
    minHeight: 40,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

const useEvents = ({
  text,
  value,
  onChange,
  allowNew,
  buildNew,
}) => {
  const [currentText, setCurrentText] = useState(`${text}`);

  const input = useRef();

  const onRef = (ref) => { input.current = ref; };
  const focus = () => (input.current && input.current.focus());
  const isFocused = () => (input.current && input.current.isFocused());
  const onChangeText = nextText => setCurrentText(nextText);

  const tags = value || defaultTags;

  const onSelect = (__, tag) => {
    const duplicate = reduce(tags, (r, t) => (r || isEqual(t, tag)), false);
    if (!duplicate) {
      onChange(tags.concat(tag));
    }
    setCurrentText('');
  };

  const onSubmitEditing = () => {
    if (currentText && allowNew) {
      onChange(tags.concat(buildNew(currentText)));
      setCurrentText('');
    }
  };

  const onDelete = index => onChange(tags.filter((tag, i) => (i !== index)));

  return {
    tags,
    focus,
    isFocused,
    onRef,
    onChangeText,
    onSelect,
    onSubmitEditing,
    onDelete,
    text: currentText,
  };
};

const TagInput = (props) => {
  const {
    tags,
    text,
    focus,
    isFocused,
    onDelete,
    ...handlers
  } = useEvents(props);

  const {
    Tag,
    tagStyle,
    Input,
    inputStyle,
    style,
    autoFocus,
    getItemValue,
    themeInputStyle,
  } = props;

  if (autoFocus && !isFocused()) {
    setTimeout(focus);
  }

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
      {tags.map((tag, index) => (
        <Tag
          {...props}
          onDelete={onDelete}
          key={getItemValue(tag)}
          tag={tag}
          index={index}
          style={tagStyle}
        />
      ))}
      <Input
        {...omit(props, forbiddenProps)}
        {...handlers}
        value={text}
        style={inputStyle}
      />
    </View>
  );
};

TagInput.propTypes = {
  themeInputStyle: PropTypes.shape().isRequired,
  allowNew: PropTypes.bool,
  buildNew: PropTypes.func,
  onChange: PropTypes.func,
  getItemValue: PropTypes.func,
  style: StylePropType,
  tagStyle: StylePropType,
  inputStyle: StylePropType,
  Tag: PropTypes.elementType,
  Input: PropTypes.elementType,
  autoFocus: PropTypes.bool,
  text: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  value: PropTypes.any, // eslint-disable-line
};

TagInput.defaultProps = {
  allowNew: true,
  buildNew: text => text,
  onChange: noop,
  getItemValue: item => item,
  style: null,
  tagStyle: null,
  inputStyle: null,
  Tag: DefaultTag,
  Input: DefaultInput,
  autoFocus: false,
  text: '',
  value: undefined,
};

export default withTheme('TagInput')(TagInput);
