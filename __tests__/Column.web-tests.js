import React from 'react';
import renderer from 'react-test-renderer';
import { StyleSheet } from 'react-native';
import Column from '../src/Column/index.web';
import { Provider as ThemeProvider } from '../src/Theme';

let testDescription = '';
let testData = '';

testDescription = 'Column for Web should render View with class = ` col-xs-9 col-sm-10 col-md-11 col-lg-12`.\n';
testData = 'Test Data: lg={12} md={11} sm={10} xs={9}';
test(testDescription + testData, () => {
  const tree = renderer.create(
    <ThemeProvider>
      <Column lg={12} md={11} sm={10} xs={9} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

testDescription = 'Column for Web should render View with class = ` col-xs-9 col-sm-10 col-md-11 col-lg-11`.\n';
testData = 'Test Data: md={11} sm={10} xs={9}';
test(testDescription + testData, () => {
  const tree = renderer.create(
    <ThemeProvider>
      <Column md={11} sm={10} xs={9} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

testDescription = 'Column for Web should render View with class = ` col-xs-9 col-sm-10 col-md-10 col-lg-10`.\n';
testData = 'Test Data: sm={10} xs={9}';
test(testDescription + testData, () => {
  const tree = renderer.create(
    <ThemeProvider>
      <Column sm={10} xs={9} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

testDescription = 'Column for Web should render View with class = ` col-xs-9 col-sm-9 col-md-9 col-lg-9`.\n';
testData = 'Test Data: xs={9}';
test(testDescription + testData, () => {
  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={9} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

testDescription = 'Column for Web should render View with class = ` col-lg-10 col-md-10 col-sm-10`.\n'
                    + 'The following classes should not be displayed: col-xs.\n';
testData = 'Test Data: sm={10}';
test(testDescription + testData, () => {
  const tree = renderer.create(
    <ThemeProvider>
      <Column sm={10} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

testDescription = 'Column for Web should render View with class = ` col-lg-11 col-md-11`.\n'
                    + 'The following classes should not be displayed: col-sm col-xs.\n';
testData = 'Test Data: md={11}';
test(testDescription + testData, () => {
  const tree = renderer.create(
    <ThemeProvider>
      <Column md={11} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

testDescription = 'Column for Web should render View with class = ` col-lg-12`.\n'
                    + 'The following classes should not be displayed: col-md col-sm col-xs.\n';
testData = 'Test Data: lg={12}';
test(testDescription + testData, () => {
  const tree = renderer.create(
    <ThemeProvider>
      <Column lg={12} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

testDescription = 'Column for Web should render View with class = ` col-xs-9 col-sm-10 col-md-11 col-lg-12` and "width": 9.\n';
testData = 'Test Data: lg={12} md={11} sm={10} xs={9} absolute={true}';
test(testDescription + testData, () => {
  const tree = renderer.create(
    <ThemeProvider>
      <Column lg={12} md={11} sm={10} xs={9} absolute />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

testDescription = 'Column for Web should render View with class = ` col-xs-9 col-sm-10 col-md-11 col-lg-12` and "margin": 1.\n';
testData = 'Test Data: lg={12} md={11} sm={10} xs={9} absolute={true} "margin": 1';
test(testDescription + testData, () => {
  const styles = StyleSheet.create({
    margin: 1,
  });

  const tree = renderer.create(
    <ThemeProvider>
      <Column lg={12} md={11} sm={10} xs={9} style={styles} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

testDescription = 'Column for Web should render View with outer and inner column (parent and child).\n'
                    + 'Outer column (parent) should have class = ` col-xs-9 col-sm-10 col-md-11 col-lg-12`, "width": 9, and "margin": 1\n'
                    + 'Inner column (child) should have class = ` col-xs-1 col-sm-2 col-md-3 col-lg-4`, and "margin": 0.2\n';
testData = 'Test Data: Outer_Column { lg={12} md={11} sm={10} xs={9} absolute={true} "margin": 1}\n'
                + 'Inner_Column { lg={4} md={3} sm={2} xs={1} absolute={false} "margin": 0.2}';
test(testDescription + testData, () => {
  const stylesOfOuterColumn = StyleSheet.create({
    margin: 1,
  });

  const stylesOfInnerColumn = StyleSheet.create({
    margin: 0.2,
  });

  const tree = renderer.create(
    <ThemeProvider>
      <Column lg={12} md={11} sm={10} xs={9} style={stylesOfOuterColumn} absolute>
        <Column lg={4} md={3} sm={2} xs={1} style={stylesOfInnerColumn} absolute={false} />
      </Column>
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

testDescription = 'Column for Web should render View with outer and inner column (parent and child).\n'
                    + 'Outer column (parent) should have class = ` col-xs-9 col-sm-10 col-md-11 col-lg-12`, and "margin": 1.\n'
                    + 'Inner column (child) should have class = ` col-xs-1 col-sm-2 col-md-3 col-lg-4`, "width": 1, and "margin": 0.2\n';
testData = 'Test Data: Outer_Column { lg={12} md={11} sm={10} xs={9} absolute={false} "margin": 1}\n'
             + 'Inner_Column { lg={4} md={3} sm={2} xs={1} absolute={true} "margin": 0.2}';
test(testDescription + testData, () => {
  const stylesOfOuterColumn = StyleSheet.create({
    margin: 1,
  });

  const stylesOfInnerColumn = StyleSheet.create({
    margin: 0.2,
  });

  const tree = renderer.create(
    <ThemeProvider>
      <Column lg={12} md={11} sm={10} xs={9} style={stylesOfOuterColumn} absolute={false}>
        <Column lg={4} md={3} sm={2} xs={1} style={stylesOfInnerColumn} absolute />
      </Column>
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

testDescription = 'Column for Web should render View with class = ``.\n'
                    + 'The following classes should not be displayed: col-xs col-sm col-md col-lg\n';
testData = 'Test Data: xs=null sm=null md=null lg=null';
test(testDescription + testData, () => {
  const tree = renderer.create(
    <ThemeProvider>
      <Column />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
