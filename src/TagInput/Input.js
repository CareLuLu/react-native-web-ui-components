import React from 'react';
import { StyleSheet } from 'react-native';
import { withTheme } from '../Theme';
import StylePropType from '../StylePropType';
import Autocomplete from '../Autocomplete';

const styles = StyleSheet.create({
  input: {
    borderColor: 'transparent',
    paddingLeft: 0,
    flex: 1,
  },
  container: {
    flex: 1,
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
    menuStyle={[styles.menu, menuStyle]}
    containerStyle={[styles.container, containerStyle]}
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
