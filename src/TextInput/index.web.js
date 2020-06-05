import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import pick from 'lodash/pick';
import { TextInput as RNTextInput, StyleSheet, Platform } from 'react-native';
import { Helmet, style } from '../Helmet';
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
    style: styleProp,
    ...params
  } = useTheme('TextInput', props);

  const id = useRef(Math.random().toString(36).substr(2, 9));

  const wrappedOnFocus = (...args) => {
    if (multiline && scroller) {
      scroller.setNativeProps({ scrollEnabled: false });
    }
    if (params.onFocus) {
      return params.onFocus(...args);
    }
    return true;
  };

  const wrappedOnBlur = (...args) => {
    if (multiline && scroller) {
      scroller.setNativeProps({ scrollEnabled: true });
    }
    if (params.onBlur) {
      return params.onBlur(...args);
    }
    return true;
  };

  const placeholderTextColor = StyleSheet.flatten(themeInputStyle.placeholder).color;

  if (!multiline) {
    return (
      <RNTextInput
        {...androidProps}
        {...pick(theme.omit(params), allowedAttributes)}
        ref={onRef}
        data-class={`TextInput ${className}`}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={[
          styles.defaults,
          themeInputStyle.border,
          themeInputStyle.background,
          themeInputStyle.opacity,
          themeInputStyle.text,
          multiline ? { height: 40 * numberOfLines } : null,
          styleProp,
        ]}
        onFocus={wrappedOnFocus}
        onBlur={wrappedOnBlur}
        editable={editable && !(disabled || readonly)}
        placeholderTextColor={placeholderTextColor}
      />
    );
  }

  const onTextareaChange = (e) => {
    const { onChange, onChangeText } = params;
    e.nativeEvent.text = e.target.value;
    const { text } = e.nativeEvent;
    if (onChange) {
      onChange(e);
    }
    if (onChangeText) {
      onChangeText(text);
    }
  };

  return (
    <>
      <Helmet>
        <style>
          {`
            [data-class~="TextInput__textarea__${id.current}"]::placeholder {
              color: ${placeholderTextColor};
              opacity: 1;
            }
            [data-class~="TextInput__textarea__${id.current}"]:-ms-input-placeholder {
              color: ${placeholderTextColor};
            }
            [data-class~="TextInput__textarea__${id.current}"]::-ms-input-placeholder {
              color: ${placeholderTextColor};
            }
          `}
        </style>
      </Helmet>
      <textarea
        autoCapitalize={params.autoCapitalize || 'sentences'}
        autoComplete={params.autoComplete || params.autoCompleteType || 'on'}
        autoCorrect={params.autoCorrect || params.autoCorrect === undefined ? 'on' : 'off'}
        autoFocus={params.autoFocus} // eslint-disable-line
        defaultValue={params.defaultValue}
        dir="auto"
        disabled={disabled}
        enterkeyhint={params.returnKeyType}
        maxLength={params.maxLength}
        onKeyPress={params.onKeyPress}
        onSelect={params.onSelect}
        placeholder={params.placeholder}
        readOnly={!editable || readonly}
        spellCheck={
          params.spellCheck !== null
            ? params.spellCheck
            : (params.autoCorrect || params.autoCorrect === undefined)
        }
        ref={onRef}
        data-class={`TextInput TextInput__textarea__${id.current} ${className}`}
        style={StyleSheet.flatten([
          styles.defaults,
          themeInputStyle.border,
          themeInputStyle.background,
          themeInputStyle.opacity,
          themeInputStyle.text,
          multiline ? { height: 40 * numberOfLines } : null,
          styleProp,
        ])}
        onFocus={wrappedOnFocus}
        onBlur={wrappedOnBlur}
        onChange={onTextareaChange}
        rows={numberOfLines}
        value={params.value}
      />
    </>
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
