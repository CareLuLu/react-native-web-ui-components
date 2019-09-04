import React from 'react';
import { StyleSheet } from 'react-native';
import Text from '../Text';

const styles = StyleSheet.create({
  text: {
    padding: 5,
    height: 30,
    opacity: 0.7,
  },
});

const Spinner = () => <Text style={styles.text}>Loading...</Text>;

export default Spinner;
