import React, { useContext } from 'react';

const History = React.createContext('history');

export const { Provider } = History;

export const { Consumer } = History;

export const withHistory = () => Component => props => (
  <History.Consumer>
    {history => <Component {...props} history={history} />}
  </History.Consumer>
);

export const useHistory = () => useContext(History);

export default {
  Provider,
  Consumer,
  useHistory,
  withHistory,
};
