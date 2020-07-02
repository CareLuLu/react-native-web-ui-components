import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  Text as TextRN,
} from 'react-native';
import omit from 'lodash/omit';
import { withTheme } from '../Theme';
import Screen from '../Screen';
import StylePropType from '../StylePropType';
import { ucfirst } from '../utils';

const styles = StyleSheet.create({
  empty: {},
  defaults: {
    color: '#545454',
    lineHeight: 20,
    fontSize: 13,
    flexWrap: 'wrap',
  },
  fullWidth: {
    width: '100%',
  },
});

const screenType = Screen.getType();
const screenSizes = ['xs', 'sm', 'md', 'lg'];

const NativeText = ({
  type,
  style,
  auto,
  className,
  fontFamily,
  theme,
  ...props
}) => {
  const currentStyle = [
    styles.defaults,
    !auto ? styles.fullWidth : null,
    theme.colors[type] && theme.colors[type].text,
    style,
  ];
  const css = StyleSheet.flatten(currentStyle);
  const font = {};
  if (css.fontWeight === 'bold' && (!css.fontFamily || css.fontFamily === fontFamily.regular)) {
    font.fontFamily = fontFamily.bold;
  } else if (!css.fontFamily) {
    font.fontFamily = fontFamily.regular;
  }
  if (font.fontFamily === 'system font') {
    delete font.fontFamily;
  }
  const classNames = [className];
  for (let i = 0; i < screenSizes.length; i += 1) {
    const screenSize = screenSizes[i];
    const attribute = `hide${ucfirst(screenSize)}`;
    if (props[attribute]) {
      if (Platform.OS !== 'web' && screenType === screenSize) {
        return null;
      }
      classNames.push(`hidden-${screenSize}`);
    }
  }
  return (
    <TextRN
      {...omit(theme.omit(props), 'hideXs', 'hideSm', 'hideMd', 'hideLg')}
      style={[currentStyle, font]}
      dataSet={{ class: classNames.join(' ') }}
      data-class={classNames.join(' ')}
    />
  );
};

NativeText.propTypes = {
  fontFamily: PropTypes.shape().isRequired,
  theme: PropTypes.shape().isRequired,
  className: PropTypes.string,
  auto: PropTypes.bool,
  type: PropTypes.string,
  style: StylePropType,
  hideXs: PropTypes.bool,
  hideSm: PropTypes.bool,
  hideMd: PropTypes.bool,
  hideLg: PropTypes.bool,
};

NativeText.defaultProps = {
  className: '',
  auto: false,
  type: 'gray',
  style: null,
  hideXs: false,
  hideSm: false,
  hideMd: false,
  hideLg: false,
};

export default withTheme('Text')(NativeText);
