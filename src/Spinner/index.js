import React from 'react';
import { StyleSheet } from 'react-native';
import { withTheme } from '../Theme';
import View from '../View';
import Image from '../Image';

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    minHeight: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: 72,
    height: 80,
  },
  spinningSunContainer: {
    position: 'absolute',
    top: 10,
    left: 15,
  },
  spinningSun: {
    width: 48,
    height: 48,
  },
});

const spinningSun = { uri: 'https://divin2sy6ce0b.cloudfront.net/images/loadingsun.gif' };

const Spinner = () => (
  <View style={styles.outerContainer}>
    <View style={styles.container}>
      <View style={styles.spinningSunContainer}>
        <Image alt="loading..." fixed source={spinningSun} style={styles.spinningSun} />
      </View>
    </View>
  </View>
);

export default withTheme('Spinner')(Spinner);
