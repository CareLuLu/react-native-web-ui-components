import React, { useRef } from 'react';
import { Platform, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { useSafeState } from '../utils';
import Autocomplete from '../Autocomplete';
import View from '../View';
import StylePropType from '../StylePropType';
import TextInput from '../TextInput';
import { withTheme } from '../Theme';
import { Helmet, style } from '../Helmet';

const styles = StyleSheet.create({
  empty: {},
  outerRow: {
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  inputDefaults: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    height: 40,
  },
  fitOuterRowRight: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  fitOuterRowLeft: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  select: {},
  menu: {
    marginTop: 5,
    maxHeight: 280,
  },
  item: {
    lineHeight: 35,
    height: 35,
    paddingLeft: 10,
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 10,
  },
  gray: {
    borderColor: '#545454',
    backgroundColor: '#545454',
  },
  grayText: {
    color: '#FFFFFF',
  },
  lightGray: {
    borderColor: '#BFBFBF',
    backgroundColor: '#BFBFBF',
  },
  lightGrayText: {
    color: '#FFFFFF',
  },
  yellow: {
    borderColor: '#FEB715',
    backgroundColor: '#FEB715',
  },
  yellowText: {
    color: '#FFFFFF',
  },
  pink: {
    borderColor: '#EE2D68',
    backgroundColor: '#EE2D68',
  },
  pinkText: {
    color: '#FFFFFF',
  },
  white: {
    borderColor: '#D3D6D6',
    backgroundColor: '#FFFFFF',
  },
  whiteText: {
    color: '#545454',
  },
  active: {
    opacity: 0.7,
  },
});

const getItemValue = item => item.value;
const getItemLabel = item => item.label;
const isMatch = () => true;

const measureTextWidth = (txt) => {
  const width = (txt.length * 6) + 30;
  return width;
};

const Input = ({
  focused,
  onTouchableBlur,
  onTouchableFocus,
  fitContent,
  center, // legacy
  selectStyle,
  selectTextStyle,
  align,
  type,
  onRef,
  value,
  placeholder,
  arrow,
  themeInputStyle,
  ...props
}) => {
  const input = useRef();
  const id = useRef(`ModalPicker__Input-${name || Math.random().toString(36).substr(2, 9)}`);

  const { name } = props;

  const inputOnRef = (ref) => {
    input.current = ref;
    if (onRef) {
      onRef(ref);
    }
  };

  const currentStyle = [
    styles.inputDefaults,
    themeInputStyle.border,
    themeInputStyle.background,
    themeInputStyle.opacity,
    themeInputStyle.text,
    styles[type],
    styles[`${type}Text`],
    selectStyle,
    selectTextStyle,
  ];
  const { color, ...otherStyles } = StyleSheet.flatten(currentStyle);

  if (fitContent) {
    currentStyle.push({ width: measureTextWidth(`${value || placeholder || 'aaa'}`) + 30 });
  } else {
    currentStyle.push({ width: '100%' });
  }
  if (type !== 'white') {
    const padding = otherStyles.padding || 0;
    const paddingTop = otherStyles.paddingTop || padding;
    const paddingBottom = otherStyles.paddingBottom || padding;
    if (paddingBottom && paddingBottom === paddingTop) {
      currentStyle.push({ paddingTop: paddingTop - 2 });
    }
  }

  let outer;
  if (!fitContent) {
    outer = styles.outerRow;
  } else if (align === 'right') {
    outer = styles.fitOuterRowRight;
  } else {
    outer = styles.fitOuterRowLeft;
  }

  outer = [props.style, outer]; // eslint-disable-line

  return (
    <>
      <Helmet>
        <style>
          {`
            [data-class~="${id.current}"] {
              cursor: pointer;
              color: transparent;
              caret-color: transparent;
              user-select: none;
              pointer-events: none;
              text-shadow: 0 0 0 ${color};
            }
            [data-class~="${id.current}__touchable"]:hover {
              cursor: pointer;
            }
            [data-class~="${id.current}"]::placeholder {
              color: ${color};
            }
            .ModalPicker__Arrow {
              position: absolute;
              top: calc(50% - 10px);
              right: 5px;
            }
          `}
        </style>
      </Helmet>
      <TouchableWithoutFeedback
        onPress={onTouchableFocus}
        onFocus={onTouchableFocus}
        onBlur={onTouchableBlur}
      >
        <View className={`${id.current}__touchable`} style={outer}>
          <TextInput
            {...props}
            value={value}
            placeholder={placeholder}
            onRef={inputOnRef}
            style={currentStyle}
            autoFocus={focused}
            caretHidden
            className={`ModalPicker__Input ${id.current}`}
          />
          {arrow ? (
            <svg
              className="ModalPicker__Arrow"
              fill={color}
              height="20"
              width="20"
              viewBox="0 0 20 20"
              focusable={false}
            >
              <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
            </svg>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

Input.propTypes = {
  focused: PropTypes.bool.isRequired,
  onTouchableFocus: PropTypes.func.isRequired,
  onTouchableBlur: PropTypes.func.isRequired,
  themeInputStyle: PropTypes.shape().isRequired,
  arrow: PropTypes.bool.isRequired,
  onRef: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  fitContent: PropTypes.bool,
  center: PropTypes.bool,
  align: PropTypes.string,
  selectStyle: StylePropType,
  selectTextStyle: StylePropType,
  name: PropTypes.string,
  value: PropTypes.any, // eslint-disable-line
};

Input.defaultProps = {
  fitContent: true,
  center: false,
  align: 'left',
  selectStyle: styles.empty,
  selectTextStyle: styles.empty,
  name: undefined,
  value: undefined,
};

const ModalPicker = ({
  options,
  onChange,
  onFocus,
  onBlur,
  type,
  arrow,
  themeInputStyle,
  value,
  activeStyle,
  menuStyle: originalMenuStyle,
  itemStyle: originalItemStyle,
  itemActiveStyle: originalItemActiveStyle,
  ...props
}) => {
  const { disabled } = props;
  const input = useRef();
  const [open, setOpen] = useSafeState(false);
  const [focused, setFocused] = useSafeState(false);

  const selectTimestamp = useRef(Date.now() - 1000);
  const pressTimestamp = useRef(Date.now() - 1000);

  const onRef = (ref) => {
    input.current = ref;
  };

  const onSelect = (__, item) => {
    selectTimestamp.current = Date.now();
    setOpen(false);
    setFocused(true);
    onChange(item);
  };

  const onKeyPress = (event) => {
    if (!event.isDefaultPrevented() && Platform.OS === 'web') {
      const { key } = event.nativeEvent;
      if (key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
    }
  };

  const focus = (event) => {
    selectTimestamp.current = Date.now();
    setOpen(!open);
    setFocused(true);
    onFocus(event);
    if (Platform.OS === 'web' && input.current) {
      input.current.focus();
    }
  };

  const blur = (event) => {
    selectTimestamp.current = Date.now();
    setOpen(false);
    setFocused(false);
    onBlur(event);
    if (Platform.OS === 'web' && input.current) {
      input.current.blur();
    }
  };

  const onTouchableFocus = (event) => {
    event.persist();
    setTimeout(() => {
      if (Date.now() - selectTimestamp.current > 800) {
        focus();
      }
    }, 100);
  };

  const onTouchableBlur = (event) => {
    event.persist();
    setTimeout(() => {
      if (Date.now() - selectTimestamp.current > 800) {
        blur();
      }
    }, 400);
  };

  const menuStyle = [styles.menu, originalMenuStyle];
  const itemStyle = [styles.item, originalItemStyle];
  const itemActiveStyle = [originalItemActiveStyle];
  if (type !== 'white') {
    menuStyle.push(styles[type]);
    itemStyle.push([styles[type], styles[`${type}Text`]]);
    itemActiveStyle.push([styles[type], styles[`${type}Text`], styles.active]);
  }

  const inputProps = {
    type,
    arrow,
    focused,
    themeInputStyle,
    onTouchableFocus,
    onTouchableBlur,
  };

  let valueLabel = '';
  options.forEach((option) => {
    if (option.value === value) {
      valueLabel = option.label;
    }
  });

  return (
    <Autocomplete
      {...props}
      value={value}
      valueLabel={valueLabel}
      menuOpen={!disabled && open}
      items={options}
      isMatch={isMatch}
      onRef={onRef}
      onSelect={onSelect}
      onKeyPress={onKeyPress}
      getItemLabel={getItemLabel}
      getItemValue={getItemValue}
      Input={Input}
      inputProps={inputProps}
      menuStyle={menuStyle}
      itemStyle={itemStyle}
      itemHeight={35}
      itemActiveStyle={itemActiveStyle}
      highlightedIndex={-1}
      highlightMatches={false}
    />
  );
};

ModalPicker.propTypes = {
  themeInputStyle: PropTypes.shape().isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  menuStyle: StylePropType,
  itemStyle: StylePropType,
  itemActiveStyle: StylePropType,
  activeStyle: StylePropType,
  arrow: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.any, // eslint-disable-line
};

ModalPicker.defaultProps = {
  onChange: noop,
  onFocus: noop,
  onBlur: noop,
  placeholder: 'Select...',
  type: 'gray',
  menuStyle: styles.empty,
  itemStyle: styles.empty,
  itemActiveStyle: styles.empty,
  activeStyle: styles.empty,
  arrow: true,
  disabled: false,
  value: undefined,
};

export default withTheme('ModalPicker')(ModalPicker);
