import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { noop, omit, reduce } from 'lodash';
import {
  withProps,
  withHandlers,
  withStateHandlers,
  compose,
} from 'recompact';
import isEqual from 'fast-deep-equal';
import { withTheme } from '../Theme';
import StylePropType from '../StylePropType';
import View from '../View';
import DefaultTag from './Tag';
import DefaultInput from './Input';

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

const onChangeTextHandler = () => text => ({ text });

const onSelectHandler = (__, { tags, onChange }) => (___, tag) => {
  const duplicate = reduce(tags, (r, t) => (r || isEqual(t, tag)), false);
  if (!duplicate) {
    onChange(tags.concat(tag));
  }
  return { text: '' };
};

const onDeleteHandler = ({ tags, onChange }) => index => onChange(tags
  .filter((tag, i) => (i !== index)));

const onSubmitEditingHandler = ({ text }, {
  tags,
  onChange,
  allowNew,
  buildNew,
}) => () => {
  if (text && allowNew) {
    onChange(tags.concat(buildNew(text)));
    return { text: '' };
  }
  return {};
};

const TagInput = compose(
  withProps(({ value }) => ({ tags: value || [] })),
  withHandlers(() => {
    let input;
    return {
      onDelete: onDeleteHandler,
      onRef: () => (ref) => { input = ref; },
      focus: () => () => (input && input.focus()),
      isFocused: () => () => (input && input.isFocused()),
    };
  }),
  withStateHandlers(({ text }) => ({ text: `${text}` }), {
    onChangeText: onChangeTextHandler,
    onSelect: onSelectHandler,
    onSubmitEditing: onSubmitEditingHandler,
  }),
)(({
  text,
  tags,
  style,
  tagStyle,
  inputStyle,
  Tag,
  Input,
  focus,
  isFocused,
  onRef,
  ...props
}) => {
  const { themeInputStyle, getItemValue, autoFocus } = props;
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
          key={getItemValue(tag)}
          tag={tag}
          index={index}
          style={tagStyle}
        />
      ))}
      <Input
        {...omit(props, ['allowNew', 'buildNew', 'onChange', 'onDelete'])}
        onRef={onRef}
        value={text}
        style={inputStyle}
      />
    </View>
  );
});

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
  value: [],

};

export default withTheme('TagInput')(TagInput);
