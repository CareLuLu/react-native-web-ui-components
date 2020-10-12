import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
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
  white: {},
  whiteText: {},
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

const hexToRgb = (color) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  if (result) {
    return `rgb(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)})`;
  }
  return color || 'rgb(0,0,0)';
};

const Input = ({
  fitContent,
  selectStyle,
  selectTextStyle,
  align,
  type,
  value,
  placeholder,
  arrow,
  ...props
}) => {
  const { name } = props;
  const id = useRef(`ModalPicker__Input-${name || Math.random().toString(36).substr(2, 9)}`);

  const currentStyle = [
    styles[type],
    styles[`${type}Text`],
    selectStyle,
    selectTextStyle,
  ];
  const { color = '#545454' } = StyleSheet.flatten(currentStyle);

  currentStyle.push({ color: 'transparent' });

  if (fitContent) {
    currentStyle.push({ width: measureTextWidth(`${value || placeholder || 'aaa'}`) + 30 });
  } else {
    currentStyle.push({ width: '100%' });
  }

  let containerStyle;
  if (!fitContent) {
    containerStyle = styles.outerRow;
  } else if (align === 'right') {
    containerStyle = styles.fitOuterRowRight;
  } else {
    containerStyle = styles.fitOuterRowLeft;
  }

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
              text-shadow: 0 0 0 ${color};
            }
            [data-class~="${id.current}__container"]:hover {
              cursor: pointer;
            }
            [data-class~="${id.current}"]::placeholder {
              color: ${color};
              text-shadow: none;
            }
            ${arrow ? `
              [data-class~="${id.current}__container"] input {
                background-image: url('data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" fill="${hexToRgb(color)}" height="20" width="20" viewBox="0 0 20 20"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" /></svg>`)}');
                background-repeat: no-repeat;
                background-position: right 4px center;
              }
            ` : ''}
          `}
        </style>
      </Helmet>
      <View className={`${id.current}__container`} style={containerStyle}>
        <TextInput
          {...props}
          caretHidden
          value={value}
          placeholder={placeholder}
          style={currentStyle}
          className={`ModalPicker__Input ${id.current}`}
        />
      </View>
    </>
  );
};

Input.propTypes = {
  arrow: PropTypes.bool.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  fitContent: PropTypes.bool,
  align: PropTypes.string,
  selectStyle: StylePropType,
  selectTextStyle: StylePropType,
  name: PropTypes.string,
  value: PropTypes.any, // eslint-disable-line
};

Input.defaultProps = {
  fitContent: true,
  align: 'left',
  selectStyle: styles.empty,
  selectTextStyle: styles.empty,
  name: undefined,
  value: undefined,
};

const ModalPicker = ({
  options,
  onChange,
  type,
  arrow,
  value,
  containerStyle,
  activeStyle,
  menuStyle: originalMenuStyle,
  itemStyle: originalItemStyle,
  itemActiveStyle: originalItemActiveStyle,
  ...props
}) => {
  const onSelect = (__, item) => {
    onChange(item);
  };

  const menuStyle = [styles.menu, originalMenuStyle];
  const itemStyle = [styles.item, originalItemStyle];
  const itemActiveStyle = [originalItemActiveStyle];
  if (type !== 'white') {
    menuStyle.push(styles[type]);
    itemStyle.push([styles[type], styles[`${type}Text`]]);
    itemActiveStyle.push([styles[type], styles[`${type}Text`], styles.active]);
  }

  const inputProps = { type, arrow };

  let valueLabel = '';
  let highlightedIndex = -1;
  options.forEach((option, i) => {
    if (option.value === value) {
      highlightedIndex = i;
      valueLabel = option.label;
    }
  });

  return (
    <Autocomplete
      {...props}
      select
      closeMenuOnSelect
      menuVisibleWhenFocused
      value={value}
      valueLabel={valueLabel}
      items={options}
      isMatch={isMatch}
      onSelect={onSelect}
      getItemLabel={getItemLabel}
      getItemValue={getItemValue}
      Input={Input}
      inputProps={inputProps}
      menuStyle={menuStyle}
      itemStyle={itemStyle}
      itemHeight={35}
      itemActiveStyle={itemActiveStyle}
      highlightMatches={false}
      highlightedIndex={highlightedIndex}
    />
  );
};

ModalPicker.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  containerStyle: StylePropType,
  menuStyle: StylePropType,
  itemStyle: StylePropType,
  itemActiveStyle: StylePropType,
  activeStyle: StylePropType,
  arrow: PropTypes.bool,
  value: PropTypes.any, // eslint-disable-line
};

ModalPicker.defaultProps = {
  onChange: noop,
  placeholder: 'Select...',
  type: 'gray',
  containerStyle: styles.empty,
  menuStyle: styles.empty,
  itemStyle: styles.empty,
  itemActiveStyle: styles.empty,
  activeStyle: styles.empty,
  arrow: true,
  value: undefined,
};

export default withTheme('ModalPicker')(ModalPicker);
