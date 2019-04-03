import React from 'react';
import PropTypes from 'prop-types';
import { Provider as AmpProvider } from '../Amp';
import { Provider as ThemeProvider } from '../Theme';
import { Helmet, style } from '../Helmet';
import baseCss from './style';

const UIProvider = ({ amp, theme, children }) => (
  <React.Fragment>
    <Helmet>
      <style>
        {baseCss}
      </style>
    </Helmet>
    <AmpProvider value={amp}>
      <ThemeProvider value={theme}>
        {children}
      </ThemeProvider>
    </AmpProvider>
  </React.Fragment>
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
