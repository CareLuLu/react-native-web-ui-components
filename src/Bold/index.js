import React from 'react';
import { StyleSheet } from 'react-native';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import Text from '../Text';

const styles = StyleSheet.create({
  empty: {},
  defaults: {
    fontWeight: 'bold',
  },
});

const Bold = ({ style, ...props }) => {
  let currentStyle = styles.defaults;
  if (style !== styles.empty) {
    currentStyle = [styles.defaults, style];
  }
  return <Text {...props} style={currentStyle} />;
};

Bold.propTypes = {
  style: StylePropType,
};

Bold.defaultProps = {
  style: styles.empty,
};

export default withTheme('Bold')(Bold);
