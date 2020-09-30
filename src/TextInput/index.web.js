import React from 'react';
import PropTypes from 'prop-types';
import { UIManager, StyleSheet } from 'react-native';
import noop from 'lodash/noop';
import { isSSR } from '../utils';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import { Helmet, style } from '../Helmet';

const styles = StyleSheet.create({
  defaults: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    height: 40,
  },
});

const enhanceEvent = (event) => {
  const { nativeEvent } = event;
  nativeEvent.text = nativeEvent.target.value;
  return event;
};

const isEventComposing = nativeEvent => (
  nativeEvent.isComposing
  || nativeEvent.keyCode === 229
);

let resizeObserver = null;
const DOM_LAYOUT_HANDLER_NAME = '__reactLayoutHandler';

const callOnLayout = (entry, onLayout) => {
  UIManager.measure(entry.target, (x, y, width, height, left, top) => {
    const event = {
      nativeEvent: {
        layout: {
          x,
          y,
          width,
          height,
          left,
          top,
        },
      },
      timeStamp: Date.now(),
    };
    Object.defineProperty(event.nativeEvent, 'target', {
      enumerable: true,
      get: () => entry.target,
    });
    onLayout(event);
  });
};

const getResizeObserver = () => {
  if (!isSSR() && typeof window !== 'undefined' && typeof window.ResizeObserver !== 'undefined') {
    if (resizeObserver == null) {
      resizeObserver = new window.ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const onLayout = entry.target[DOM_LAYOUT_HANDLER_NAME];
          if (typeof onLayout === 'function') {
            callOnLayout(entry.target, onLayout);
          }
        });
      });
    }
  }
  return resizeObserver;
};

const observer = getResizeObserver();

class TextInput extends React.Component {
  static propTypes = {
    themeInputStyle: PropTypes.shape().isRequired,
    value: PropTypes.any, // eslint-disable-line
    defaultValue: PropTypes.any, // eslint-disable-line
    placeholder: PropTypes.string,
    className: PropTypes.string,
    autoFocus: PropTypes.bool,
    autoCapitalize: PropTypes.string,
    autoComplete: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    autoCompleteType: PropTypes.string,
    autoCorrect: PropTypes.bool,
    dir: PropTypes.string,
    editable: PropTypes.bool,
    keyboardType: PropTypes.string,
    multiline: PropTypes.bool,
    numberOfLines: PropTypes.number,
    blurOnSubmit: PropTypes.bool,
    onRef: PropTypes.func,
    onLayout: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onChangeText: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyPress: PropTypes.func,
    onSubmitEditing: PropTypes.func,
    onClick: PropTypes.func, // web-only
    returnKeyType: PropTypes.string,
    secureTextEntry: PropTypes.bool,
    spellCheck: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    maxLength: PropTypes.number,
    style: StylePropType,
  };

  static defaultProps = {
    value: '',
    defaultValue: undefined,
    placeholder: '',
    className: '',
    autoFocus: false,
    autoCapitalize: 'sentences',
    autoComplete: undefined,
    autoCompleteType: undefined,
    autoCorrect: true,
    dir: 'auto',
    editable: true,
    keyboardType: undefined,
    multiline: false,
    numberOfLines: 1,
    blurOnSubmit: null,
    onRef: noop,
    onLayout: null,
    onBlur: noop,
    onChange: noop,
    onChangeText: noop,
    onFocus: noop,
    onKeyPress: noop,
    onSubmitEditing: noop,
    onClick: noop, // web-only
    returnKeyType: undefined,
    secureTextEntry: false,
    spellCheck: undefined,
    disabled: false,
    readonly: false,
    maxLength: undefined,
    style: null,
  };

  constructor(props) {
    super(props);
    this.id = `TextInput__${Math.random().toString(36).substr(2, 9)}`;

    const { onRef } = props;
    onRef(this);
  }

  componentDidMount() {
    this.observe();
  }

  componentWillUnmount() {
    this.unobserve();
  }

  observe = () => {
    const { onLayout } = this.props;
    if (observer && onLayout && this.target) {
      observer.observe(this.target);
      this.target[DOM_LAYOUT_HANDLER_NAME] = onLayout;
    }
  };

  unobserve = () => {
    if (observer && this.target) {
      observer.unobserve(this.target);
      delete this.target[DOM_LAYOUT_HANDLER_NAME];
    }
  };

  onFocus = (event) => {
    const { onFocus } = this.props;
    return onFocus(enhanceEvent(event));
  };

  onBlur = (event) => {
    const { onBlur } = this.props;
    return onBlur(enhanceEvent(event));
  };

  onKeyPress = (event) => {
    const { onKeyPress } = this.props;
    return onKeyPress(enhanceEvent(event));
  };

  onKeyDown = (_event) => {
    const event = enhanceEvent(_event);
    event.stopPropagation();

    const {
      multiline,
      blurOnSubmit,
      onKeyPress,
      onSubmitEditing,
    } = this.props;

    const blurOnSubmitDefault = !multiline;
    const shouldBlurOnSubmit = blurOnSubmit == null ? blurOnSubmitDefault : blurOnSubmit;

    const { nativeEvent } = event;
    const isComposing = isEventComposing(nativeEvent);

    onKeyPress(event);

    if (
      event.key === 'Enter'
      && !event.shiftKey
      && !isComposing
      && !event.isDefaultPrevented()
    ) {
      if ((blurOnSubmit || !multiline) && onSubmitEditing) {
        // prevent "Enter" from inserting a newline or submitting a form
        event.preventDefault();
        onSubmitEditing(event);
      }
      if (shouldBlurOnSubmit && this.target) {
        this.target.blur();
      }
    }
  };

  onChange = (event) => {
    enhanceEvent(event);

    const { onChange, onChangeText } = this.props;
    const text = event.target.value;

    onChange(event);
    onChangeText(text);
  };

  onLayout = (target) => {
    const { onLayout } = this.props;

    this.target = target;

    if (onLayout) {
      callOnLayout(this, onLayout);
    }
  };

  isFocused() {
    const { activeElement } = document;
    return activeElement && activeElement.classList.contains(this.id);
  }

  clear() {
    if (this.target) {
      this.target.value = '';
    }
  }

  focus() {
    if (this.target && this.target.focus) {
      this.target.focus();
    }
  }

  blur() {
    if (this.target && this.target.blur) {
      this.target.blur();
    }
  }

  measure(callback) {
    UIManager.measure(this.target, callback);
  }

  measureInWindow(callback) {
    UIManager.measureInWindow(this.target, callback);
  }

  render() {
    const {
      themeInputStyle,
      value,
      defaultValue,
      placeholder,
      className,
      autoFocus,
      autoCapitalize,
      autoComplete,
      autoCompleteType,
      autoCorrect,
      dir,
      editable,
      keyboardType,
      multiline,
      numberOfLines,
      returnKeyType,
      secureTextEntry,
      spellCheck,
      disabled,
      readonly,
      maxLength,
      onClick,
      style: styleProp,
    } = this.props;

    let type;

    switch (keyboardType) {
      case 'email-address':
        type = 'email';
        break;
      case 'number-pad':
      case 'numeric':
        type = 'number';
        break;
      case 'phone-pad':
        type = 'tel';
        break;
      case 'search':
      case 'web-search':
        type = 'search';
        break;
      case 'url':
        type = 'url';
        break;
      default:
        type = 'text';
    }

    if (secureTextEntry) {
      type = 'password';
    }

    const params = {
      value,
      defaultValue,
      placeholder,
      autoFocus,
      autoCapitalize,
      dir,
      disabled,
      maxLength,
      onClick,
      autoComplete: autoComplete || autoCompleteType || 'on',
      autoCorrect: autoCorrect || autoCorrect === undefined ? 'on' : 'off',
      enterkeyhint: returnKeyType,
      readOnly: !editable || readonly,
      spellCheck: spellCheck !== null
        ? spellCheck
        : (autoCorrect || autoCorrect === undefined),
      style: StyleSheet.flatten([
        styles.defaults,
        themeInputStyle.border,
        themeInputStyle.background,
        themeInputStyle.opacity,
        themeInputStyle.text,
        multiline ? { height: 40 * numberOfLines } : null,
        styleProp,
      ]),
      'data-class': `TextInput TextInput__${this.id} ${className}`,
      ref: this.onLayout,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onChange: this.onChange,
      onKeyPress: this.onKeyPress,
      onKeyDown: this.onKeyDown,
    };

    if (multiline) {
      params.rows = numberOfLines;
    } else {
      params.type = type;
    }

    const placeholderTextColor = StyleSheet.flatten(themeInputStyle.placeholder).color;

    return (
      <>
        <Helmet>
          <style>
            {`
              [data-class~="TextInput__${this.id}"] {
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
              }
              [data-class~="TextInput__${this.id}"]::placeholder {
                color: ${placeholderTextColor};
                opacity: 1;
              }
              [data-class~="TextInput__${this.id}"]:-ms-input-placeholder {
                color: ${placeholderTextColor};
              }
              [data-class~="TextInput__${this.id}"]::-ms-input-placeholder {
                color: ${placeholderTextColor};
              }
            `}
          </style>
        </Helmet>
        {multiline ? (
          <textarea {...params} />
        ) : (
          <input {...params} />
        )}
      </>
    );
  }
}

export default withTheme('TextInput')(TextInput);
