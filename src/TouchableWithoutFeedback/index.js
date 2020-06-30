import React from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback as RNTouchableWithoutFeedback } from 'react-native';
import { withTheme } from '../Theme';

const TouchableWithoutFeedback = ({
  theme,
  onRef,
  className,
  ...props
}) => {
  const params = {
    ...theme.omit(props),
    dataSet: { class: className },
    'data-class': className,
    ref: undefined,
  };
  if (onRef) {
    params.ref = onRef;
  }
  return <RNTouchableWithoutFeedback {...params} />;
};

TouchableWithoutFeedback.propTypes = {
  theme: PropTypes.shape().isRequired,
  className: PropTypes.string,
  onRef: PropTypes.func,
};

TouchableWithoutFeedback.defaultProps = {
  className: '',
  onRef: null,
};

const TouchableWithoutFeedbackWithTheme = withTheme('TouchableWithoutFeedback')(TouchableWithoutFeedback);

// eslint-disable-next-line
export default React.forwardRef((props, ref) => <TouchableWithoutFeedbackWithTheme {...props} />);
