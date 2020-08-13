import React from 'react';
import { StyleSheet } from 'react-native';
import { withTheme } from '../Theme';
import StylePropType from '../StylePropType';
import Autocomplete from '../Autocomplete';

const styles = StyleSheet.create({
  input: {
    borderColor: 'transparent',
    paddingLeft: 0,
    minWidth: '100%',
  },
  container: {
    minWidth: '100%',
  },
  menu: {
    width: '100%',
  },
});

const Input = ({
  style,
  menuStyle,
  containerStyle,
  ...props
}) => (
  <Autocomplete
    {...props}
    allowEmpty={false}
    style={[styles.input, style]}
    containerStyle={[styles.container, containerStyle]}
    menuStyle={[styles.menu, menuStyle]}
  />
);

Input.propTypes = {
  style: StylePropType,
  menuStyle: StylePropType,
  containerStyle: StylePropType,
};

Input.defaultProps = {
  style: null,
  menuStyle: null,
  containerStyle: null,
};

export default withTheme('TagInputInput')(Input);
