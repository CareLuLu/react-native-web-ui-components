import React from 'react';

const AMP = React.createContext('amp');

export const { Provider } = AMP;

export const { Consumer } = AMP;

export const withAmp = () => Component => props => (
  <AMP.Consumer>
    {amp => <Component {...props} amp={amp} />}
  </AMP.Consumer>
);

export default {
  withAmp,
  Provider,
  Consumer,
};
