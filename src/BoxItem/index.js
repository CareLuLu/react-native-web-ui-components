import React from 'react';
import { StyleSheet, ViewPropTypes } from 'react-native';
import { withTheme } from '../Theme';
import Row from '../Row';

const styles = StyleSheet.create({
  empty: {},
  defaults: {
    padding: 15,
    borderTopColor: '#D3D6D6',
    borderTopWidth: 1,
    borderStyle: 'solid',
  },
});

const BoxItem = ({ style, ...props }) => <Row {...props} style={[styles.defaults, style]} />;

BoxItem.propTypes = {
  style: ViewPropTypes.style,
};

BoxItem.defaultProps = {
  style: styles.empty,
};

export default withTheme('BoxItem')(BoxItem);
