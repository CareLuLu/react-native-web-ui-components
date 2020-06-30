import React from 'react';
import { StyleSheet } from 'react-native';
import { withTheme } from '../Theme';
import Row from '../Row';
import StylePropType from '../StylePropType';

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
  style: StylePropType,
};

BoxItem.defaultProps = {
  style: styles.empty,
};

export default withTheme('BoxItem')(BoxItem);
