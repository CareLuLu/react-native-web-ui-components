import React from 'react';
import PropTypes from 'prop-types';
import { Provider as AmpProvider } from '../Amp';
import { Provider as ThemeProvider } from '../Theme';

const UIProvider = ({ amp, theme, children }) => (
  <AmpProvider value={amp}>
    <ThemeProvider value={theme}>
      {children}
    </ThemeProvider>
  </AmpProvider>
);

UIProvider.propTypes = {
  amp: PropTypes.bool,
  theme: PropTypes.shape(),
  children: PropTypes.node,
};

UIProvider.defaultProps = {
  amp: false,
  theme: {},
  children: null,
};

export default UIProvider;
