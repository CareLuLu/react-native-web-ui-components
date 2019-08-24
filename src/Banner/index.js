import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ImageBackground } from 'react-native';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import { useScreen } from '../Screen';
import Column from '../Column';

const styles = StyleSheet.create({
  empty: {},
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
});

const Banner = ({
  theme,
  columnXs,
  columnSm,
  columnMd,
  columnLg,
  height,
  fit,
  maxHeight,
  children,
  lg,
  md,
  sm,
  xs,
  style,
}) => {
  const screen = useScreen();
  const defaults = { height };
  if (fit) {
    defaults.height = screen.height;
  }
  if (defaults.height > maxHeight) {
    defaults.height = maxHeight;
  }
  let uri;
  switch (screen.type) {
    case 'lg': uri = lg || md || sm || xs; break;
    case 'md': uri = md || sm || xs; break;
    case 'sm': uri = sm || xs; break;
    default: uri = xs;
  }
  uri = theme.resource(uri, { maxWidth: screen.width, maxHeight: defaults.height });
  return (
    <Column
      xs={columnXs}
      sm={columnSm}
      md={columnMd}
      lg={columnLg}
      style={defaults}
    >
      <ImageBackground resizeMode="cover" source={{ uri }} style={[styles.image, style]}>
        {children}
      </ImageBackground>
    </Column>
  );
};

Banner.propTypes = {
  theme: PropTypes.shape({
    resource: PropTypes.func.isRequired,
  }).isRequired,
  children: PropTypes.node,
  fit: PropTypes.bool,
  height: PropTypes.number,
  maxHeight: PropTypes.number,
  xs: PropTypes.string,
  sm: PropTypes.string,
  md: PropTypes.string,
  lg: PropTypes.string,
  columnXs: PropTypes.number,
  columnSm: PropTypes.number,
  columnMd: PropTypes.number,
  columnLg: PropTypes.number,
  style: StylePropType,
};

Banner.defaultProps = {
  children: null,
  fit: true,
  height: null,
  maxHeight: 700,
  xs: null,
  sm: null,
  md: null,
  lg: null,
  columnXs: 12,
  columnSm: null,
  columnMd: null,
  columnLg: null,
  style: styles.empty,
};

export default withTheme('Banner')(Banner);
