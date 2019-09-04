import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity as RNTouchableOpacity } from 'react-native';
import noop from 'lodash/noop';
import { withTheme } from '../Theme';

const TouchableOpacity = ({
  theme,
  onRef,
  className,
  ...props
}) => (
  <RNTouchableOpacity ref={onRef} {...theme.omit(props)} data-class={className} />
);

TouchableOpacity.propTypes = {
  theme: PropTypes.shape().isRequired,
  className: PropTypes.string,
  onRef: PropTypes.func,
};

TouchableOpacity.defaultProps = {
  className: '',
  onRef: noop,
};

export default withTheme('TouchableOpacity')(TouchableOpacity);
