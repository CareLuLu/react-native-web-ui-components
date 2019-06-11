import React from 'react';
import renderer from 'react-test-renderer';
import View from '../src/View';
import { Provider as ThemeProvider } from '../src/Theme';

test('renders correctly', () => {
  const tree = renderer.create(
    <ThemeProvider>
      <View />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
