import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity as RNTouchableOpacity } from 'react-native';
import { withTheme } from '../Theme';

const TouchableOpacity = ({ theme, className, ...props }) => (
  <RNTouchableOpacity {...theme.omit(props)} data-class={className} />
);

TouchableOpacity.propTypes = {
  theme: PropTypes.shape().isRequired,
  className: PropTypes.string,
};

TouchableOpacity.defaultProps = {
  className: '',
};

export default withTheme('TouchableOpacity')(TouchableOpacity);
