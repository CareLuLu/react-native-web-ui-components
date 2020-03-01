import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform } from 'react-native';
import noop from 'lodash/noop';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import createDomStyle from '../createDomStyle';
import ModalPicker from '../ModalPicker';
import { Helmet, style } from '../Helmet';

/* eslint react/destructuring-assignment: 0 */

const styles = StyleSheet.create({
  empty: {},
  select: {
    height: 40,
    borderRadius: 2,
  },
  selectText: {
    paddingLeft: Platform.OS === 'web' ? 10 : 5,
    textAlign: 'left',
    fontSize: Platform.OS === 'web' ? undefined : 13,
  },
  selectContainer: {
    marginBottom: 10,
    height: 40,
    borderWidth: 0,
    padding: 0,
  },
  fullWidth: {
    width: '100%',
  },
  auto: {
    marginBottom: 0,
  },
  noMargin: {
    marginBottom: 0,
  },
});

const Select = ({
  themeInputStyle,
  onFocus,
  onBlur,
  name,
  autoFocus,
  value,
  values,
  labels,
  readonly,
  disabled,
  placeholder,
  css,
  auto,
  onChange,
  nomargin,
  ...props
}) => {
  const onWrappedChange = selected => onChange(selected.value, name);

  const valueLabels = labels === null ? values : labels;
  const options = values.map((v, i) => ({
    value: v,
    label: valueLabels[i],
  }));
  const empty = value === '' || value === null || value === undefined;
  if (!empty && placeholder !== null) {
    options.unshift({
      value: '',
      label: placeholder,
    });
  }
  let label = placeholder;
  if (!empty) {
    const index = values.indexOf(value);
    if (index >= 0) {
      label = labels[index];
    }
  }
  const selectStyle = [
    themeInputStyle.background,
    themeInputStyle.border,
    themeInputStyle.opacity,
  ];
  const selectTextStyle = [themeInputStyle.text];
  if (empty) {
    selectTextStyle.push(themeInputStyle.placeholder);
  }
  const id = `Select__${(name && name.replace(/\./g, '-')) || Math.random().toString(36).substr(2, 9)}`;
  return (
    <>
      <Helmet>
        <style>
          {`
            ${!empty && placeholder !== null ? `
              [data-class~="Autocomplete__${id}"] [data-class~="Autocomplete__Item-0"] {
                ${createDomStyle([selectTextStyle, themeInputStyle.placeholder])}
              }
            ` : ''}
          `}
        </style>
      </Helmet>
      <ModalPicker
        name={id}
        icon="caret-down"
        type="white"
        className="Select__Container"
        value={value}
        style={[
          styles.selectContainer,
          auto ? styles.auto : styles.fullWidth,
          nomargin ? styles.noMargin : null,
          props.containerStyle,
        ]}
        selectStyle={[styles.select, selectStyle, props.selectStyle]}
        selectTextStyle={[styles.selectText, selectTextStyle, props.selectTextStyle]}
        autoFocus={autoFocus}
        disabled={disabled || readonly}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onWrappedChange}
        placeholder={label}
        options={options}
        fitContent={false}
      />
    </>
  );
};

Select.propTypes = {
  themeInputStyle: PropTypes.shape().isRequired,
  values: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired).isRequired,
  name: PropTypes.string.isRequired,
  autoFocus: PropTypes.bool,
  labels: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  placeholder: PropTypes.string,
  readonly: PropTypes.bool,
  disabled: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  css: PropTypes.string,
  containerStyle: StylePropType,
  selectStyle: StylePropType,
  selectTextStyle: StylePropType,
  auto: PropTypes.bool,
  nomargin: PropTypes.bool,
};

Select.defaultProps = {
  autoFocus: false,
  value: '',
  labels: null,
  placeholder: null,
  readonly: false,
  disabled: false,
  onFocus: noop,
  onBlur: noop,
  onChange: noop,
  css: '',
  containerStyle: styles.empty,
  selectStyle: styles.empty,
  selectTextStyle: styles.empty,
  auto: false,
  nomargin: false,
};

export default withTheme('Select')(Select);
