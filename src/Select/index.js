import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import noop from 'lodash/noop';
import { withTheme } from '../Theme';
import createDomStyle from '../createDomStyle';
import StylePropType from '../StylePropType';
import ModalPicker from '../ModalPicker';
import { Helmet, style } from '../Helmet';

const Select = ({
  themeInputStyle,
  name,
  value,
  values,
  labels,
  placeholder,
  selectTextStyle: originalSelectTextStyle,
  onChange: originalOnChange,
  ...props
}) => {
  const id = useRef(`Select__${(name && name.replace(/\./g, '-')) || Math.random().toString(36).substr(2, 9)}`);

  const onChange = selected => originalOnChange(selected.value, name);

  const valueLabels = labels === null ? values : labels;
  const options = values.map((v, i) => ({
    value: v,
    label: valueLabels[i],
  }));

  const empty = value === '' || value === null || value === undefined;
  if (placeholder !== null) {
    options.unshift({
      value: null,
      label: placeholder,
    });
  }

  let label = placeholder || '';
  if (!empty) {
    const index = values.indexOf(value);
    if (index >= 0) {
      label = labels[index];
    }
  }

  const selectTextStyle = [originalSelectTextStyle];
  if (label === placeholder) {
    selectTextStyle.push(themeInputStyle.placeholder);
  }

  const osParams = {};
  if (Platform.OS === 'web') {
    const {
      selectStyle,
      style: styleProp,
    } = props;

    osParams.selectTextStyle = [styleProp, selectStyle, selectTextStyle];
  } else {
    osParams.selectTextStyle = selectTextStyle;
  }

  return (
    <>
      <Helmet>
        <style>
          {`
            ${placeholder !== null ? `
              [data-class~="Autocomplete__${id.current}"] [data-class~="Autocomplete__Item-0"] {
                ${createDomStyle(themeInputStyle.placeholder)}
              }
            ` : ''}
          `}
        </style>
      </Helmet>
      <ModalPicker
        {...props}
        {...osParams}
        name={id.current}
        icon="caret-down"
        type="white"
        className="Select__Container"
        value={value}
        onChange={onChange}
        placeholder={label}
        options={options}
        fitContent={false}
      />
    </>
  );
};

Select.propTypes = {
  themeInputStyle: PropTypes.shape().isRequired,
  values: PropTypes.arrayOf(PropTypes.any.isRequired).isRequired,
  onChange: PropTypes.func,
  name: PropTypes.string,
  labels: PropTypes.arrayOf(PropTypes.string),
  style: StylePropType,
  selectStyle: StylePropType,
  selectTextStyle: StylePropType,
  placeholder: PropTypes.string,
  value: PropTypes.any, // eslint-disable-line
};

Select.defaultProps = {
  onChange: noop,
  name: undefined,
  labels: null,
  style: null,
  selectStyle: null,
  selectTextStyle: null,
  placeholder: null,
  value: undefined,
};

export default withTheme('Select')(Select);
