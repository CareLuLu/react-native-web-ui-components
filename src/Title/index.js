import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import StylePropType from '../StylePropType';
import { pick } from '../utils';
import { useScreen } from '../Screen';
import { withTheme } from '../Theme';
import Text from '../Text';

const styles = StyleSheet.create({
  empty: {},
  defaults: {
    textAlign: 'center',
  },
});

const Title = ({
  style,
  level,
  xs,
  sm,
  md,
  lg,
  ...props
}) => {
  const screen = useScreen();

  let fontSize;
  switch (screen.type) {
    case 'lg': fontSize = pick(lg, md, sm, xs); break;
    case 'md': fontSize = pick(md, sm, xs); break;
    case 'sm': fontSize = pick(sm, xs); break;
    default: fontSize = xs;
  }
  if (fontSize === null) {
    switch (level) {
      case 1: fontSize = 32; break;
      case 2: fontSize = 24; break;
      case 3: fontSize = 20; break;
      case 4: fontSize = 16; break;
      default: fontSize = 13;
    }
  }
  fontSize = parseFloat(fontSize);
  const lineHeight = fontSize * 1.1;
  return (
    <Text
      {...props}
      accessibilityRole="header"
      aria-level={level}
      style={[
        styles.defaults,
        { fontSize, lineHeight },
        style,
      ]}
    />
  );
};

Title.propTypes = {
  id: PropTypes.string.isRequired,
  style: StylePropType,
  level: PropTypes.number,
  xs: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sm: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  md: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  lg: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Title.defaultProps = {
  style: styles.empty,
  level: 1,
  xs: null,
  sm: null,
  md: null,
  lg: null,
};

export default withTheme('Title')(Title);
