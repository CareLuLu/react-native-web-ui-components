import React from 'react';

class EventHandler extends React.Component {
  constructor(props) {
    super(props);
    this.mountSteps = [];
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
      this.mountSteps.push(handler);
    }
    if (this.mounted) {
      const fn = this.mountSteps.shift();
      if (fn) {
        fn.call(this);
      }
    }
  }
}

export default EventHandler;
