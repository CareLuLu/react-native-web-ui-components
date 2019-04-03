import React from 'react';
import { StyleSheet } from 'react-native';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import Text from '../Text';

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    lineHeight: 40,
    height: 40,
    paddingLeft: 15,
  },
});

const BoxTitle = ({ style, ...props }) => <Text {...props} style={[styles.title, style]} />;

BoxTitle.propTypes = {
  style: StylePropType,
};

BoxTitle.defaultProps = {
  style: null,
};

export default withTheme('BoxTitle')(BoxTitle);
