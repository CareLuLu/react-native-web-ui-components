import React from 'react';
import PropTypes from 'prop-types';
import {
  Keyboard,
  Platform,
  StyleSheet,
  ScrollView as RNScrollView,
} from 'react-native';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';

const styles = StyleSheet.create({
  empty: {},
  defaults: {
    backgroundColor: '#23AAAA',
  },
});

const defaultScrollProps = {};
if (Platform.OS === 'android') {
  defaultScrollProps.onScroll = Keyboard.dismiss;
}

const ScrollView = React.forwardRef(({
  children,
  style,
  theme,
  ...props
}, ref) => (
  <RNScrollView
    ref={ref}
    keyboardShouldPersistTaps="always"
    keyboardDismissMode="on-drag"
    {...defaultScrollProps}
    {...theme.omit(props)}
    style={[styles.defaults, style]}
  >
    {children}
  </RNScrollView>
));

ScrollView.propTypes = {
  theme: PropTypes.shape().isRequired,
  children: PropTypes.node,
  style: StylePropType,
};

ScrollView.defaultProps = {
  children: null,
  style: styles.empty,
};

export default withTheme('ScrollView')(ScrollView);
