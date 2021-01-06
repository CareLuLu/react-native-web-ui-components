import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import View from '../View';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import { useAmp } from '../Amp';

const Img = ({
  alt,
  fixed,
  source,
  className,
  cover,
  srcSet,
  sizes,
  css,
}) => {
  const imgStyle = fixed ? css : {
    maxWidth: '100%',
    maxHeight: '100%',
    width: css.width,
    height: css.height,
  };
  return (
    <img
      alt={alt}
      data-class={`${className} ${cover ? 'image-cover' : ''} image-${fixed ? 'fixed' : 'responsive'}`}
      src={source.uri}
      style={imgStyle}
      srcSet={srcSet}
      sizes={sizes}
    />
  );
};

Img.propTypes = {
  css: PropTypes.shape().isRequired,
  source: PropTypes.shape({
    uri: PropTypes.string.isRequired,
  }).isRequired,
  cover: PropTypes.bool.isRequired,
  fixed: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  srcSet: PropTypes.string,
  sizes: PropTypes.string,
};

Img.defaultProps = {
  srcSet: undefined,
  sizes: undefined,
};

const AmpImg = ({
  alt,
  className,
  fixed,
  cover,
  source,
  srcSet,
  sizes,
  css,
}) => {
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
      srcset={srcSet}
      sizes={sizes}
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

AmpImg.propTypes = {
  css: PropTypes.shape().isRequired,
  source: PropTypes.shape({
    uri: PropTypes.string.isRequired,
  }).isRequired,
  fixed: PropTypes.bool.isRequired,
  cover: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  srcSet: PropTypes.string,
  sizes: PropTypes.string,
};

AmpImg.defaultProps = {
  srcSet: undefined,
  sizes: undefined,
};

const Image = (props) => {
  const amp = useAmp();

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
          {amp ? <AmpImg {...props} css={css} /> : <Img {...props} css={css} />}
        </View>
      </div>
    );
  }
  return (
    <div data-class="image-outer-wrapper">
      {amp ? <AmpImg {...props} css={css} /> : <Img {...props} css={css} />}
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
