import React from 'react';
import { StyleSheet, ViewPropTypes } from 'react-native';
import { withTheme } from '../Theme';
import BoxItem from '../BoxItem';

const styles = StyleSheet.create({
  empty: {},
  defaults: {
    alignItems: 'center',
  },
});

const BoxButtonRow = ({ style, ...props }) => (
  <BoxItem {...props} style={[styles.defaults, style]} />
);

BoxButtonRow.propTypes = {
  style: ViewPropTypes.style,
};

BoxButtonRow.defaultProps = {
  style: styles.empty,
};

export default withTheme('BoxButtonRow')(BoxButtonRow);
