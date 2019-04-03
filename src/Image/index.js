import React from 'react';
import PropTypes from 'prop-types';
import { Image as CachedImage } from 'react-native-expo-image-cache';
import { withTheme } from '../Theme';

const Image = ({ source, ...props }) => <CachedImage {...props} uri={source.uri} tint="light" />;

Image.propTypes = {
  source: PropTypes.shape().isRequired,
};

export default withTheme('Image')(Image);
