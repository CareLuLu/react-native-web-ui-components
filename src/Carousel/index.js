import React from 'react';
import PropTypes from 'prop-types';
import RNCarousel from 'react-native-carousel';
import { withTheme } from '../Theme';

const Carousel = ({
  autoplay,
  delay,
  loop,
  children,
  width,
}) => (
  <RNCarousel
    width={width}
    hideIndicators
    animate={autoplay}
    delay={delay}
    loop={loop}
  >
    {children}
  </RNCarousel>
);

Carousel.propTypes = {
  autoplay: PropTypes.bool,
  delay: PropTypes.number,
  loop: PropTypes.bool,
  children: PropTypes.node,
  width: PropTypes.number,
};

Carousel.defaultProps = {
  autoplay: false,
  delay: 3000,
  loop: true,
  children: null,
  width: null,
};

export default withTheme('Carousel')(Carousel);
