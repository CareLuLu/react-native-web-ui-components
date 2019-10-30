import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
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

const Alert = ({
  theme,
  children,
  visible,
  onOk,
  okLabel,
  ...props
}) => {
  const [isVisible, setVisible] = useState(visible);
  const hide = () => {
    setVisible(false);
    onOk();
  };

  return (
    <Popup
      shouldCloseOnEsc
      {...props}
      onClose={onOk}
      followKeyboard
      visible={isVisible}
      className="NoAdjustment"
    >
      {typeof children === 'string' ? (
        <Text style={styles.text}>{children}</Text>
      ) : children}
      <Center>
        <Button auto type={theme.colors.primary} flat={false} onPress={hide}>{okLabel}</Button>
      </Center>
    </Popup>
  );
};

Alert.propTypes = {
  theme: PropTypes.shape().isRequired,
  visible: PropTypes.bool,
  children: PropTypes.node,
  onOk: PropTypes.func,
  okLabel: PropTypes.string,
};

Alert.defaultProps = {
  visible: true,
  children: null,
  onOk: noop,
  okLabel: 'Ok',
};

export default withTheme('Alert')(Alert);
