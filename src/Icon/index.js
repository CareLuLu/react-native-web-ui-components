import React from 'react';
import camelCase from 'lodash/camelCase';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from 'react-native';
import NativeFontAwesome, { Icons } from 'react-native-fontawesome';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';

const styles = StyleSheet.create({
  empty: {},
  defaults: {},
});

const Icon = ({ name, style }) => (
  <Text style={[styles.defaults, style]}>
    <NativeFontAwesome>{Icons[camelCase(name)]}</NativeFontAwesome>
  </Text>
);

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  style: StylePropType,
};

Icon.defaultProps = {
  style: styles.empty,
};

export default withTheme('Icon')(Icon);
