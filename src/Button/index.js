import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import Text from '../Text';
import Link from '../Link';

const styles = StyleSheet.create({
  empty: {},
  auto: {
    alignSelf: 'flex-start',
  },
  fullWidth: {
    width: '100%',
  },
  outer: {
    marginRight: 5,
    marginBottom: 5,
    borderBottomWidth: 2,
  },
  whiteOuter: {
    borderBottomWidth: 1,
    borderWidth: 1,
  },
  flat: {
    borderBottomWidth: 0,
    borderWidth: 0,
  },
  radius: {
    borderRadius: 2,
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 20,
    paddingRight: 20,
  },
  small: {
    fontSize: 13,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  extraSmall: {
    fontSize: 11,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 7,
    paddingRight: 7,
  },
  nomargin: {
    marginRight: 0,
    marginBottom: 0,
  },
});

const getTextType = (textType, type) => {
  if (textType) {
    return textType;
  }
  if (type === 'blue') {
    return 'blue';
  }
  if (type === 'white') {
    return 'gray';
  }
  return 'white';
};

const ifProp = (props, propName) => {
  if (props[propName]) {
    return styles[propName];
  }
  return styles.empty;
};

const Button = (props) => {
  const {
    to,
    auto,
    type,
    style,
    textStyle,
    blank,
    onPress,
    replace,
    children,
    textType,
    className,
    theme,
  } = props;
  let width = null;
  let height = null;
  let isAuto = auto;
  let buttonWidth = isAuto ? 'button-auto' : 'button-full';
  const css = StyleSheet.flatten(style || {});
  if (css.width !== undefined) {
    isAuto = true;
    buttonWidth = 'button-auto';
    width = { width: css.width };
  }
  if (css.height !== undefined) {
    height = { height: css.height };
  }
  return (
    <TouchableOpacity
      className={`${className} button-wrapper ${buttonWidth}`}
      onPress={onPress}
      style={[isAuto ? styles.empty : styles.fullWidth, style]}
    >
      <View
        className={`button button-${type}`}
        style={[
          styles.outer,
          theme.colors[type] && theme.colors[type].border,
          theme.colors[type] && theme.colors[type].background,
          styles[`${type}Outer`],
          isAuto ? styles.auto : styles.empty,
          ifProp(props, 'flat'),
          ifProp(props, 'radius'),
          ifProp(props, 'nomargin'),
          width,
          height,
        ]}
      >
        {to ? (
          <Link
            replace={replace}
            type={getTextType(textType, type)}
            blank={blank}
            to={to}
            style={[styles.text, ifProp(props, 'small'), ifProp(props, 'extraSmall'), textStyle]}
          >
            {children}
          </Link>
        ) : (
          <Text
            type={getTextType(textType, type)}
            style={[styles.text, ifProp(props, 'small'), ifProp(props, 'extraSmall'), textStyle]}
          >
            {children}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  theme: PropTypes.shape().isRequired,
  type: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  children: PropTypes.node,
  to: PropTypes.string,
  blank: PropTypes.bool,
  textType: PropTypes.string,
  style: ViewPropTypes.style,
  textStyle: StylePropType,
  auto: PropTypes.bool,
  className: PropTypes.string,
  replace: PropTypes.bool,
  small: PropTypes.bool, // eslint-disable-line
  extraSmall: PropTypes.bool, // eslint-disable-line
  flat: PropTypes.bool,  // eslint-disable-line
  radius: PropTypes.bool,  // eslint-disable-line
  nomargin: PropTypes.bool,  // eslint-disable-line
};

Button.defaultProps = {
  children: null,
  small: false,
  extraSmall: false,
  flat: true,
  radius: false,
  onPress: noop,
  to: null,
  blank: false,
  textType: null,
  style: null,
  textStyle: null,
  nomargin: false,
  auto: false,
  className: '',
  replace: false,
};

export default withTheme('Button')(Button);
