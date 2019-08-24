import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ViewPropTypes } from 'react-native';
import { withTheme } from '../Theme';
import { useScreen } from '../Screen';
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
  const screen = useScreen();
  const { type, style } = props;
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
  type: PropTypes.oneOf(['limited', 'full']),
  children: PropTypes.node,
  style: ViewPropTypes.style,
};

Container.defaultProps = {
  type: 'full',
  children: null,
  style: styles.empty,
};

export default withTheme('Container')(Container);
