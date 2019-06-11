import React from 'react';
import View from '../src/View';
import { Provider as ThemeProvider } from '../src/Theme';
import renderer from 'react-test-renderer';

test('renders correctly', () => {
   const tree = renderer.create(
       <ThemeProvider>
           <View>
           </View>
       </ThemeProvider>
   ).toJSON();
expect(tree).toMatchSnapshot();
});