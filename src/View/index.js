import React from 'react';
import PropTypes from 'prop-types';
import { View as RNView } from 'react-native';
import { withTheme } from '../Theme';

const View = ({ theme, ...props }) => <RNView {...theme.omit(props)} />;

View.propTypes = {
  theme: PropTypes.shape().isRequired,
};

export default withTheme('View')(View);
