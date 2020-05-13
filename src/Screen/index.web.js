import React, { useContext } from 'react';

function calculateHeight() {
  return window.innerHeight
    || document.documentElement.clientHeight
    || document.getElementsByTagName('body')[0].clientHeight;
}

function calculateWidth() {
  return window.innerWidth
    || document.documentElement.clientWidth
    || document.getElementsByTagName('body')[0].clientWidth;
}

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

function addEventListener(eventName, handler) {
  switch (eventName) {
    case 'resize': window.addEventListener('resize', handler); break;
    default: throw new Error(`Event '${eventName}' has not been implemented`);
  }
}

let screen = {
  height: calculateHeight(),
  width: calculateWidth(),
};
screen.type = calculateType(screen.width);
screen.reduced = screen.type === 'xs' || screen.type === 'sm';

addEventListener('resize', () => {
  screen = {
    height: calculateHeight(),
    width: calculateWidth(),
  };
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
  let element = document.querySelector('[role="navigation"]');
  if (element && element.lastElementChild) {
    return {
      scrollTop: () => element.lastElementChild.scrollTop,
      scrollTo: (x, y) => element.lastElementChild.scrollTo(x, y),
      addEventListener: handler => element.lastElementChild.addEventListener('scroll', handler),
    };
  }
  element = document.querySelector('[style="position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; overflow-y: auto; transition: left 0.3s ease-out 0s, right 0.3s ease-out 0s;"]');
  if (element) {
    return {
      scrollTop: () => element.scrollTop,
      scrollTo: (x, y) => element.scrollTo(x, y),
      addEventListener: handler => element.addEventListener('scroll', handler),
      removeEventListener: handler => element.removeEventListener('scroll', handler),
    };
  }
  return {
    scrollTop: () => (document.documentElement || document.body).scrollTop,
    scrollTo: (x, y) => (document.documentElement || document.body).scrollTo(x, y),
    addEventListener: handler => window.addEventListener('scroll', handler),
    removeEventListener: handler => window.removeEventListener('scroll', handler),
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

export const calculateKeyboard = () => Component => props => <Component {...props} keyboard={0} />;

export const calculateScreen = () => Component => class extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { screen };
    this.mounted = false;
    this.onMountHandlers = [];
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
