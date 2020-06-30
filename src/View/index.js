import React from 'react';
import PropTypes from 'prop-types';
import { View as RNView } from 'react-native';
import { withTheme } from '../Theme';

const View = ({
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
  return <RNView {...params} />;
};

View.propTypes = {
  theme: PropTypes.shape().isRequired,
  className: PropTypes.string,
  onRef: PropTypes.func,
};

View.defaultProps = {
  className: '',
  onRef: null,
};

const ViewWithTheme = withTheme('View')(View);

// eslint-disable-next-line
export default React.forwardRef((props, ref) => <ViewWithTheme {...props} />);
