import React from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback as RNTouchableWithoutFeedback } from 'react-native';
import { withTheme } from '../Theme';

const TouchableWithoutFeedback = ({ theme, className, ...props }) => (
  <RNTouchableWithoutFeedback {...theme.omit(props)} data-class={className} />
);

TouchableWithoutFeedback.propTypes = {
  theme: PropTypes.shape().isRequired,
  className: PropTypes.string,
};

TouchableWithoutFeedback.defaultProps = {
  className: '',
};

export default withTheme('TouchableWithoutFeedback')(TouchableWithoutFeedback);
