import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  ViewPropTypes,
} from 'react-native';
import compose from 'recompact/compose';
import { withScreen } from '../Screen';
import { withTheme } from '../Theme';
import { pick } from '../utils';

const styles = StyleSheet.create({
  empty: {},
  defaults: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  width0: { width: '100%' },
  width1: { width: '8.33333333%' },
  width2: { width: '16.66666667%' },
  width3: { width: '25%' },
  width4: { width: '33.33333333%' },
  width5: { width: '41.66666667%' },
  width6: { width: '50%' },
  width7: { width: '58.33333333%' },
  width8: { width: '66.66666667%' },
  width9: { width: '75%' },
  width10: { width: '83.33333333%' },
  width11: { width: '91.66666667%' },
  width12: { width: '100%' },
});

const Column = ({
  screen,
  lg,
  md,
  sm,
  xs,
  style,
  absolute,
  children,
}) => {
  let width;
  switch (screen.type) {
    case 'lg': width = pick(lg, md, sm, xs); break;
    case 'md': width = pick(md, sm, xs); break;
    case 'sm': width = pick(sm, xs); break;
    default: width = xs;
  }
  if (width === 0) {
    return null;
  }
  let columnStyle;
  if (width === null) {
    if (style === styles.empty) {
      columnStyle = styles.defaults;
    } else {
      columnStyle = [styles.defaults, style];
    }
  } else if (!absolute) {
    columnStyle = [styles.defaults, style, styles[`width${width}`]];
  } else {
    columnStyle = [styles.defaults, style, { width }];
  }
  return (
    <View style={columnStyle}>
      {children}
    </View>
  );
};

Column.propTypes = {
  screen: PropTypes.shape({
    type: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.node,
  style: ViewPropTypes.style,
  xs: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sm: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  md: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  lg: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  absolute: PropTypes.bool,
};

Column.defaultProps = {
  children: null,
  style: styles.empty,
  xs: null,
  sm: null,
  md: null,
  lg: null,
  absolute: false,
};

export default compose(
  withScreen(),
  withTheme('Column'),
)(Column);
