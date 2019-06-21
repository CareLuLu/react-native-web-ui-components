import React from 'react';
import renderer from 'react-test-renderer';
import { Dimensions, StyleSheet } from 'react-native';
import Column from '../src/Column';
import { Provider as ThemeProvider } from '../src/Theme';

let testDescription = '';
let testData = '';

// Test NOT Absolute, Case: 'lg'
testDescription = 'Column should render View with {"width": "100%"}.\n';
testData = 'Test Data: screen.type="lg" lg={12}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": "91.66666667%"}.\n';
testData = 'Test Data: screen.type="lg" lg=null md={11}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": "83.33333333%"}.\n';
testData = 'Test Data: screen.type="lg" lg=null md=null sm={10}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": "75%"}.\n';
testData = 'Test Data: screen.type="lg" lg=null md=null sm=null xs={9}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": "66.66666667%"}.\n';
testData = 'Test Data: screen.type="md" md={8}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": "58.33333333%"}.\n';
testData = 'Test Data: screen.type="md" md=null sm={7}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": "50%"}.\n';
testData = 'Test Data: screen.type="md" md=null sm=null xs={6}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": "41.66666667%"}.\n';
testData = 'Test Data: screen.type="sm" sm={5}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": "33.33333333%"}.\n';
testData = 'Test Data: screen.type="sm" sm=null xs={4}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": "25%"}.\n';
testData = 'Test Data: screen.type=[default] xs={3}';
test(testDescription + testData, () => {
  const screen = Dimensions.get('window');
  screen.type = 'xs'; // Mocked screen.type. Hence, the following are ignored: screen.widght, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={3} sm={4} md={5} lg={6} screen={screen} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test NOT Absolute, Case: md
testDescription = 'Column should render View with {"width": "16.66666667%"}.\n';
testData = 'Test Data: screen.type="md" md={2} absolute={false}';
test(testDescription + testData, () => {
  const screen = Dimensions.get('window');
  screen.type = 'md'; // Mocked screen.type. Hence, the following are ignored: screen.widght, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={0} sm={1} md={2} lg={3} screen={screen} absolute={false} />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test NOT Absolute, Case: sm
testDescription = 'Column should render View with {"width": "8.33333333%"}.\n';
testData = 'Test Data: screen.type="sm" sm={1} absolute={false}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": "8.33333333%"}.\n';
testData = 'Test Data: screen.type=[default] xs={1} absolute={false}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": "100%"}.\n';
testData = 'Test Data: screen.type="lg" lg={12} absolute={false}';
test(testDescription + testData, () => {
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
testDescription = 'Column should return null.\n';
testData = 'Test Data: screen.type=[default] xs={0} absolute={false}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with "width": 80.\n';
testData = 'Test Data: screen.type="lg" lg={80} absolute={true}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": 60}.\n';
testData = 'Test Data: screen.type="lg" lg=null md={60} absolute={true}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": 40}.\n';
testData = 'Test Data: screen.type="lg" lg=null md=null sm={40} absolute={true}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": 20}.\n';
testData = 'Test Data: screen.type="lg" lg=null md=null sm=null xs={20} absolute={true}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": 60}.\n';
testData = 'Test Data: screen.type="md" md={60} absolute={true}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": 40}.\n';
testData = 'Test Data: screen.type="md" md=null sm={40} absolute={true}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": 20}.\n';
testData = 'Test Data: screen.type="md" md=null sm=null xs={20} absolute={true}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": 40}.\n';
testData = 'Test Data: screen.type="sm" sm={40} absolute={true}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": 20}.\n';
testData = 'Test Data: screen.type="sm" sm=null xs={20} absolute={true}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": 20}.\n';
testData = 'Test Data: screen.type=[default] xs={20} absolute={true}';
test(testDescription + testData, () => {
  const screen = Dimensions.get('window');
  screen.type = 'xs'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={20} sm={40} md={60} lg={80} screen={screen} absolute />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Absolute, Case: md
testDescription = 'Column should render View with {"width": 60}.\n';
testData = 'Test Data: screen.type="md" md={60} absolute={true}';
test(testDescription + testData, () => {
  const screen = Dimensions.get('window');
  screen.type = 'md'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={20} sm={40} md={60} lg={80} screen={screen} absolute />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Absolute, Case: sm
testDescription = 'Column should render View with {"width": 20}.\n';
testData = 'Test Data: screen.type="sm" sm={20} absolute={true}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": 20}.\n';
testData = 'Test Data: screen.type=[default] xs={20} absolute={true}';
test(testDescription + testData, () => {
  const screen = Dimensions.get('window');
  screen.type = 'not-in-list'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column xs={20} sm={40} md={60} lg={80} screen={screen} absolute />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Absolute, Case: 'lg'
testDescription = 'Column should render View with {"width": 100}.\n';
testData = 'Test Data: screen.type="lg" lg={100} absolute={true}';
test(testDescription + testData, () => {
  const screen = Dimensions.get('window');
  screen.type = 'lg'; // Mocked screen.type. Hence, the following are ignored: screen.width, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column lg={100} screen={screen} absolute />
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Absolute, Width = 0
testDescription = 'Column should return null.\n';
testData = 'Test Data: screen.type=[default] xs={0} absolute={true}';
test(testDescription + testData, () => {
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
testDescription = 'Column should return default style only (alignItems, flexDirection, justifyContent).\n';
testData = 'Test Data: screen.type=[default] xs=null style=null';
test(testDescription + testData, () => {
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
testDescription = 'Column should return default style only (alignItems, flexDirection, justifyContent).\n';
testData = 'Test Data: screen.type=[default] xs=null style={}';
test(testDescription + testData, () => {
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
testDescription = 'Column should return these styles: alignItems, flexDirection, justifyContent and margin.\n';
testData = 'Test Data: screen.type=[default] xs=null style={margin:1}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": "100%"} and {"margin": 1}.\n';
testData = 'Test Data: screen.type="lg" lg={12} style={margin:1}';
test(testDescription + testData, () => {
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
testDescription = 'Column should render View with {"width": 80} and {"margin": 1}.\n';
testData = 'Test Data: screen.type="lg" lg={80} absolute={true} style={margin:1}';
test(testDescription + testData, () => {
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

// Test Outer and Inner columns
testDescription = 'Column should render View with outer and inner column (parent and child).\n'
                    + 'Outer column (parent) should have a {"width": 80} and {"margin": 1}.\n'
                    + 'Inner column (child) should have a {"width": "41.66666667%"} and {"margin": 0.2}.\n';
testData = 'Test Data: screen.type="lg"\n'
              + 'Outer_Column { lg={80} absolute={true} style={margin:1} }\n'
              + 'Inner_Column { lg={5} absolute={false} style={margin:0.2} }';
test(testDescription + testData, () => {
  const stylesOfOuterColumn = StyleSheet.create({
    margin: 1,
  });

  const stylesOfInnerColumn = StyleSheet.create({
    margin: 0.2,
  });

  const screen = Dimensions.get('window');
  screen.type = 'lg'; // Mocked screen.type. Hence, the following are ignored: screen.widght, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column
        xs={20}
        sm={40}
        md={60}
        lg={80}
        screen={screen}
        style={stylesOfOuterColumn}
        absolute
      >
        <Column
          xs={2}
          sm={3}
          md={4}
          lg={5}
          screen={screen}
          style={stylesOfInnerColumn}
        />
      </Column>
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Test Outer and Inner columns
testDescription = 'Column should render View with outer and inner column (parent and child).\n'
                    + 'Outer column (parent) should have a {"width": "100%"} and {"margin": 1}.\n'
                    + 'Inner column (child) should have a {"width": "80"} and {"margin": 0.2}.\n';
testData = 'Test Data: screen.type="lg"\n'
            + 'Outer_Column { lg={12} absolute={false} style={margin:1} }\n'
            + 'Inner_Column { lg={80} absolute={true} style={margin:0.2} }';
test(testDescription + testData, () => {
  const stylesOfOuterColumn = StyleSheet.create({
    margin: 1,
  });

  const stylesOfInnerColumn = StyleSheet.create({
    margin: 0.2,
  });

  const screen = Dimensions.get('window');
  screen.type = 'lg'; // Mocked screen.type. Hence, the following are ignored: screen.widght, screen.height

  const tree = renderer.create(
    <ThemeProvider>
      <Column
        xs={9}
        sm={10}
        md={11}
        lg={12}
        screen={screen}
        style={stylesOfOuterColumn}
      >
        <Column
          xs={20}
          sm={40}
          md={60}
          lg={80}
          screen={screen}
          style={stylesOfInnerColumn}
          absolute
        />
      </Column>
    </ThemeProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
