import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import murmurhash from 'murmurhash';
import { pick } from '../utils';
import stylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import { useScreen } from '../Screen';
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
  const screen = useScreen();
  let uri;
  let maxWidth;

  const uriLg = pick(lg, md, sm, xs);
  const uriMd = pick(md, sm, xs);
  const uriSm = pick(sm, xs);
  const uriXs = xs;

  switch (screen.type) {
    case 'lg':
      uri = uriLg;
      maxWidth = 1280;
      break;
    case 'md':
      uri = uriMd;
      maxWidth = 1199;
      break;
    case 'sm':
      uri = uriSm;
      maxWidth = 991;
      break;
    default:
      uri = uriXs;
      maxWidth = 767;
  }
  uri = theme.resource(uri, {
    maxHeight,
    maxWidth,
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
        {preload ? (
          <link
            rel="preload"
            as="image"
            href={theme.resource(uriLg, { maxHeight, maxWidth: 1280 })}
            media="(min-width: 1200px)"
          />
        ) : null}
        {preload ? (
          <link
            rel="preload"
            as="image"
            href={theme.resource(uriMd, { maxHeight, maxWidth: 1199 })}
            media="(min-width: 992px) and (max-width: 1199px)"
          />
        ) : null}
        {preload ? (
          <link
            rel="preload"
            as="image"
            href={theme.resource(uriSm, { maxHeight, maxWidth: 991 })}
            media="(min-width: 768px) and (max-width: 991px)"
          />
        ) : null}
        {preload ? (
          <link
            rel="preload"
            as="image"
            href={theme.resource(uriSm, { maxHeight, maxWidth: 767 })}
            media="(max-width: 767px)"
          />
        ) : null}
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
