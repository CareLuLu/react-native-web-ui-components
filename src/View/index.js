import React from 'react';
import PropTypes from 'prop-types';
import { View as RNView } from 'react-native';
import noop from 'lodash/noop';
import { withTheme } from '../Theme';

const View = ({
  theme,
  onRef,
  className,
  ...props
}) => (
  <RNView
    {...theme.omit(props)}
    ref={onRef}
    dataSet={{ class: className }}
    data-class={className}
  />
);

View.propTypes = {
  theme: PropTypes.shape().isRequired,
  className: PropTypes.string,
  onRef: PropTypes.func,
};

View.defaultProps = {
  className: '',
  onRef: noop,
};

export default withTheme('View')(View);
