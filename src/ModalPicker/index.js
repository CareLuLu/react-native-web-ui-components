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
  outerRow: {
    alignItems: 'center',
  },
  fitOuterRowRight: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  fitOuterRowLeft: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  select: {
    height: 32,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  font: {
    lineHeight: 30,
    height: 30,
    fontFamily: 'Lucida Sans',
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
});

const ModalPicker = ({
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
  style,
  disabled,
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
  const font = [styles.font, { fontFamily: fontFamily.regular }];
  return (
    <Row xs={12} style={outer}>
      <ModalSelector
        icon={icon}
        style={style}
        selectStyle={[styles.select, styles[type], selectStyle]}
        selectTextStyle={[font, styles[`${type}Text`], selectTextStyle]}
        sectionTextStyle={font}
        optionTextStyle={font}
        cancelTextStyle={font}
        data={options}
        keyExtractor={keyExtractor}
        labelExtractor={labelExtractor}
        initValue={placeholder}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onModalOpen={onFocus}
      />
    </Row>
  );
};

ModalPicker.propTypes = {
  fontFamily: PropTypes.shape().isRequired,
  theme: PropTypes.shape().isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  value: PropTypes.string,
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
  onFocus: PropTypes.func,
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
  onFocus: noop,
};

export default withTheme('ModalPicker')(ModalPicker);
