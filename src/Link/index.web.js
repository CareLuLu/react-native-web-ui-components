import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import StylePropType from '../StylePropType';
import { useAmp } from '../Amp';
import { withTheme } from '../Theme';

const PROTOCOL_REGEX = /^[a-zA-Z\-_]+:\/\//;

const styles = StyleSheet.create({
  empty: {},
  defaults: {
    fontSize: 13,
    lineHeight: '20px',
  },
  fullWidth: {
    width: '100%',
  },
  noLineHeight: {
    lineHeight: 0,
  },
});

const go = (basepath, to, history, external, replace) => (e) => {
  let href = to;
  if (!external) {
    e.nativeEvent.preventDefault();
  } else if (!PROTOCOL_REGEX.test(to)) {
    href = `${URL}${to}`;
  }
  history[replace ? 'replace' : 'push'](href);
};

const Link = ({
  theme,
  blank,
  className,
  type,
  auto,
  external,
  to,
  style,
  children,
  onPress,
  location,
  history,
  replace,
  wrapper,
  basepath,
  fontFamily,
}) => {
  const amp = useAmp();

  if (onPress === null && to === null) {
    throw new Error('Either `onPress` or `to` must be provided');
  }
  let href = to;
  if (amp && !href) {
    href = `${location.pathname}${location.search}${location.hash}`.replace(/^\/amp/, '');
  }
  if (amp) {
    href = href.indexOf('?') >= 0 ? href.replace('#', '&') : href.replace('#', '?');
  }
  const Wrapper = wrapper;

  const currentStyle = [
    styles.defaults,
    !auto ? styles.fullWidth : null,
    typeof children !== 'string' ? styles.noLineHeight : null,
    theme.colors[type] && theme.colors[type].text,
    style,
  ];
  const font = {};
  const classNameProp = {};
  if (Wrapper === Text) {
    classNameProp['data-class'] = `${className} ${type}`;
    const css = StyleSheet.flatten(currentStyle);
    if (css.fontWeight === 'bold' && (!css.fontFamily || css.fontFamily === fontFamily.regular)) {
      font.fontFamily = fontFamily.bold;
    } else if (!css.fontFamily) {
      font.fontFamily = fontFamily.regular;
    }
  } else {
    classNameProp.className = `${className} ${type}`;
  }

  return (
    <Wrapper
      {...classNameProp}
      target={blank ? '_blank' : undefined}
      href={href}
      onPress={amp || blank ? undefined : (onPress || go(basepath, to, history, external, replace))}
      style={[currentStyle, font]}
      accessibilityRole="link"
    >
      {children}
    </Wrapper>
  );
};

Link.propTypes = {
  theme: PropTypes.shape().isRequired,
  fontFamily: PropTypes.shape().isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
  external: PropTypes.bool,
  auto: PropTypes.bool,
  type: PropTypes.string,
  children: PropTypes.node,
  style: StylePropType,
  blank: PropTypes.bool,
  className: PropTypes.string,
  to: PropTypes.string,
  onPress: PropTypes.func,
  replace: PropTypes.bool,
  wrapper: PropTypes.func,
  basepath: PropTypes.string,
};

Link.defaultProps = {
  external: false,
  auto: false,
  children: null,
  style: styles.empty,
  blank: false,
  type: 'gray',
  className: '',
  to: null,
  onPress: null,
  replace: false,
  wrapper: Text,
  basepath: 'localhost',
};

export default withTheme('Link')(withRouter(Link));
