import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import withState from 'recompact/withState';
import withHandlers from 'recompact/withHandlers';
import compose from 'recompact/compose';
import noop from 'lodash/noop';
import { withTheme } from '../Theme';
import Popup from '../Popup';
import Button from '../Button';
import Center from '../Center';
import Text from '../Text';

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 15,
  },
});

const Alert = compose(
  withState('visible', 'setVisible', ({ visible }) => visible),
  withHandlers({
    hide: ({ setVisible, onOk }) => () => {
      setVisible(false);
      onOk();
    },
  }),
)(({
  theme,
  children,
  visible,
  onOk,
  hide,
  ...props
}) => (
  <Popup
    shouldCloseOnEsc
    {...props}
    onClose={onOk}
    followKeyboard
    visible={visible}
    className="NoAdjustment"
  >
    {typeof children === 'string' ? (
      <Text style={styles.text}>{children}</Text>
    ) : children}
    <Center>
      <Button auto type={theme.colors.primary} flat={false} onPress={hide}>Ok</Button>
    </Center>
  </Popup>
));

Alert.propTypes = {
  theme: PropTypes.shape().isRequired,
  visible: PropTypes.bool,
  children: PropTypes.node,
  onOk: PropTypes.func,
};

Alert.defaultProps = {
  visible: true,
  children: null,
  onOk: noop,
};

export default withTheme('Alert')(Alert);
