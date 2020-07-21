import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { StyleSheet, Linking } from 'react-native';
import { withTheme } from '../Theme';
import StylePropType from '../StylePropType';
import Text from '../Text/NativeText';
import TouchableOpacity from '../TouchableOpacity';
import { useHistory } from '../History';

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

const go = ({
  to,
  basepath,
  history,
  external,
  replace,
}) => () => {
  let href = to;
  if (external && !PROTOCOL_REGEX.test(to)) {
    href = `${basepath}${to}`;
  }
  if (MAIL_REGEX.test(href) || PHONE_REGEX.test(href)) {
    return Linking.openURL(href);
  }
  return history[replace ? 'replace' : 'push'](href);
};

const Link = ({
  to,
  auto,
  type,
  style,
  children,
  onPress,
  basepath,
  external,
  replace,
}) => {
  const history = useHistory();

  const [opacity, setOpacity] = useState(1);

  const setOpacity50 = () => setOpacity(0.5);

  useEffect(() => {
    if (opacity === 0.5) {
      setTimeout(() => setOpacity(0.25));
    }
    if (opacity === 0.25) {
      setTimeout(() => {
        setOpacity(1);
        setTimeout(onPress || go({
          to,
          basepath,
          history,
          external,
          replace,
        }));
      }, 100);
    }
  }, [opacity]); // eslint-disable-line

  if (onPress === null && to === null) {
    throw new Error('Either `onPress` or `to` must be provided');
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
};

Link.propTypes = {
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

export default withTheme('Link')(Link);
