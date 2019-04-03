import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import murmurhash from 'murmurhash';
import compose from 'recompact/compose';
import stylePropType from '../StylePropType';
import { withAmp } from '../Amp';
import { withTheme } from '../Theme';
import { withScreen } from '../Screen';
import { Helmet, style } from '../Helmet';
import Column from '../Column';

/* eslint react/destructuring-assignment: 0 */

const styles = StyleSheet.create({
  empty: {},
});

const pick = (...args) => {
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] !== undefined && args[i] !== null) {
      return args[i];
    }
  }
  return args[args.length - 1];
};

const Banner = ({
  theme,
  columnXs,
  columnSm,
  columnMd,
  columnLg,
  height,
  fit,
  maxHeight,
  screen,
  children,
  lg,
  md,
  sm,
  xs,
  ...props
}) => {
  let uri;
  switch (screen.type) {
    case 'lg': uri = pick(lg, md, sm, xs); break;
    case 'md': uri = pick(md, sm, xs); break;
    case 'sm': uri = pick(sm, xs); break;
    default: uri = xs;
  }
  uri = theme.resource(uri, {
    maxHeight,
    maxWidth: Math.max(screen.width, 1280),
  });
  const currentStyle = props.style; // eslint-disable-line
  const className = `banner-${murmurhash.v3(`${height}-${fit}-${maxHeight}-${uri}`)}`;
  return (
    <Column
      xs={columnXs}
      sm={columnSm}
      md={columnMd}
      lg={columnLg}
      style={currentStyle}
      className={className}
    >
      <Helmet>
        <style>
          {`
            .${className} {
              width: 100%;
              height: ${fit ? '100vh' : `${height}px`};
              max-height: ${maxHeight || height}px;
              background-image: url(${uri});
              background-position: center center;
              background-size: cover;
              background-repeat: no-repeat;
            }
          `}
        </style>
      </Helmet>
      {children}
    </Column>
  );
};

Banner.propTypes = {
  theme: PropTypes.shape({
    resource: PropTypes.func.isRequired,
  }).isRequired,
  screen: PropTypes.shape({
    type: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  }).isRequired,
  style: stylePropType,
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
};

Banner.defaultProps = {
  style: styles.empty,
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
};

export default compose(
  withAmp(),
  withScreen(),
  withTheme('Banner'),
)(Banner);
