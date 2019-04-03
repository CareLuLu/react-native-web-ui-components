import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import withState from 'recompact/withState';
import withHandlers from 'recompact/withHandlers';
import compose from 'recompact/compose';
import noop from 'lodash/noop';
import { withTheme } from '../Theme';
import stylePropType from '../StylePropType';
import Text from '../Text/NativeText';

const styles = StyleSheet.create({
  empty: {},
  defaults: {},
});

const ReadMoreLessLink = compose(
  withState('opacity', 'setOpacity', 1),
  withHandlers({
    setOpacity25: ({ setOpacity, onChange, visible }) => () => {
      setTimeout(() => onChange(!visible));
      setOpacity(0.25);
    },
    setOpacity50: ({ setOpacity }) => () => setOpacity(0.5),
    setOpacity100: ({ setOpacity }) => () => setOpacity(1),
  }),
)(({
  opacity,
  auto,
  type,
  style,
  showLabel,
  hideLabel,
  visible,
  setOpacity25,
  setOpacity50,
  setOpacity100,
}) => {
  if (opacity === 0.5) {
    setTimeout(() => setOpacity25());
  }
  if (opacity === 0.25) {
    setTimeout(() => setOpacity100(), 200);
  }
  return (
    <Text
      type={type}
      auto={auto}
      onPress={opacity === 1 ? setOpacity50 : noop}
      style={[styles.defaults, style, { opacity }]}
    >
      {visible ? hideLabel : showLabel}
    </Text>
  );
});

ReadMoreLessLink.propTypes = {
  auto: PropTypes.bool,
  type: PropTypes.string,
  style: stylePropType,
  onChange: PropTypes.func,
  showLabel: PropTypes.string,
  hideLabel: PropTypes.string,
  visible: PropTypes.bool,
};

ReadMoreLessLink.defaultProps = {
  auto: false,
  style: styles.empty,
  type: 'gray',
  onChange: noop,
  showLabel: 'Read more...',
  hideLabel: 'Read less...',
  visible: true,
};

export default withTheme('ReadMoreLessLink')(ReadMoreLessLink);
