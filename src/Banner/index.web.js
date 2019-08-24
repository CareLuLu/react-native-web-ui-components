import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import murmurhash from 'murmurhash';
import { pick } from '../utils';
import stylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import { useScreen } from '../Screen';
import { Helmet, style } from '../Helmet';
import Column from '../Column';

/* eslint react/destructuring-assignment: 0 */

const styles = StyleSheet.create({
  empty: {},
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
  ...props
}) => {
  const screen = useScreen();
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
            [data-class~="${className}"] {
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

export default withTheme('Banner')(Banner);
