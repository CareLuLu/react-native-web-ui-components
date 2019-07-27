import React from 'react';
import renderer from 'react-test-renderer';
import View from '../src/View';
import { Provider as ThemeProvider } from '../src/Theme';

let testDescription = '';

testDescription = 'Outer View should render with class="Test__parent class".\n'
                    + 'Inner View should render with class="Test__child".\n';
test(testDescription, () => {
  const tree = renderer.create(
    <ThemeProvider>
      <View className="Test__parent">
        <View className="Test__child" />
      </View>
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

testDescription = 'Outer View should render with class="Test__parent class".\n'
                    + 'Inner View should render with class="Test__child".\n'
                    + 'Both the Outer and Inner View should have an onRef referencing to a Function.';
test(testDescription, () => {
  const tree = renderer.create(
    <ThemeProvider>
      <View className="Test__parent" onref={(component) => { this.view = component; }}>
        <View className="Test__child" onref={(component) => { this.view = component; }} />
      </View>
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

testDescription = 'Outer View should render with class="".\n'
                    + 'Inner View should render with class="".\n'
                    + 'Both the Outer and Inner View should have an onRef referencing to a Function.';
test(testDescription, () => {
  const tree = renderer.create(
    <ThemeProvider>
      <View onref={(component) => { this.view = component; }}>
        <View onref={(component) => { this.view = component; }} />
      </View>
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
