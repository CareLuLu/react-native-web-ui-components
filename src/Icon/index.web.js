import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from 'react-native';
import WebFontAwesome from 'react-fontawesome';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';

const styles = StyleSheet.create({
  empty: {},
  defaults: {},
});

const Icon = ({ name, style, className }) => (
  <Text className={className} style={[styles.defaults, style]}>
    <WebFontAwesome name={name} />
  </Text>
);

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  style: StylePropType,
  className: PropTypes.string,
};

Icon.defaultProps = {
  style: styles.empty,
  className: '',
};

export default withTheme('Icon')(Icon);
