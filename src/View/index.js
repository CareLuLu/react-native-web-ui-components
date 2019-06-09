import React from 'react';
import PropTypes from 'prop-types';
import { View as RNView } from 'react-native';
import { withTheme } from '../Theme';

const View = ({ theme, className, ...props }) => (
  <RNView {...theme.omit(props)} data-class={className} />
);

View.propTypes = {
  theme: PropTypes.shape().isRequired,
  className: PropTypes.string,
};

View.defaultProps = {
  className: '',
};

export default withTheme('View')(View);
