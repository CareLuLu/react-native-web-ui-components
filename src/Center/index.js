import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { withTheme } from '../Theme';
import Row from '../Row';
import StylePropType from '../StylePropType';

const styles = StyleSheet.create({
  empty: {},
  defaults: {
    justifyContent: 'center',
  },
});

const Center = ({ style, ...props }) => <Row style={[styles.defaults, style]} {...props} />;

Center.propTypes = {
  style: StylePropType,
  xs: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Center.defaultProps = {
  style: styles.empty,
  xs: 12,
};

export default withTheme('Center')(Center);
