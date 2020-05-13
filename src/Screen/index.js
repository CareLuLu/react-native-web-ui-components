import React, { useContext } from 'react';
import { Dimensions, Keyboard } from 'react-native';

/* eslint react/no-multi-comp: 0 */
/* eslint max-classes-per-file: 0 */

function calculateType(width) {
  if (width >= 1200) {
    return 'lg';
  }
  if (width >= 992) {
    return 'md';
  }
  if (width >= 768) {
    return 'sm';
  }
  return 'xs';
}

let keyboardHeight = 0;

let screen = Dimensions.get('window');
if (screen.width > screen.height) {
  const aux = screen.height;
  screen.height = screen.width;
  screen.width = aux;
}
screen.type = calculateType(screen.width);
screen.reduced = screen.type === 'xs' || screen.type === 'sm';

function addEventListener(eventName, handler) {
  switch (eventName) {
    case 'keyboardShow':
      Keyboard.addListener('keyboardDidShow', handler);
      break;
    case 'keyboardHide':
      Keyboard.addListener('keyboardDidHide', handler);
      break;
    case 'resize':
      Dimensions.addEventListener('change', handler);
      break;
    default: throw new Error(`Event '${eventName}' has not been implemented`);
  }
}

addEventListener('keyboardHide', () => {
  keyboardHeight = 0;
});

addEventListener('keyboardShow', (e) => {
  keyboardHeight = e.endCoordinates.height;
});

addEventListener('resize', () => {
  screen = { ...Dimensions.get('window') };
  screen.type = calculateType(screen.width);
  screen.reduced = screen.type === 'xs' || screen.type === 'sm';
});

function getHeight() {
  return screen.height;
}

function getWidth() {
  return screen.width;
}

function getType() {
  return screen.type;
}

function getScrollElement() {
  return {
    scrollTop: () => 0,
    scrollTo: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
  };
}

export default {
  getHeight,
  getWidth,
  getType,
  getScrollElement,
  addEventListener,
};

export const ScreenContext = React.createContext(screen);

export const KeyboardContext = React.createContext(0);

export const useScreen = () => useContext(ScreenContext);

export const withScreen = () => Component => props => (
  <ScreenContext.Consumer>
    {value => <Component {...props} screen={value} />}
  </ScreenContext.Consumer>
);

export const useKeyboard = () => useContext(KeyboardContext);

export const withKeyboard = () => Component => props => (
  <KeyboardContext.Consumer>
    {value => <Component {...props} keyboard={value} />}
  </KeyboardContext.Consumer>
);

export const calculateScreen = () => Component => class extends React.PureComponent {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.onMountHandlers = [];
    this.state = { screen };
    this.tryToUpdate = this.update.bind(this);
    addEventListener('resize', this.tryToUpdate);
  }

  componentDidMount() {
    this.mounted = true;
    this.onMount();
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

  update() {
    const self = this;
    self.onMount(() => self.setState({ screen }));
  }

  render() {
    const { screen } = this.state; // eslint-disable-line
    return <Component {...this.props} screen={screen} />;
  }
};

export const calculateKeyboard = () => Component => class extends React.PureComponent {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.onMountHandlers = [];
    this.state = { keyboard: keyboardHeight };
    this.tryToUpdate = this.update.bind(this);
    addEventListener('keyboardHide', this.tryToUpdate);
    addEventListener('keyboardShow', this.tryToUpdate);
  }

  componentDidMount() {
    this.mounted = true;
    this.onMount();
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

  update() {
    const self = this;
    self.onMount(() => self.setState({ keyboard: keyboardHeight }));
  }

  render() {
    const { keyboard } = this.state; // eslint-disable-line
    return <Component {...this.props} keyboard={keyboard} />;
  }
};
