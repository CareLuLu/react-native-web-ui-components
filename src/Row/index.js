import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { withTheme } from '../Theme';
import Column from '../Column';
import StylePropType from '../StylePropType';

const styles = StyleSheet.create({
  empty: {},
  defaults: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

const Row = ({ xs, style, ...props }) => (
  <Column
    {...props}
    xs={xs}
    style={style === styles.empty ? styles.defaults : [styles.defaults, style]}
  />
);

Row.propTypes = {
  xs: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  style: StylePropType,
};

Row.defaultProps = {
  xs: 12,
  style: styles.empty,
};

export default withTheme('Row')(Row);
