import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { withTheme } from '../Theme';
import Popup from '../Popup';
import View from '../View';
import Spinner from '../Spinner';

const styles = StyleSheet.create({
  popup: {
    width: 120,
    backgroundColor: '#FFFFFF',
  },
});

const Loading = ({ children, SpinnerComponent, ...props }) => (
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
      <SpinnerComponent />
    </View>
  </Popup>
);

Loading.propTypes = {
  children: PropTypes.node,
  SpinnerComponent: PropTypes.func,
};

Loading.defaultProps = {
  children: null,
  SpinnerComponent: Spinner,
};

export default withTheme('Loading')(Loading);
