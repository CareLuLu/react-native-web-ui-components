import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import map from 'lodash/map';
import compose from 'recompact/compose';
import murmurhash from 'murmurhash';
import { Helmet, style, script } from '../Helmet';
import { withAmp } from '../Amp';
import { withTheme } from '../Theme';
import Row from '../Row';
import Icon from '../Icon';
import TouchableOpacity from '../TouchableOpacity';

const styles = StyleSheet.create({
  carousel: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  icon: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
    width: '100%',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  control: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    width: 40,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftControl: {
    left: 0,
  },
  rightControl: {
    right: 0,
  },
});

class Carousel extends React.Component {
  static propTypes = {
    amp: PropTypes.bool.isRequired,
    height: PropTypes.number.isRequired,
    controls: PropTypes.bool,
    autoplay: PropTypes.bool,
    delay: PropTypes.number,
    loop: PropTypes.bool,
    children: PropTypes.node,
  };

  static defaultProps = {
    controls: false,
    autoplay: false,
    delay: 3000,
    loop: true,
    children: null,
  };

  constructor(props) {
    super(props);
    this.hasMounted = false;
    this.tryNext = this.next.bind(this);
    this.tryPrev = this.prev.bind(this);
    this.state = { index: 0, length: props.children.length };
    this.id = `carousel-${murmurhash.v3(`${props.controls}-${props.autoplay}-${props.delay}-${props.loop}-${props.height}-${props.children.length}`)}`;
  }

  componentDidMount() {
    const { autoplay, delay } = this.props;
    this.hasMounted = true;
    if (autoplay) {
      if (this.autoplayTimer) {
        clearTimeout(this.autoplayTimer);
      }
      this.autoplayTimer = setTimeout(this.tryNext, delay + 800);
    }
  }

  componentDidUpdate() {
    const { autoplay, delay } = this.props;
    if (autoplay) {
      if (this.autoplayTimer) {
        clearTimeout(this.autoplayTimer);
      }
      this.autoplayTimer = setTimeout(this.tryNext, delay + 800);
    }
  }

  componentWillUnmount() {
    this.hasMounted = false;
  }

  next() {
    const { loop } = this.props;
    const { index, length } = this.state;
    if (this.hasMounted) {
      if (index < length || loop) {
        this.setState({ index: (index + 1) % length });
      }
    } else {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(this.tryNext, 0);
    }
  }

  prev() {
    if (this.hasMounted) {
      const { loop } = this.props;
      const { length } = this.state;
      let { index } = this.state;
      index -= 1;
      if (index >= 0 || loop) {
        if (index < 0) {
          index = length - 1;
        }
        this.setState({ index });
      }
    } else {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(this.tryPrev, 0);
    }
  }

  renderAmp() {
    const {
      controls,
      autoplay,
      delay,
      loop,
      height,
      children,
    } = this.props;
    const className = controls ? '' : 'no-controls';
    return (
      <Row>
        <span id={this.id} className="carousel-span">
          <Helmet>
            <script async="" custom-element="amp-carousel" src="https://cdn.ampproject.org/v0/amp-carousel-0.1.js" />
            <style>
              {`
                .carousel-span { 
                  width: 100%; 
                }
                amp-carousel.no-controls .amp-carousel-button {
                  display: none;
                }
              `}
            </style>
          </Helmet>
          <amp-carousel
            layout="flex-item"
            height={height}
            autoplay={autoplay ? '' : 'false'}
            type="slides"
            loop={loop ? '' : false}
            class={className}
            delay={delay}
          >
            {children}
          </amp-carousel>
        </span>
      </Row>
    );
  }

  renderRegular() {
    const {
      controls,
      height,
      children,
    } = this.props;
    const { index } = this.state;
    return (
      <Row className="Carousel" style={[styles.carousel, { height }]}>
        <Helmet>
          <style>
            {`
              [data-class~="Carousel__controlLeft"]:hover {
                cursor: pointer;
                opacity: 0.9;
                background-image: linear-gradient(to right,rgba(0,0,0,.5) 0,rgba(0,0,0,.0001) 100%);
                background-repeat: repeat-x;
              }
              [data-class~="Carousel__controlRight"]:hover {
                cursor: pointer;
                opacity: 0.9;
                background-image: linear-gradient(to right,rgba(0,0,0,.0001) 0,rgba(0,0,0,.5) 100%);
                background-repeat: repeat-x;
              }
            `}
          </style>
        </Helmet>
        {map(children, (child, i) => (
          <div
            key={i}
            style={{
              width: '100%',
              left: `${-100 * (index - i)}%`,
              position: 'absolute',
              top: 0,
              transition: '0.8s',
            }}
          >
            {child}
          </div>
        ))}
        {controls ? (
          <React.Fragment>
            <TouchableOpacity
              onPress={this.tryPrev}
              className="Carousel__controlLeft"
              style={[styles.control, styles.leftControl]}
            >
              <Icon name="chevron-left" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.tryNext}
              className="Carousel__controlRight"
              style={[styles.control, styles.rightControl]}
            >
              <Icon name="chevron-right" style={styles.icon} />
            </TouchableOpacity>
          </React.Fragment>
        ) : null}
      </Row>
    );
  }

  render() {
    const { amp } = this.props;
    if (amp) {
      return this.renderAmp();
    }
    return this.renderRegular();
  }
}

export default compose(
  withAmp(),
  withTheme('Carousel'),
)(Carousel);
