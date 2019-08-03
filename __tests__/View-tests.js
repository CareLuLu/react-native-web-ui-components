import React from 'react';
import renderer from 'react-test-renderer';
import View from '../src/View';
import Button from '../src/Button';
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

testDescription = 'View should render with class="Test__class".\n'
                    + 'There should have an onRef referencing to a Function.';
test(testDescription, () => {
  let view;
  const tree = renderer.create(
    <ThemeProvider>
      <View class="Test__class" onref={(component) => { view = component; }}>
        <Button type="navy" onPress={() => { view.setNativeProps({ style: { backgroundColor: '#20B2AA' } }); }}>
            Change Background Color
        </Button>
      </View>
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

testDescription = 'View should render with class="".\n'
                    + 'There should have an onRef referencing to a Function.';
test(testDescription, () => {
  let view;
  const tree = renderer.create(
    <ThemeProvider>
      <View onref={(component) => { view = component; }}>
        <Button type="navy" onPress={() => { view.setNativeProps({ style: { backgroundColor: '#20B2AA' } }); }}>
            Change Background Color
        </Button>
      </View>
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
