import React from 'react';
import { StyleSheet } from 'react-native';
import { withTheme } from '../Theme';
import BoxItem from '../BoxItem';
import StylePropType from '../StylePropType';

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
  style: StylePropType,
};

BoxButtonRow.defaultProps = {
  style: styles.empty,
};

export default withTheme('BoxButtonRow')(BoxButtonRow);
