import React from 'react';
import { StyleSheet } from 'react-native';
import { withTheme } from '../Theme';
import Row from '../Row';
import StylePropType from '../StylePropType';

const styles = StyleSheet.create({
  empty: {},
  defaults: {
    backgroundColor: '#D4D4D4',
    height: 40,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    alignItems: 'center',
  },
});

const BoxHeader = ({ style, ...props }) => <Row {...props} style={[styles.defaults, style]} />;

BoxHeader.propTypes = {
  style: StylePropType,
};

BoxHeader.defaultProps = {
  style: styles.empty,
};

export default withTheme('BoxHeader')(BoxHeader);
