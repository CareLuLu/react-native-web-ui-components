import React from 'react';
import PropTypes from 'prop-types';
import {
  View as RNView,
  StyleSheet,
  ViewPropTypes,
} from 'react-native';
import noop from 'lodash/noop';
import compose from 'recompact/compose';
import * as Animatable from 'react-native-animatable';
import Screen, { withKeyboard } from '../Screen';
import { withTheme } from '../Theme';
import View from '../View';
import TouchableWithoutFeedback from '../TouchableWithoutFeedback';

/* eslint react/no-unused-state: 0 */
/* eslint react/no-unused-prop-types: 0 */

let zIndex = 20;

const styles = StyleSheet.create({
  empty: {},
  container: {
    width: '100%',
  },
  overlay: {
    backgroundColor: 'rgba(100, 100, 100, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    zIndex: 1,
  },
  touchable: {
    position: 'absolute',
    width: Screen.getWidth(),
    height: Screen.getHeight(),
    top: 0,
    left: 0,
  },
  marker: {
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    position: 'absolute',
    backgroundColor: 'transparent',
  },
});

class Modal extends React.PureComponent {
  static propTypes = {
    keyboard: PropTypes.number.isRequired,
    followKeyboard: PropTypes.bool,
    visible: PropTypes.bool,
    children: PropTypes.node,
    overlayStyle: ViewPropTypes.style,
    shouldCloseOnEsc: PropTypes.bool,
    onRequestClose: PropTypes.func,
  };

  static defaultProps = {
    followKeyboard: false,
    visible: true,
    children: null,
    overlayStyle: styles.empty,
    shouldCloseOnEsc: true,
    onRequestClose: noop,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      visible,
      keyboard,
      followKeyboard,
    } = nextProps;
    if (!prevState.overlayStyle
      || visible !== prevState.visibleProp
      || (followKeyboard && keyboard !== prevState.keyboard)) {
      const nextState = {
        visible,
        keyboard,
        visibleProp: visible,
        keyboardStyle: followKeyboard ? { marginTop: -keyboard } : styles.empty,
      };
      return nextState;
    }
    return null;
  }

  constructor(props) {
    super(props);
    const {
      visible,
      followKeyboard,
      keyboard,
      shouldCloseOnEsc,
      onRequestClose,
    } = props;
    zIndex += 1;
    const self = this;
    self.count = 1;
    self.mounted = false;
    self.onMountHandlers = [];
    self.ref = null;
    self.onRef = self.onRef.bind(this);
    self.state = {
      zIndex,
      visible,
      keyboard,
      followKeyboard,
      visibleProp: visible,
      overlayStyle: null,
      keyboardStyle: null,
      onPress: () => {
        if (shouldCloseOnEsc) {
          self.onMount(() => {
            self.setState({ visible: false });
            self.onMount(onRequestClose);
          });
        }
      },
    };
  }

  componentDidMount() {
    const self = this;
    self.mounted = true;
    self.onMount();
    if (self.marker && !self.state.overlayStyle) {
      setTimeout(() => {
        if (self.marker) {
          self.marker.measure((fx, fy, width, height, px, py) => {
            self.onMount(() => self.setState({
              overlayStyle: [
                styles.overlay,
                self.props.overlayStyle,
                {
                  position: 'absolute',
                  zIndex: self.state.zIndex,
                  width: Screen.getWidth(),
                  height: Screen.getHeight(),
                  left: self.props.fixed ? 0 : -px,
                  top: self.props.fixed ? 0 : -py,
                },
              ],
            }));
          });
        }
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onMount(handler) {
    if (handler) {
      this.onMountHandlers.push(handler);
    }
    if (this.mounted) {
      const fn = this.onMountHandlers.shift();
      if (fn) {
        fn();
      }
    }
  }

  onRef(marker) {
    this.marker = marker;
  }

  render() {
    const {
      visible,
      onPress,
      overlayStyle,
      keyboardStyle,
      followKeyboard,
    } = this.state;
    const { children } = this.props;
    if (!visible) {
      return null;
    }
    if (!overlayStyle) {
      return <RNView ref={this.onRef} style={styles.marker} />;
    }
    if (followKeyboard) {
      return (
        <View style={overlayStyle}>
          <TouchableWithoutFeedback
            style={styles.touchable}
            onPress={onPress}
          >
            <View style={styles.touchable} />
          </TouchableWithoutFeedback>
          <Animatable.View
            useNativeDriver
            animation="slideInDown"
            duration={300}
            style={keyboardStyle}
          >
            {children}
          </Animatable.View>
        </View>
      );
    }
    return (
      <View style={overlayStyle}>
        <TouchableWithoutFeedback
          style={styles.touchable}
          onPress={onPress}
        >
          <View style={styles.touchable} />
        </TouchableWithoutFeedback>
        <Animatable.View useNativeDriver animation="slideInDown" duration={300}>
          {children}
        </Animatable.View>
      </View>
    );
  }
}

export default compose(
  withKeyboard(),
  withTheme('Modal'),
)(Modal);
