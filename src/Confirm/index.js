import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import noop from 'lodash/noop';
import withState from 'recompact/withState';
import withHandlers from 'recompact/withHandlers';
import compose from 'recompact/compose';
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

const Confirm = compose(
  withState('answer', 'setAnswer', null),
  withHandlers({
    closePress: ({ onNo }) => () => onNo(),
    yesPress: ({ onYes, setAnswer }) => () => {
      setAnswer(true);
      onYes();
    },
    noPress: ({ onNo, setAnswer }) => () => {
      setAnswer(false);
      onNo();
    },
  }),
)(({
  theme,
  yesText,
  noText,
  children,
  answer,
  closePress,
  yesPress,
  noPress,
  ...props
}) => (
  <Popup
    shouldCloseOnEsc
    {...props}
    followKeyboard
    onClose={closePress}
    visible={answer === null}
    className="NoAdjustment"
  >
    {typeof children === 'string' ? (
      <Text style={styles.text}>{children}</Text>
    ) : children}
    <Center>
      <Button auto type={theme.colors.primary} flat={false} onPress={yesPress}>{yesText}</Button>
      <Button auto type={theme.colors.primary} flat={false} onPress={noPress}>{noText}</Button>
    </Center>
  </Popup>
));

Confirm.propTypes = {
  theme: PropTypes.shape().isRequired,
  children: PropTypes.node,
  yesText: PropTypes.string,
  noText: PropTypes.string,
  onYes: PropTypes.func,
  onNo: PropTypes.func,
};

Confirm.defaultProps = {
  children: null,
  yesText: 'Yes',
  noText: 'No',
  onYes: noop,
  onNo: noop,
};

export default withTheme('Confirm')(Confirm);
