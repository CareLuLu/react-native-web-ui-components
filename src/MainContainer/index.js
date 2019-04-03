import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform, ViewPropTypes } from 'react-native';
import Screen from '../Screen';
import { withTheme } from '../Theme';
import Row from '../Row';

const styles = StyleSheet.create({
  empty: {},
  background: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    minHeight: Platform.OS === 'web' ? '100vh' : Screen.getHeight(),
  },
});

const MainContainer = ({ className, style, ...props }) => (
  <Row {...props} className={`${className || ''} main`} style={[styles.background, style]} />
);

MainContainer.propTypes = {
  style: ViewPropTypes.style,
  className: PropTypes.string,
};

MainContainer.defaultProps = {
  style: styles.empty,
  className: '',
};

export default withTheme('MainContainer')(MainContainer);
