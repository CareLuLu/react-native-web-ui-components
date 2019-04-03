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

// @TODO: Upgrade to latest react-dropzone version.
// In order to upgrade, we need to be able to upgrade
// to react >= 16.8
const Dropzone = ({
  style,
  accept,
  children,
  onDrop,
}) => (
  <RNDropzone onDrop={onDrop} accept={accept}>
    {({ getRootProps, getInputProps }) => (
      <div {...getRootProps()} style={{ ...styles.container, ...StyleSheet.flatten(style || {}) }}>
        <input {...getInputProps()} />
        <div style={styles.inner}>
          {children}
        </div>
      </div>
    )}
  </RNDropzone>
);

Dropzone.propTypes = {
  accept: PropTypes.arrayOf(PropTypes.string),
  onDrop: PropTypes.func,
  style: StylePropType,
  children: PropTypes.node,
};

Dropzone.defaultProps = {
  accept: ['*/*'],
  onDrop: noop,
  style: null,
  children: null,
};

export default withTheme('Dropzone')(Dropzone);
