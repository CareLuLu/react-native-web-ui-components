import React from 'react';
import PropTypes from 'prop-types';
import { Provider as AmpProvider } from '../Amp';
import { Provider as ThemeProvider } from '../Theme';
import {
  ScreenContext,
  KeyboardContext,
  calculateScreen,
  calculateKeyboard,
} from '../Screen';
import { Helmet, style } from '../Helmet';
import baseCss from './style';

const UIProvider = ({
  amp,
  theme,
  children,
  keyboard,
  screen,
}) => (
  <React.Fragment>
    <Helmet>
      <style>
        {baseCss}
      </style>
    </Helmet>
    <AmpProvider value={amp}>
      <ThemeProvider value={theme}>
        <KeyboardContext.Provider value={keyboard}>
          <ScreenContext.Provider value={screen}>
            {children}
          </ScreenContext.Provider>
        </KeyboardContext.Provider>
      </ThemeProvider>
    </AmpProvider>
  </React.Fragment>
);

UIProvider.propTypes = {
  keyboard: PropTypes.number.isRequired,
  screen: PropTypes.shape().isRequired,
  amp: PropTypes.bool,
  theme: PropTypes.shape(),
  children: PropTypes.node,
};

UIProvider.defaultProps = {
  amp: false,
  theme: {},
  children: null,
};

export default calculateKeyboard()(calculateScreen()(UIProvider));
