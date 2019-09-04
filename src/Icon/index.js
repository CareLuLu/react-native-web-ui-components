import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';

const styles = StyleSheet.create({
  empty: {},
  defaults: {
    fontSize: 13,
  },
});

const Icon = ({ name, style }) => <FontAwesome name={name} style={[styles.defaults, style]} />;

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  style: StylePropType,
};

Icon.defaultProps = {
  style: styles.empty,
};

export default withTheme('Icon')(Icon);
