import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import noop from 'lodash/noop';
import compose from 'recompact/compose';
import withHandlers from 'recompact/withHandlers';
import withState from 'recompact/withState';
import { StyleSheet, Linking } from 'react-native';
import { withTheme } from '../Theme';
import StylePropType from '../StylePropType';
import Text from '../Text/NativeText';
import TouchableOpacity from '../TouchableOpacity';

const MAIL_REGEX = /^mailto:/i;
const PHONE_REGEX = /^tel:/i;
const PROTOCOL_REGEX = /^[a-zA-Z\-_]+:\/\//;

const styles = StyleSheet.create({
  empty: {},
  defaults: {},
  touchable: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

const go = (basepath, to, history, external, replace) => () => {
  let href = to;
  if (external && !PROTOCOL_REGEX.test(to)) {
    href = `${basepath}${to}`;
  }
  if (MAIL_REGEX.test(href) || PHONE_REGEX.test(href)) {
    return Linking.openURL(href);
  }
  return history[replace ? 'replace' : 'push'](href);
};

const Link = compose(
  withState('opacity', 'setOpacity', 1),
  withHandlers({
    setOpacity25: ({
      to,
      onPress,
      history,
      external,
      replace,
      setOpacity,
      basepath,
    }) => () => {
      setTimeout(onPress || go(basepath, to, history, external, replace));
      setOpacity(0.25);
    },
    setOpacity50: ({ setOpacity }) => () => setOpacity(0.5),
    setOpacity100: ({ setOpacity }) => () => setOpacity(1),
  }),
)(({
  to,
  opacity,
  auto,
  type,
  style,
  children,
  onPress,
  setOpacity25,
  setOpacity50,
  setOpacity100,
}) => {
  if (onPress === null && to === null) {
    throw new Error('Either `onPress` or `to` must be provided');
  }
  if (opacity === 0.5) {
    setTimeout(() => setOpacity25());
  }
  if (opacity === 0.25) {
    setTimeout(() => setOpacity100(), 200);
  }
  if (!children || typeof children !== 'string') {
    return (
      <TouchableOpacity
        style={[styles.touchable, style]}
        onPress={setOpacity50}
      >
        {children}
      </TouchableOpacity>
    );
  }
  return (
    <Text
      type={type}
      auto={auto}
      onPress={opacity === 1 ? setOpacity50 : noop}
      style={[styles.defaults, style, { opacity }]}
    >
      {children}
    </Text>
  );
});

Link.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
  external: PropTypes.bool,
  auto: PropTypes.bool,
  type: PropTypes.string,
  children: PropTypes.node,
  style: StylePropType,
  onPress: PropTypes.func,
  to: PropTypes.string,
  replace: PropTypes.bool,
  basepath: PropTypes.string,
};

Link.defaultProps = {
  external: false,
  auto: false,
  children: null,
  style: styles.empty,
  type: 'gray',
  to: null,
  onPress: null,
  replace: false,
  basepath: 'localhost',
};

export default withRouter(withTheme('Link')(Link));
