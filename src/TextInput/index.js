import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import pick from 'lodash/pick';
import { TextInput as RNTextInput, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../Theme';
import StylePropType from '../StylePropType';

const styles = StyleSheet.create({
  empty: {},
  defaults: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    height: 40,
  },
});

const allowedAttributes = [
  'allowFontScaling',
  'autoCapitalize',
  'autoCompleteType',
  'autoCorrect',
  'autoFocus',
  'blurOnSubmit',
  'caretHidden',
  'clearButtonMode',
  'clearTextOnFocus',
  'contextMenuHidden',
  'dataDetectorTypes',
  'defaultValue',
  'disableFullscreenUI',
  'editable',
  'enablesReturnKeyAutomatically',
  'importantForAutofill',
  'inlineImageLeft',
  'inlineImagePadding',
  'inputAccessoryViewID',
  'keyboardAppearance',
  'keyboardType',
  'maxFontSizeMultiplier',
  'maxLength',
  'multiline',
  'numberOfLines',
  'onBlur',
  'onChange',
  'onChangeText',
  'onContentSizeChange',
  'onEndEditing',
  'onFocus',
  'onKeyPress',
  'onLayout',
  'onScroll',
  'onSelectionChange',
  'onSubmitEditing',
  'placeholder',
  'placeholderTextColor',
  'returnKeyLabel',
  'returnKeyType',
  'rejectResponderTermination',
  'scrollEnabled',
  'secureTextEntry',
  'selection',
  'selectionColor',
  'selectionState',
  'selectTextOnFocus',
  'showSoftInputOnFocus',
  'spellCheck',
  'textContentType',
  'style',
  'textBreakStrategy',
  'underlineColorAndroid',
  'value',
];

const androidProps = {};
if (Platform.OS === 'android') {
  androidProps.textAlignVertical = 'top';
}

const TextInput = (props) => {
  const {
    // Make sure we don't send hasError to RNTextInput
    // since it's not a valid prop for <input>.
    hasError,
    style,
    multiline,
    numberOfLines,
    disabled,
    readonly,
    editable,
    className,
    theme,
    themeInputStyle,
    onRef,
    scroller,
    ...params
  } = useTheme('TextInput', props);

  const wrappedOnFocus = (...args) => {
    if (multiline && scroller) {
      scroller.setNativeProps({ scrollEnabled: false });
    }
    if (params.onFocus) {
      return params.onFocus(...args);
    }
    return null;
  };

  const wrappedOnBlur = (...args) => {
    if (multiline && scroller) {
      scroller.setNativeProps({ scrollEnabled: true });
    }
    if (params.onBlur) {
      return params.onBlur(...args);
    }
    return null;
  };

  return (
    <RNTextInput
      {...androidProps}
      {...pick(theme.omit(params), allowedAttributes)}
      ref={onRef}
      multiline={multiline}
      numberOfLines={numberOfLines}
      style={[
        styles.defaults,
        themeInputStyle.border,
        themeInputStyle.background,
        themeInputStyle.opacity,
        themeInputStyle.text,
        multiline ? { height: 40 * numberOfLines } : null,
        style,
      ]}
      onFocus={wrappedOnFocus}
      onBlur={wrappedOnBlur}
      editable={editable && !(disabled || readonly)}
      placeholderTextColor={StyleSheet.flatten(themeInputStyle.placeholder).color}
    />
  );
};

TextInput.propTypes = {
  style: StylePropType,
  multiline: PropTypes.bool,
  numberOfLines: PropTypes.number,
  readonly: PropTypes.bool,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  className: PropTypes.string,
  onRef: PropTypes.func,
  editable: PropTypes.bool,
};

TextInput.defaultProps = {
  style: styles.empty,
  multiline: false,
  numberOfLines: 1,
  readonly: false,
  disabled: false,
  hasError: false,
  className: '',
  onRef: noop,
  editable: true,
};

export default TextInput;
