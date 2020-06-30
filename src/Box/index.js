import React from 'react';
import { StyleSheet } from 'react-native';
import { withTheme } from '../Theme';
import Column from '../Column';
import StylePropType from '../StylePropType';

const styles = StyleSheet.create({
  empty: {},
  defaults: {
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    borderColor: '#D3D6D6',
    borderWidth: 1,
    borderStyle: 'solid',
  },
});

const Box = ({ style, ...props }) => <Column xs={12} {...props} style={[styles.defaults, style]} />;

Box.propTypes = {
  style: StylePropType,
};

Box.defaultProps = {
  style: styles.empty,
};

export default withTheme('Box')(Box);
