import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image as NativeImage } from 'react-native';
import View from '../View';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import { isSSR } from '../utils';

const SSR_MODE = isSSR();

const renderImage = ({
  alt,
  fixed,
  source,
  style,
  className,
}, css) => (
  <NativeImage
    accessibilityLabel={alt}
    data-class={`${className} image-${fixed ? 'fixed' : 'responsive'}`}
    source={source}
    style={fixed ? style : {
      maxWidth: '100%',
      maxHeight: '100%',
      width: css.width,
      height: css.height,
    }}
  />
);

renderImage.propTypes = {
  style: StylePropType.isRequired,
  source: PropTypes.shape({
    uri: PropTypes.string.isRequired,
  }).isRequired,
  fixed: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

const renderImageAmp = ({
  alt,
  className,
  fixed,
  cover,
  source,
}, css) => {
  let layout;
  if (fixed) {
    layout = 'fixed';
  } else if (cover) {
    layout = 'fill';
  } else {
    layout = 'intrinsic';
  }
  return (
    <amp-img
      alt={alt}
      data-class={`${layout} ${className}`}
      width={`${css.width}`}
      height={`${css.height}`}
      src={source.uri}
      layout={layout}
    >
      <noscript>
        <img
          alt={alt}
          data-class={className}
          width={css.width}
          height={css.height}
          src={source.uri}
        />
      </noscript>
    </amp-img>
  );
};

renderImageAmp.propTypes = {
  source: PropTypes.shape({
    uri: PropTypes.string.isRequired,
  }).isRequired,
  fixed: PropTypes.bool.isRequired,
  cover: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

const Image = (props) => {
  const { style, fixed } = props;
  const css = StyleSheet.flatten(style || {});
  if (!css.width || !css.height) {
    throw new Error('AMP Image requires `style.width` and `style.height`');
  }
  if (fixed) {
    const dynamicStyles = StyleSheet.create({
      fixedImage: {
        width: css.width,
        height: css.height,
      },
    });
    return (
      <div data-class="image-outer-wrapper" style={{ width: css.width, height: css.height }}>
        <View className="image-wrapper" style={dynamicStyles.fixedImage}>
          {SSR_MODE ? renderImageAmp(props, css) : renderImage(props, css)}
        </View>
      </div>
    );
  }
  return (
    <div data-class="image-outer-wrapper">
      {SSR_MODE ? renderImageAmp(props, css) : renderImage(props, css)}
    </div>
  );
};

Image.propTypes = {
  style: StylePropType.isRequired,
  fixed: PropTypes.bool,
  cover: PropTypes.bool, // eslint-disable-line
  className: PropTypes.string, // eslint-disable-line
  alt: PropTypes.string, // eslint-disable-line
};

Image.defaultProps = {
  fixed: false,
  cover: false,
  className: '',
  alt: '',
};

export default withTheme('Image')(Image);
