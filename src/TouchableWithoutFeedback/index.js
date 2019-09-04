import React from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback as RNTouchableWithoutFeedback } from 'react-native';
import noop from 'lodash/noop';
import { withTheme } from '../Theme';

const TouchableWithoutFeedback = ({
  theme,
  onRef,
  className,
  ...props
}) => (
  <RNTouchableWithoutFeedback ref={onRef} {...theme.omit(props)} data-class={className} />
);

TouchableWithoutFeedback.propTypes = {
  theme: PropTypes.shape().isRequired,
  className: PropTypes.string,
  onRef: PropTypes.func,
};

TouchableWithoutFeedback.defaultProps = {
  className: '',
  onRef: noop,
};

export default withTheme('TouchableWithoutFeedback')(TouchableWithoutFeedback);
