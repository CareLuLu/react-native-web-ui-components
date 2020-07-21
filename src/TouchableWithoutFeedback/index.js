import React from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback as TouchableWithoutFeedbackRN } from 'react-native';
import View from '../View';

const TouchableWithoutFeedback = ({ onPress, ...props }) => (
  <TouchableWithoutFeedbackRN onPress={onPress}>
    <View {...props} />
  </TouchableWithoutFeedbackRN>
);

TouchableWithoutFeedback.propTypes = {
  onPress: PropTypes.func,
};

TouchableWithoutFeedback.defaultProps = {
  onPress: undefined,
};

export default TouchableWithoutFeedback;

