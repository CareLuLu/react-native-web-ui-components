import React from 'react';
import PropTypes from 'prop-types';
import { Provider as AmpProvider } from '../Amp';
import { Provider as ThemeProvider } from '../Theme';
import { Provider as HistoryProvider } from '../History';
import {
  ScreenContext,
  KeyboardContext,
  calculateScreen,
  calculateKeyboard,
} from '../Screen';
import { Helmet, style } from '../Helmet';
import baseCss from './style';

const throwHistoryError = () => {
  throw new Error(`
    UIProvider must receive \`history\` (see \`useHistory\` at https://github.com/ReactTraining/react-router). If you're not using \`react-router\` please provide equivalent navigation. For example:

    \`\`\`
    const navigation = {
      location: { pathname: '' },
      push: () => {},
      replace: () => {},
    };
    \`\`\`
  `);
};

const UIProvider = ({
  amp,
  theme,
  children,
  keyboard,
  screen,
  history,
}) => (
  <HistoryProvider value={history || throwHistoryError()}>
    <AmpProvider value={amp}>
      <ThemeProvider value={theme}>
        <KeyboardContext.Provider value={keyboard}>
          <ScreenContext.Provider value={screen}>
            <>
              <Helmet>
                <style>
                  {baseCss}
                </style>
              </Helmet>
              {children}
            </>
          </ScreenContext.Provider>
        </KeyboardContext.Provider>
      </ThemeProvider>
    </AmpProvider>
  </HistoryProvider>
);

UIProvider.propTypes = {
  keyboard: PropTypes.number.isRequired,
  screen: PropTypes.shape().isRequired,
  amp: PropTypes.bool,
  theme: PropTypes.shape(),
  history: PropTypes.shape(),
  children: PropTypes.node,
};

UIProvider.defaultProps = {
  amp: false,
  theme: {},
  history: null,
  children: null,
};

export default calculateKeyboard()(calculateScreen()(UIProvider));
