import React from 'react';
import renderer from 'react-test-renderer';
import { Dimensions, StyleSheet } from 'react-native';
import Column from '../src/Column';
import { Provider as ThemeProvider } from '../src/Theme';

// Test NOT Absolute, Case: 'lg'
test('Column should render with {"width": "100%"}. Test Data: screen.type="lg" lg={12}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'lg'; // Mocked screen.type. Hence, the following are ignored: screen.widght, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={9} sm={10} md={11} lg={12} screen={screen} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test NOT Absolute, Case: 'lg'
test('Column should render with {"width": "91.66666667%"}. Test Data: screen.type="lg" lg=null md={11}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'lg'; // Mocked screen.type. Hence, the following are ignored: screen.widght, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={9} sm={10} md={11} screen={screen} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test NOT Absolute, Case: 'lg'
test('Column should render with {"width": "83.33333333%"}. Test Data: screen.type="lg" lg=null md=null sm={10}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'lg'; // Mocked screen.type. Hence, the following are ignored: screen.widght, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={9} sm={10} screen={screen} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test NOT Absolute, Case: 'lg'
test('Column should render with {"width": "75%"}. Test Data: screen.type="lg" lg=null md=null sm=null xs={9}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'lg'; // Mocked screen.type. Hence, the following are ignored: screen.widght, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={9} screen={screen} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test NOT Absolute, Case: 'md'
test('Column should render with {"width": "66.66666667%"}. Test Data: screen.type="md" md={8}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'md'; // Mocked screen.type. Hence, the following are ignored: screen.widght, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={6} sm={7} md={8} lg={9} screen={screen} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test NOT Absolute, Case: 'md'
test('Column should render with {"width": "58.33333333%"}. Test Data: screen.type="md" md=null sm={7}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'md'; // Mocked screen.type. Hence, the following are ignored: screen.widght, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={6} sm={7} lg={9} screen={screen} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test NOT Absolute, Case: 'md'
test('Column should render with {"width": "50%"}. Test Data: screen.type="md" md=null sm=null xs={6}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'md'; // Mocked screen.type. Hence, the following are ignored: screen.widght, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={6} lg={9} screen={screen} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test NOT Absolute, Case: 'sm'
test('Column should render with {"width": "41.66666667%"}. Test Data: screen.type="sm" sm={5}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'sm'; // Mocked screen.type. Hence, the following are ignored: screen.widght, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={4} sm={5} md={6} lg={7} screen={screen} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test NOT Absolute, Case: 'sm'
test('Column should render with {"width": "33.33333333%"}. Test Data: screen.type="sm" sm=null xs={4}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'sm'; // Mocked screen.type. Hence, the following are ignored: screen.widght, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={4} md={6} lg={7} screen={screen} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test NOT Absolute, Case: default
test('Column should render with {"width": "25%"}. Test Data: screen.type=[default] xs={3}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'xs'; // Mocked screen.type. Hence, the following are ignored: screen.widght, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={3} sm={4} md={5} lg={6} screen={screen} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test NOT Absolute, Case: default
test('Column should render with {"width": "16.66666667%"}. Test Data: screen.type="md" md={2} absolute={false}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'md'; // Mocked screen.type. Hence, the following are ignored: screen.widght, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={0} sm={1} md={2} lg={3} screen={screen} absolute={false} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test NOT Absolute, Case: default
test('Column should render with {"width": "8.33333333%"}. Test Data: screen.type="sm" sm={1} absolute={false}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'sm'; // Mocked screen.type. Hence, the following are ignored: screen.widght, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column sm={1} md={2} lg={3} screen={screen} absolute={false} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test NOT Absolute, Case: default
test('Column should render with {"width": "8.33333333%"}. Test Data: screen.type=[default] xs={1} absolute={false}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'not-in-list'; // Mocked screen.type. Hence, the following are ignored: screen.widght, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={1} sm={2} md={3} lg={4} screen={screen} absolute={false} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test NOT Absolute (false), Case: 'lg'
test('Column should render with {"width": "100%"}. Test Data: screen.type="lg" lg={12} absolute={false}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'lg'; // Mocked screen.type. Hence, the following are ignored: screen.widght, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column lg={12} screen={screen} absolute={false} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test NOT Absolute (false), Width = 0
test('Column should return null. Test Data: screen.type=[default] xs={0} absolute={false}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'xs'; // Mocked screen.type. Hence, the following are ignored: screen.widght, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={0} screen={screen} absolute={false} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Absolute, Case: 'lg'
test('Column should render with "width": 80. Test Data: screen.type="lg" lg={80} absolute={true}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'lg'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={20} sm={40} md={60} lg={80} absolute />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Absolute, Case: 'lg'
test('Column should render with {"width": 60}. Test Data: screen.type="lg" lg=null md={60} absolute={true}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'lg'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={20} sm={40} md={60} screen={screen} absolute />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Absolute, Case: 'lg'
test('Column should render with {"width": 40}. Test Data: screen.type="lg" lg=null md=null sm={40} absolute={true}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'lg'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={20} sm={40} screen={screen} absolute />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Absolute, Case: 'lg'
test('Column should render with {"width": 20}. Test Data: screen.type="lg" lg=null md=null sm=null xs={20} absolute={true}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'lg'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={20} screen={screen} absolute />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Absolute, Case: 'md'
test('Column should render with {"width": 60}. Test Data: screen.type="md" md={60} absolute={true}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'md'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={20} sm={40} md={60} lg={80} screen={screen} absolute />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Absolute, Case: 'md'
test('Column should render with {"width": 40}. Test Data: screen.type="md" md=null sm={40} absolute={true}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'md'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={20} sm={40} lg={80} screen={screen} absolute />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Absolute, Case: 'md'
test('Column should render with {"width": 20}. Test Data: screen.type="md" md=null sm=null xs={20} absolute={true}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'md'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={20} lg={80} screen={screen} absolute />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Absolute, Case: 'sm'
test('Column should render with {"width": 40}. Test Data: screen.type="sm" sm={40} absolute={true}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'sm'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={20} sm={40} md={60} lg={80} screen={screen} absolute />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Absolute, Case: 'sm'
test('Column should render with {"width": 20}. Test Data: screen.type="sm" sm=null xs={20} absolute={true}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'sm'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={20} md={60} lg={80} screen={screen} absolute />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Absolute, Case: default
test('Column should render with {"width": 20}. Test Data: screen.type=[default] xs={20} absolute={true}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'xs'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={20} sm={40} md={60} lg={80} screen={screen} absolute />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Absolute, Case: default
test('Column should render with {"width": 60}. Test Data: screen.type="md" md={60} absolute={true}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'md'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={20} sm={40} md={60} lg={80} screen={screen} absolute />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Absolute, Case: default
test('Column should render with {"width": 20}. Test Data: screen.type="sm" sm={20} absolute={true}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'sm'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column sm={20} md={60} lg={80} screen={screen} absolute />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Absolute, Case: default
test('Column should render with {"width": 20}. Test Data: screen.type=[default] xs={20} absolute={true}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'not-in-list'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={20} sm={40} md={60} lg={80} screen={screen} absolute />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Absolute (false), Case: 'lg'
test('Column should render with {"width": 100}. Test Data: screen.type="lg" lg={100} absolute={true}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'lg'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column lg={100} screen={screen} absolute />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Absolute (false), Width = 0
test('Column should return null. Test Data: screen.type=[default] xs={0} absolute={true}', () => {
  const screen = Dimensions.get('window');
  screen.type = 'xs'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={0} screen={screen} absolute />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Default Style
test('Column should return default style only (alignItems, flexDirection, justifyContent). Test Data: screen.type=[default] xs=null style=null', () => {
  const screen = Dimensions.get('window');
  screen.type = 'xs'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column screen={screen} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Default Style
test('Column should return default style only (alignItems, flexDirection, justifyContent). Test Data: screen.type=[default] xs=null style={}', () => {
  const styles = StyleSheet.create({
  });

  const screen = Dimensions.get('window');
  screen.type = 'xs'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column screen={screen} style={styles} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Default Style with other Style
test('Column should return default style (alignItems, flexDirection, justifyContent) and other style (margin). Test Data: screen.type=[default] xs=null style={margin:1}', () => {
  const styles = StyleSheet.create({
    margin: 1,
  });

  const screen = Dimensions.get('window');
  screen.type = 'xs'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column screen={screen} style={styles} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Style and NOT Absolute
test('Column should render with {"width": "100%"} and {"margin": 1}. Test Data: screen.type="lg" lg={12} style={margin:1}', () => {
  const styles = StyleSheet.create({
    margin: 1,
  });

  const screen = Dimensions.get('window');
  screen.type = 'lg'; // Mocked screen.type. Hence, the following are ignored: screen.widght, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={9} sm={10} md={11} lg={12} screen={screen} style={styles} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Style and Absolute
test('Column should render with {"width": 80} and {"margin": 1}. Test Data: screen.type="lg" lg={80} absolute={true} style={margin:1}', () => {
  const styles = StyleSheet.create({
    margin: 1,
  });

  const screen = Dimensions.get('window');
  screen.type = 'lg'; // Mocked screen.type. Hence, the following are ignored: screen.widght, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={20} sm={40} md={60} lg={80} screen={screen} style={styles} absolute />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
