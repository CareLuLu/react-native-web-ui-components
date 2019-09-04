import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import RNDropzone from 'react-dropzone';
import noop from 'lodash/noop';
import { withTheme } from '../Theme';
import StylePropType from '../StylePropType';

const styles = {
  container: {
    borderWidth: 5,
    borderStyle: 'dashed',
    borderColor: '#E0E0E0',
    width: '100%',
    minHeight: 150,
  },
  inner: {},
};

const Dropzone = ({
  theme,
  style,
  accept,
  children,
  onDrop,
  multiple,
  disabled,
}) => (
  <RNDropzone
    onDrop={onDrop}
    accept={accept[0] === '*/*' ? null : accept}
    multiple={multiple}
    disabled={disabled}
  >
    {({ getRootProps, getInputProps }) => {
      const currentStyle = [styles.container];
      if (disabled) {
        currentStyle.push(theme.input.disabled.opacity);
      }
      currentStyle.push(style);
      return (
        <div {...getRootProps()} style={{ ...StyleSheet.flatten(currentStyle) }}>
          <input {...getInputProps()} />
          <div style={styles.inner}>
            {children}
          </div>
        </div>
      );
    }}
  </RNDropzone>
);

Dropzone.propTypes = {
  theme: PropTypes.shape().isRequired,
  accept: PropTypes.arrayOf(PropTypes.string),
  onDrop: PropTypes.func,
  style: StylePropType,
  children: PropTypes.node,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
};

Dropzone.defaultProps = {
  accept: ['*/*'],
  onDrop: noop,
  style: null,
  children: null,
  multiple: true,
  disabled: false,
};

export default withTheme('Dropzone')(Dropzone);
