import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import noop from 'lodash/noop';
import createDomStyle from '../createDomStyle';
import StylePropType from '../StylePropType';
import { Helmet, style } from '../Helmet';
import { withTheme } from '../Theme';
import ModalPicker from '../ModalPicker';

/* eslint react/destructuring-assignment: 0 */

const styles = StyleSheet.create({
  empty: {},
  select: {
    height: 40,
    borderRadius: 2,
  },
  selectText: {
    paddingLeft: 5,
    textAlign: 'left',
    fontSize: 13,
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
  const onWrappedChange = useCallback(selected => onChange(selected.value, name), [onChange, name]);

  const valueLabels = labels === null ? values : labels;
  const options = values.map((v, i) => ({
    value: `${v}`,
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
    <React.Fragment>
      <Helmet>
        <style>
          {`
            .select.select-${id} {
              ${auto ? '' : 'width: 100%;'}
              margin-bottom: ${auto || nomargin ? 0 : 10}px;
            }
            .select.select-${id} .select__control {
              height: 40px;
            }
            .select.select-${id} .select__placeholder {
              ${createDomStyle(themeInputStyle[empty ? 'placeholder' : 'text'])}
              white-space: nowrap;
              overflow: hidden;
            }
            .select.select-${id} .select__dropdown-indicator path {
              ${createDomStyle(themeInputStyle[empty ? 'placeholder' : 'text'])}
            }
            .select.select-${id} .select__control.select__control--is-disabled {
              ${createDomStyle(themeInputStyle.background)}
              ${createDomStyle(themeInputStyle.border)}
              ${createDomStyle(themeInputStyle.opacity)}
            }
            ${!empty && placeholder !== null ? `
            .select.select-${id} .select__option:first-child {
              ${createDomStyle(themeInputStyle.placeholder)}
            }
            .select.select-${id} .select__option--is-focused.select__option:first-child {
              color: ${StyleSheet.flatten(themeInputStyle.background).backgroundColor};
            }
            ` : ''}
            .select.select-${id} .select__control {
              ${createDomStyle(themeInputStyle.background)}
              ${createDomStyle(themeInputStyle.border)}
              ${createDomStyle(themeInputStyle.opacity)}
              border-color: ${StyleSheet.flatten(themeInputStyle.border).borderColor}; !important;
            }
            .select.select-${id} .select__indicator-separator {
              background-color: ${StyleSheet.flatten(themeInputStyle.border).borderColor};
            }
            .select.select-${id} .select__control.select__control--is-focused {
              border-color: ${StyleSheet.flatten(themeInputStyle.border).borderColor};
              box-shadow: none;
            }
            .select.select-${id} .select__option--is-focused {
              background-color: ${StyleSheet.flatten(themeInputStyle.border).borderColor};
            }
            ${css}
          `}
        </style>
      </Helmet>
      <ModalPicker
        name={id}
        icon="caret-down"
        type="white"
        value={`${value}`}
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
        onChange={onWrappedChange}
        placeholder={label}
        options={options}
        fitContent={false}
      />
    </React.Fragment>
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
  onChange: noop,
  css: '',
  containerStyle: styles.empty,
  selectStyle: styles.empty,
  selectTextStyle: styles.empty,
  auto: false,
  nomargin: false,
};

export default withTheme('Select')(Select);
