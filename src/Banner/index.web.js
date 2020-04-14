import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import murmur from 'murmurhash-js';
import { pick } from '../utils';
import stylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import { Helmet, style, link } from '../Helmet';
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
  preload,
  ...props
}) => {
  const uriLg = theme.resource(pick(lg, md, sm, xs), { maxHeight, maxWidth: 1280 });
  const uriMd = theme.resource(pick(md, sm, xs), { maxHeight, maxWidth: 1199 });
  const uriSm = theme.resource(pick(sm, xs), { maxHeight, maxWidth: 991 });
  const uriXs = theme.resource(xs, { maxHeight, maxWidth: 767 });

  const currentStyle = props.style; // eslint-disable-line
  const className = `banner-${murmur.murmur3(`${height}-${fit}-${maxHeight}-${uriLg}-${uriMd}-${uriSm}-${uriXs}`)}`;

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
        {preload ? (
          <link
            rel="preload"
            as="image"
            href={uriLg}
            media="(min-width: 1200px)"
          />
        ) : null}
        {preload ? (
          <link
            rel="preload"
            as="image"
            href={uriMd}
            media="(min-width: 992px) and (max-width: 1199px)"
          />
        ) : null}
        {preload ? (
          <link
            rel="preload"
            as="image"
            href={uriSm}
            media="(min-width: 768px) and (max-width: 991px)"
          />
        ) : null}
        {preload ? (
          <link
            rel="preload"
            as="image"
            href={uriXs}
            media="(max-width: 767px)"
          />
        ) : null}
        <style>
          {`
            [data-class~="${className}"] {
              width: 100%;
              height: ${fit ? '100vh' : `${height}px`};
              max-height: ${maxHeight || height}px;
              background-position: center center;
              background-size: cover;
              background-repeat: no-repeat;
            }
            @media (max-width: 767px) {
              [data-class~="${className}"] {
                background-image: url(${uriXs});
              }
            }
            @media (min-width: 768px) and (max-width: 991px)  {
              [data-class~="${className}"] {
                background-image: url(${uriSm});
              }
            }
            @media (min-width: 992px) and (max-width: 1199px)  {
              [data-class~="${className}"] {
                background-image: url(${uriMd});
              }
            }
            @media (min-width: 1200px) {
              [data-class~="${className}"] {
                background-image: url(${uriLg});
              }
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
  preload: PropTypes.bool,
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
  preload: false,
};

export default withTheme('Banner')(Banner);
