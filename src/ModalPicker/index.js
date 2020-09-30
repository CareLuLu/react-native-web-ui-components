import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import noop from 'lodash/noop';
import ModalSelector from './ModalSelector';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import Row from '../Row';

/* eslint react/no-unused-prop-types: 0 */

const keyExtractor = item => item.value;
const labelExtractor = item => item.label;

const styles = StyleSheet.create({
  empty: {},
  outerRow: {},
  fitOuterRowRight: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  fitOuterRowLeft: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  defaults: {
    height: 40,
    borderWidth: 0,
    padding: 0,
  },
  select: {
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  font: {
    lineHeight: 30,
    height: 30,
  },
  selectText: {
    fontSize: 13,
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
});

const ModalPicker = ({
  themeInputStyle,
  fitContent,
  align,
  type,
  selectStyle,
  selectTextStyle,
  options,
  placeholder,
  value,
  icon,
  onChange,
  onFocus,
  onBlur,
  style,
  disabled,
  readonly,
  fontFamily,
}) => {
  let outer;
  if (!fitContent) {
    outer = styles.outerRow;
  } else if (align === 'right') {
    outer = styles.fitOuterRowRight;
  } else {
    outer = styles.fitOuterRowLeft;
  }
  const font = [styles.font];
  if (fontFamily.regular !== 'system font') {
    font.push({ fontFamily: fontFamily.regular });
  }

  const currentStyle = [
    styles.defaults,
    style,
  ];

  const currentSelectStyle = [
    styles.select,
    themeInputStyle.border,
    themeInputStyle.background,
    themeInputStyle.opacity,
    styles[type],
    selectStyle,
  ];

  const currentSelectTextStyle = [
    styles.selectText,
    themeInputStyle.text,
    styles[`${type}Text`],
    selectTextStyle,
  ];

  return (
    <Row xs={12} style={outer}>
      <ModalSelector
        icon={icon}
        style={currentStyle}
        selectStyle={currentSelectStyle}
        selectTextStyle={currentSelectTextStyle}
        sectionTextStyle={font}
        optionTextStyle={font}
        cancelTextStyle={font}
        data={options}
        keyExtractor={keyExtractor}
        labelExtractor={labelExtractor}
        initValue={placeholder}
        value={value}
        disabled={disabled || readonly}
        onChange={onChange}
        onModalOpen={onFocus}
        onModalClose={onBlur}
      />
    </Row>
  );
};

ModalPicker.propTypes = {
  themeInputStyle: PropTypes.shape().isRequired,
  fontFamily: PropTypes.shape().isRequired,
  theme: PropTypes.shape().isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  value: PropTypes.any, // eslint-disable-line
  placeholder: PropTypes.node,
  type: PropTypes.string,
  arrow: PropTypes.bool,
  center: PropTypes.bool,
  fitContent: PropTypes.bool,
  align: PropTypes.string,
  style: StylePropType,
  selectStyle: StylePropType,
  selectTextStyle: StylePropType,
  optimized: PropTypes.bool,
  icon: PropTypes.string,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

ModalPicker.defaultProps = {
  icon: 'align-justify',
  value: null,
  placeholder: 'Select...',
  type: 'gray',
  arrow: true,
  center: false,
  fitContent: true,
  align: 'left',
  optimized: true,
  style: styles.empty,
  selectStyle: styles.empty,
  selectTextStyle: styles.empty,
  disabled: false,
  readonly: false,
  onFocus: noop,
  onBlur: noop,
};

export default withTheme('ModalPicker')(ModalPicker);
