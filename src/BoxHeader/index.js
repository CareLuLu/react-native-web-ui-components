import React from 'react';
import { StyleSheet, ViewPropTypes } from 'react-native';
import { withTheme } from '../Theme';
import Row from '../Row';

const styles = StyleSheet.create({
  empty: {},
  defaults: {
    backgroundColor: '#D4D4D4',
    height: 40,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
});

const BoxHeader = ({ style, ...props }) => <Row {...props} style={[styles.defaults, style]} />;

BoxHeader.propTypes = {
  style: ViewPropTypes.style,
};

BoxHeader.defaultProps = {
  style: styles.empty,
};

export default withTheme('BoxHeader')(BoxHeader);
