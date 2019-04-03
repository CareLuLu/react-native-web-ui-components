import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ViewPropTypes } from 'react-native';
import compose from 'recompact/compose';
import { withTheme } from '../Theme';
import { withScreen } from '../Screen';
import View from '../View';

const rowStyle = {
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
};

const styles = StyleSheet.create({
  empty: {},
  row: {
    ...rowStyle,
  },
  outerRow: {
    ...rowStyle,
    justifyContent: 'center',
  },
  innerRow: {
    ...rowStyle,
    width: 960,
  },
  innerRowXs: {
    ...rowStyle,
    width: '95%',
  },
});

const Container = (props) => {
  const { type, style, screen } = props;
  if (type === 'full') {
    return <View {...props} style={[styles.row, style]} />;
  }
  if (screen.type === 'md' || screen.type === 'lg') {
    return (
      <View style={styles.outerRow}>
        <View className={type} {...props} style={[styles.innerRow, style]} />
      </View>
    );
  }
  return (
    <View style={styles.outerRow}>
      <View className={type} {...props} style={[styles.innerRowXs, style]} />
    </View>
  );
};

Container.propTypes = {
  screen: PropTypes.shape({
    type: PropTypes.string.isRequired,
  }).isRequired,
  type: PropTypes.oneOf(['limited', 'full']),
  children: PropTypes.node,
  style: ViewPropTypes.style,
};

Container.defaultProps = {
  type: 'full',
  children: null,
  style: styles.empty,
};

export default compose(
  withScreen(),
  withTheme('Container'),
)(Container);
