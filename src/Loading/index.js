import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { withTheme } from '../Theme';
import Popup from '../Popup';
import View from '../View';
import DefaultSpinner from '../Spinner';

const styles = StyleSheet.create({
  popup: {
    width: 120,
    backgroundColor: '#FFFFFF',
  },
});

const Loading = ({ children, Spinner, ...props }) => (
  <Popup
    {...props}
    className="NoAdjustment"
    followKeyboard
    header={false}
    width={150}
    shouldCloseOnEsc={false}
  >
    {children}
    <View style={styles.popup}>
      <Spinner />
    </View>
  </Popup>
);

Loading.propTypes = {
  children: PropTypes.node,
  Spinner: PropTypes.func,
};

Loading.defaultProps = {
  children: null,
  Spinner: DefaultSpinner,
};

export default withTheme('Loading')(Loading);
