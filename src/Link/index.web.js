import React from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import StylePropType from '../StylePropType';
import { useAmp } from '../Amp';
import { withTheme } from '../Theme';
import { useHistory } from '../History';

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

const go = ({
  to,
  history,
  external,
  replace,
}) => (e) => {
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
  nofollow,
  download,
  className,
  type,
  auto,
  external,
  to,
  style,
  children,
  onPress,
  replace,
  wrapper,
  fontFamily,
  hrefAttrs,
}) => {
  const history = useHistory();
  const { location } = history;

  const amp = useAmp();

  if (onPress === null && to === null) {
    throw new Error('Either `onPress` or `to` must be provided');
  }
  let href = to;
  if (amp && !href) {
    href = `${location.pathname}${location.search}${location.hash}`.replace(/^\/amp(\/)?/, '$1').replace(/\/amp\/?$/, '');
    if (!href || href[0] !== '/') {
      href = `/${href}`;
    }
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
    classNameProp.dataSet = { class: `${className} ${type}` };
    const css = StyleSheet.flatten(currentStyle);
    if (css.fontWeight === 'bold' && (!css.fontFamily || css.fontFamily === fontFamily.regular)) {
      font.fontFamily = fontFamily.bold;
    } else if (!css.fontFamily) {
      font.fontFamily = fontFamily.regular;
    }
  } else {
    classNameProp.className = `${className} ${type}`;
  }
  if (font.fontFamily === 'system font') {
    delete font.fontFamily;
  }

  let adjustedHrefAttrs = hrefAttrs || null;
  if (blank || nofollow || download) {
    adjustedHrefAttrs = {
      target: blank ? 'blank' : null,
      rel: nofollow ? 'nofollow' : null,
      download,
      ...hrefAttrs,
    };
  }

  const wrappedOnPress = amp || blank
    ? undefined
    : (onPress || go({
      to,
      history,
      external,
      replace,
    }));

  return (
    <Wrapper
      {...classNameProp}
      hrefAttrs={adjustedHrefAttrs}
      href={href}
      onPress={wrappedOnPress}
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
  external: PropTypes.bool,
  auto: PropTypes.bool,
  type: PropTypes.string,
  children: PropTypes.node,
  style: StylePropType,
  blank: PropTypes.bool,
  nofollow: PropTypes.bool,
  download: PropTypes.bool,
  className: PropTypes.string,
  to: PropTypes.string,
  onPress: PropTypes.func,
  replace: PropTypes.bool,
  wrapper: PropTypes.any, // eslint-disable-line
  hrefAttrs: PropTypes.shape(),
};

Link.defaultProps = {
  external: false,
  auto: false,
  children: null,
  style: styles.empty,
  blank: false,
  nofollow: false,
  download: undefined,
  type: 'gray',
  className: '',
  to: null,
  onPress: null,
  replace: false,
  wrapper: Text,
  hrefAttrs: undefined,
};

export default withTheme('Link')(Link);
