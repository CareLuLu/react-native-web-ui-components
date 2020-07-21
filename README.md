# React Native Web UI Components

[![Dependencies](https://img.shields.io/badge/dependencies-renovate-brightgreen.svg)](https://github.com/CareLuLu/react-native-web-ui-components/issues/12)
[![Codacy Badge](https://img.shields.io/codacy/grade/c0ef990240a84ab7abee7af64602dd6d/master)](https://www.codacy.com/gh/CareLuLu/react-native-web-ui-components?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=CareLuLu/react-native-web-ui-components&amp;utm_campaign=Badge_Grade)
[![NPM](https://img.shields.io/npm/v/react-native-web-ui-components.svg)](https://www.npmjs.com/package/react-native-web-ui-components)

React Native Web UI Components is a library of customized [React Native](https://facebook.github.io/react-native/)/[React Native Web](https://github.com/necolas/react-native-web) components for mobile and web UI. This library is used by [React Native Web Jsonschema Form](https://github.com/CareLuLu/react-native-web-jsonschema-form).

- See this library in production at https://www.carelulu.com.
- See a skeleton project example at https://www.carelulu.com/react-native-web-example.

## Table of Contents

* [Documentation](#documentation)
* [Setup](#setup)
  * [Requirements](#requirements)
  * [Installation](#installation)
  * [Mobile](#mobile)
  * [Web: Client-side Rendering (CSR)](#client-side-rendering)
  * [Web: Server-side Rendering (SSR)](#server-side-rendering)
* [Usage](#usage)
* [Class Names](#class-names)
* [Components](#components)
  * [Alert](#alert)
  * [Autocomplete](#autocomplete)
  * [Banner](#banner)
  * [Bold](#bold)
  * [Box](#box)
  * [BoxHeader](#boxheader)
  * [BoxItem](#boxitem)
  * [BoxTitle](#boxtitle)
  * [Button](#button)
  * [Carousel](#carousel)
  * [Checkbox](#checkbox)
  * [Column](#column)
  * [Confirm](#confirm)
  * [Container](#container)
  * [Datepicker](#datepicker)
  * [Draggable](#draggable)
  * [Dropzone](#dropzone)
  * [Helmet](#helmet)
  * [HideShowText](#hideshowtext)
  * [Hr](#hr)
  * [Icon](#icon)
  * [IconLink](#iconlink)
  * [IconText](#icontext)
  * [Image](#image)
  * [Link](#link)
  * [Loading](#loading)
  * [MainContainer](#maincontainer)
  * [NavLink](#navlink)
  * [Popup](#popup)
  * [Radiobox](#radiobox)
  * [ReadMoreLessLink](#readmorelesslink)
  * [Router](#router)
  * [Row](#row)
  * [Screen](#screen)
  * [ScrollView](#scrollview)
  * [Select](#select)
  * [Sidebar](#sidebar)
  * [Slider](#slider)
  * [Spinner](#spinner)
  * [StylePropType](#styleproptype)
  * [Switch](#switch)
  * [TagInput](#taginput)
  * [Text](#text)
  * [TextInput](#textinput)
  * [TimeRangePicker](#timerangepicker)
  * [Title](#title)
  * [Tooltip](#tooltip)
  * [View](#view)
  * [WebOnly](#webonly)
  * [WebView](#webview)
* [Theme](#theme)
  * [Global](#global)
  * [Platform](#platform)
  * [Component](#component)
* [License](#license)

## Documentation

Coming soon!

## Setup

React Native Web UI Components was created to facilitate the development of `write once, run anywhere` web and mobile apps. In order to accomplish that, this library is heavily based on React Native and React Native Web.

### Requirements

First you need to install react ^16.8.3 (this library uses react-hooks).

```sh
yarn add react react-dom 
```

If you're using [Expo](https://expo.io/), they use a custom version of react-native and therefore you need to check what is the React Native repository for the Expo version you're using. For Expo v33.x.x you'd run:

```sh
yarn add https://github.com/expo/react-native/archive/sdk-33.0.0.tar.gz
```

If your project is also being used for web, please install React Native Web. Make sure your babel/webpack build replace all `react-native` imports with `react-native-web` ([details here](https://github.com/necolas/react-native-web/blob/master/docs/guides/getting-started.md)). If you used [React Create App](https://github.com/facebook/create-react-app), aliasing is already taken care off for you.

```sh
yarn add react-native-web 
```

### Installation

Install the library using `yarn` or `npm`.

```sh
yarn add react-native-web-ui-components
```

### Mobile

- Example using `react-router`:

```javascript
import React from 'react';
import { StyleSheet } from 'react-native';
import { useHistory } from 'react-router';
import { Router, Switch } from 'react-router-native';
import { UIProvider } from 'react-native-web-ui-components';

const theme = {
  input: {
    focused: StyleSheet.create({
      border: {
        borderColor: 'yellow',
      },
    }),
  },
};

const Theme = (props) => {
  const history = useHistory();
  return (
    <UIProvider theme={theme} history={history}>
      <EntryScreen {...props} />
    </UIProvider>
  );
};

const App = props = (
  <Router>
    <Switch>
      <Theme {...props} />
    </Switch>
  </Router>
);

export default App;
```

- Example using `react-navigation`:
```javascript
import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UIProvider } from 'react-native-web-ui-components';

const theme = {
  input: {
    focused: StyleSheet.create({
      border: {
        borderColor: 'yellow',
      },
    }),
  },
};

const Stack = createStackNavigator();

const Theme = (props) => {
  const navigation = useNavigation();

  const history = {
    location: {
      pathname: () => navigation.state.routeName,
    },
    push: routeName => navigation.navigate(routeName),
    replace: routeName => navigation.dispatch(
      StackActions.replace(routeName),
    ),
  };

  return (
    <UIProvider theme={theme} history={history}>
      <EntryScreen {...props} />
    </UIProvider>
  );
};

const App = props = (
  <NavigationContainer>
    <Stack.Navigator>
      <Theme {...props} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
```

### Client Side Rendering
```javascript
import React from 'react';
import { StyleSheet } from 'react-native';
import { useHistory } from 'react-router';
import { Router, Switch } from 'react-router-dom';
import { UIProvider } from 'react-native-web-ui-components';

const theme = {
  input: {
    focused: StyleSheet.create({
      border: {
        borderColor: 'yellow',
      },
    }),
  },
};

const Theme = (props) => {
  const history = useHistory();
  return (
    <UIProvider theme={theme} history={history}>
      <EntryScreen {...props} />
    </UIProvider>
  );
};

const App = props = (
  <Router>
    <Switch>
      <Theme {...props} />
    </Switch>
  </Router>
);

export default App;
```

### Server Side Rendering

This library was built with Google's new standard [Accelerated Mobile Page](https://amp.dev/) in mind. Although most components exported are AMP compatible by default, some components will have different implementations for AMP and non-AMP pages. This usually happens when the usabability would be degraded by complying with AMP requirements. If you're using server-side rendering (SSR), set `amp` to `true` for AMP pages.

```javascript
// App.js
import React from 'react';
import { StyleSheet } from 'react-native';
import { useHistory } from 'react-router';
import { StaticRouter, Switch } from 'react-router-dom';
import { UIProvider } from 'react-native-web-ui-components';

const theme = {
  input: {
    focused: StyleSheet.create({
      border: {
        borderColor: 'yellow',
      },
    }),
  },
};

const Theme = (props) => {
  const history = useHistory();

  const { amp } = props;
  return (
    <UIProvider theme={theme} history={history} amp={amp}>
      <EntryScreen {...props} />
    </UIProvider>
  );
};

const App = (props) = {
  const { pathname, context } = props;
  return (
    <StaticRouter location={pathname} context={context}>
      <Switch>
        <Theme {...props} />
      </Switch>
    </StaticRouter>
  );
};

export default App;

// index.js
import Koa from 'koa';
import ReactDOMServer from 'react-dom/server';
import { AppRegistry } from 'react-native';
import { Helmet } from 'react-helmet';
import App from './App';

const app = new Koa();

AppRegistry.registerComponent('App', () => App);

const renderer = async (ctx) => {
  const context = {};
  const pathname = ctx.request.path;
  const amp = /^\/amp/.test(pathname);

  const initialProps = { pathname, context, amp };

  const { element, getStyleElement } = AppRegistry.getApplication(
    'App',
    { initialProps },
  );

  let body;
  try {
    body = await ReactDOMServer.renderToString(App);
  } catch (err) {
    ctx.status = 500;
    return ctx.redirect('/500');
  }

  if (context.url) {
    if (/^\/404/.test(context.url)) {
      ctx.status = 404;
    }
    return ctx.redirect(context.url);
  }

  const helmet = Helmet.renderStatic();
  const markup = ReactDOMServer.renderToStaticMarkup(getStyleElement());

  ctx.body = `
    <!DOCTYPE html>
    <html ${helmet.htmlAttributes.toString()}>
      <head>
          ${helmet.title.toString()}
          ${helmet.meta.toString()}
          ${helmet.link.toString()}
          ${markup}
          ${helmet.style.toString()}
      </head>
      <body ${helmet.bodyAttributes.toString()}>
        <div id="root">
          ${body}
        </div>
      </body>
    </html>
  `;
};

app.use(renderer);
app.listen(3000);
```

## Usage

React Native Web UI Components was developed with file size in mind and therefore exports individual components without the need of using the entire library. 

```javascript
import Autocomplete from 'react-native-web-ui-components/Autocomplete';
```

## Class Names

While mobile components are indiferent to the `className` property, that is very useful for the web. [React Native Web](https://github.com/necolas/react-native-web) components no longer accept class names but for convenience, this library accepts the `className` property for all exported components. Please note that class names are converted into `data-class` attribute.

```javascript
import React from 'react';
import { Row } from 'react-native-web-ui-components';

// You must use the Helmet export by this library to avoid conflicts.
import Helmet, { style } from 'react-native-web-ui-components/Helmet';

const MyComponent = () => (
  <React.Fragment>
    <Helmet>
      <style>
        {`
          [data-class~="MyComponent__Row"] {
            width: calc(100% - 20px);
          }
        `}
      </style>
    </Helmet>
    <Row className="MyComponent__Row" />
  </React.Fragment>
);
```

## Components

### Alert

Opens an Alert popup. This library uses [React Modal](https://github.com/reactjs/react-modal) to display modals for web.

![Alert Component Example](https://divin2sy6ce0b.cloudfront.net/docs/alert.png)

### Autocomplete

Displays a text input with autocomplete functionality.

![Autocomplete Component Example](https://divin2sy6ce0b.cloudfront.net/docs/autocomplete.gif)

### Banner

Displays a banner/background image that adjusts with the screen size. You can display other components within the banner.

![Banner Component Example](https://divin2sy6ce0b.cloudfront.net/docs/banner.gif)

### Bold

Same as [Text](#text) but using the bold font defined in the theme `fontFamily.bold`.

### Box

Container used to wrap [BoxHeader](#boxheader) and [BoxItem](#boxitem).

![Box Component Example](https://divin2sy6ce0b.cloudfront.net/docs/box.png)

### BoxHeader

Displays a header within the [Box](#box).

### BoxItem

Displays an item within the [Box](#box).

### BoxTitle

Displays the title of the [BoxHeader](#boxheader).

### Button

Displays a button.

![Button Component Example](https://divin2sy6ce0b.cloudfront.net/docs/button.png)

### Carousel

Displays a carousel. If `amp` is `true`, then it will automatically use [Google AMP Carousel](https://amp.dev/documentation/examples/components/amp-carousel/).

![Carousel Component Example](https://divin2sy6ce0b.cloudfront.net/docs/carousel.gif)

### Checkbox

Displays a checkbox.

![Checkbox Component Example](https://divin2sy6ce0b.cloudfront.net/docs/checkbox.gif)

### Column

Column is a [View](#view) with `flexDirection: "column"` that follows Bootstrap's grid system. You can define the percentage of the width that should be used in different screen sizes. For example:

```javascript
<Row>
  <Column xs={12} sm={4} md={3} lg={2} style={{ backgroundColor: 'red', height: 25 }} />
  <Column xs={12} sm={4} md={3} lg={2} style={{ backgroundColor: 'green', height: 25 }} />
  <Column xs={12} sm={4} md={3} lg={2} style={{ backgroundColor: 'blue', height: 25 }}/>
  <Column xs={12} sm={4} md={3} lg={2} style={{ backgroundColor: 'purple', height: 25 }} />
  <Column xs={12} sm={4} md={3} lg={2} style={{ backgroundColor: 'yellow', height: 25 }} />
  <Column xs={12} sm={4} md={3} lg={2} style={{ backgroundColor: 'pink', height: 25 }} />
</Row>
```

![Column Component Example](https://divin2sy6ce0b.cloudfront.net/docs/column.gif)

### Confirm

Opens a confirmation popup. This library uses [React Modal](https://github.com/reactjs/react-modal) to render modals for web.

![Confirm Component Example](https://divin2sy6ce0b.cloudfront.net/docs/confirm.gif)

### Container

Container is a useful grid structure for mobile and web. It is a view that for reduced screens (`xs` and `sm`), it uses `95%` of the width. For larger screens (`md` and `lg`) it uses up to `960px`.

### Datepicker

Displays a text input with datepicker functionality. This library uses [React Datepicker](https://www.npmjs.com/package/react-datepicker) and [React Native Datepicker](https://github.com/xgfe/react-native-datepicker) to render datepickers for web and mobile respectively.

![Datepicker Component Example](https://divin2sy6ce0b.cloudfront.net/docs/datepicker-web.gif)
![Datepicker Component Example](https://divin2sy6ce0b.cloudfront.net/docs/datepicker-mobile.gif)

### Draggable

Turns a component into a draggable component. This library uses [React Draggable](https://github.com/mzabriskie/react-draggable) to render draggable components for web.

![Draggable Component Example](https://divin2sy6ce0b.cloudfront.net/docs/draggable.gif)

### Dropzone

Displays a dropzone to upload files. This library uses [React Dropzone](https://react-dropzone.netlify.com/) to render the dropzone containers for web.

![Dropzone Component Example](https://divin2sy6ce0b.cloudfront.net/docs/dropzone-web.gif)
![Dropzone Component Example](https://divin2sy6ce0b.cloudfront.net/docs/dropzone-mobile.gif)

### Helmet

This library exports [React Helmet](https://github.com/nfl/react-helmet). For mobile, Helmet won't do anything.

```javascript
import React from 'react';
import { Row } from 'react-native-web-ui-components';

// You must use the Helmet export by this library to avoid conflicts.
import Helmet, { style } from 'react-native-web-ui-components/Helmet';

const MyComponent = () => (
  <React.Fragment>
    <Helmet>
      <style>
        {`
          [data-class~="MyComponent__Row"] {
            width: calc(100% - 20px);
          }
        `}
      </style>
    </Helmet>
    <Row className="MyComponent__Row" />
  </React.Fragment>
);
```

### HideShowText

Displays summary of a text with a link to show more.

![HideShowText Component Example](https://divin2sy6ce0b.cloudfront.net/docs/hideshowtext.gif)

### Hr

Displays a horizontal rule.

![Hr Component Example](https://divin2sy6ce0b.cloudfront.net/docs/hr.png)

### Icon

Displays an icon. This library uses [React Fontawesome](https://github.com/FortAwesome/react-fontawesome) and [Expo Vector Icons](https://github.com/expo/vector-icons) to render icons for web and mobile respectively.

![Icon Component Example](https://divin2sy6ce0b.cloudfront.net/docs/icon.png)

### IconLink

Displays a link with an icon. This library uses [React Fontawesome](https://github.com/FortAwesome/react-fontawesome) and [Expo Vector Icons](https://github.com/expo/vector-icons) to render icons for web and mobile respectively.

![IconLink Component Example](https://divin2sy6ce0b.cloudfront.net/docs/iconlink.png)

### IconText

Displays a text with an icon. This library uses [React Fontawesome](https://github.com/FortAwesome/react-fontawesome) and [Expo Vector Icons](https://github.com/expo/vector-icons) to render icons for web and mobile respectively.

![IconText Component Example](https://divin2sy6ce0b.cloudfront.net/docs/icontext.png)

### Image

Displays an image. This library uses [react-native-expo-image-cache](https://github.com/wcandillon/react-native-expo-image-cache) and `<amp-img>` to render images for mobile and AMP pages respectively.

![Image Component Example](https://divin2sy6ce0b.cloudfront.net/docs/image.png)

### Link

Displays a link. This library uses [React Router](https://github.com/ReactTraining/react-router#readme) to render links.

![Link Component Example](https://divin2sy6ce0b.cloudfront.net/docs/link.png)

### Loading

Displays a popup with a loading spinner. This library uses [React Modal](https://github.com/reactjs/react-modal) to display modals for web.

![Loading Component Example](https://divin2sy6ce0b.cloudfront.net/docs/loading.gif)

### MainContainer

Displays a `Row` that uses the entire window height.

### NavLink

Displays a link with active/inactive state (useful for menus). This library uses [React Router](https://github.com/ReactTraining/react-router#readme) to render links.

### Popup

Displays a popup.

![Popup Component Example](https://divin2sy6ce0b.cloudfront.net/docs/popup.png)

### Radiobox

Displays a radiobox.

![Radiobox Component Example](https://divin2sy6ce0b.cloudfront.net/docs/radiobox.gif)

### Row

Row is a [View](#view) with `flexDirection: "row"` that follows Bootstrap's grid system. You can define the percentage of the width that should be used in different screen sizes. For example:

```javascript
<Row>
  <Row xs={12} sm={4} md={3} lg={2} style={{ backgroundColor: 'red', height: 25 }} />
  <Row xs={12} sm={4} md={3} lg={2} style={{ backgroundColor: 'green', height: 25 }} />
  <Row xs={12} sm={4} md={3} lg={2} style={{ backgroundColor: 'blue', height: 25 }}/>
  <Row xs={12} sm={4} md={3} lg={2} style={{ backgroundColor: 'purple', height: 25 }} />
  <Row xs={12} sm={4} md={3} lg={2} style={{ backgroundColor: 'yellow', height: 25 }} />
  <Row xs={12} sm={4} md={3} lg={2} style={{ backgroundColor: 'pink', height: 25 }} />
</Row>
```

![Row Component Example](https://divin2sy6ce0b.cloudfront.net/docs/column.gif)

### Screen

Helper to get screen properties.

### ScrollView

See [React Native's ScrollView](https://facebook.github.io/react-native/docs/scrollview). For mobile, the ScrollView exported by this library automatically dismiss the keyboard on scroll.

### Select

Displays a select input.

![Select Component Example](https://divin2sy6ce0b.cloudfront.net/docs/select-web.gif)
![Select Component Example](https://divin2sy6ce0b.cloudfront.net/docs/select-mobile.gif)

### Sidebar

Displays a sidebar. This library uses [React Sidebar](https://github.com/balloob/react-sidebar) and [React Native Side Menu](https://github.com/react-native-community/react-native-side-menu) to render sidebars for web and mobile respectively.

![Sidebar Component Example](https://divin2sy6ce0b.cloudfront.net/docs/sidebar.gif)

### Slider

Displays a slider. This library uses [React Native Slider](https://github.com/react-native-community/react-native-slider) to render sliders for web and mobile.

![Slider Component Example](https://divin2sy6ce0b.cloudfront.net/docs/slider.gif)

### Spinner

Displays a spinner.

![Spinner Component Example](https://divin2sy6ce0b.cloudfront.net/docs/loading.gif)

### StylePropType

Prop type for styles.

```javascript
import { StylePropType } from 'react-native-web-ui-components';

// ...
MyComponent.propTypes = {
  style: StylePropType.isRequired,
};
```

### Switch

See [React Router](https://github.com/ReactTraining/react-router#readme)'s Switch.

### TagInput

Displays a tag input.

![TagInput Component Example](https://divin2sy6ce0b.cloudfront.net/docs/taginput.gif)

### Text

Displays a text. It automatically parses `[tag](url)` into `Link` components.

### TextInput

Displays a text input.

### TimeRangePicker

Displays a time range picker.

![TimeRange Component Example](https://divin2sy6ce0b.cloudfront.net/docs/timerange.gif)

### Title

Displays a title text.

### Tooltip

Displays a tooltip when hovering over a component. This library uses [Tippy.js React](https://github.com/atomiks/tippy.js-react) to render tooltips for web. For mobile, this component is ignored.

![Tooltip Component Example](https://divin2sy6ce0b.cloudfront.net/docs/tooltip.gif)

### View

See [React Native's View](https://facebook.github.io/react-native/docs/view.html).

### WebOnly

Shows a component only for web platforms.

### WebView

See [React Native's WebView](https://facebook.github.io/react-native/docs/webview). For web, this component is ignored.

## Theme

React Native Web UI Components theme can be customized at a globally and for each individual component. Please access [https://github.com/CareLuLu/react-native-web-ui-components](https://github.com/CareLuLu/react-native-web-ui-components) for the complete theme documentation.

### Global

A set of theme attributes can be defined globally and components will use these definitions as necessary.

```javascript
const theme = {
  // All components will receive the prop fontFamily
  '*': {
    fontFamily: {
      regular: 'Lucida Sans',
      bold: 'Lucida Sans Bold',
    },
  },
}
```

### Platform

Themes can be overwritten by platform.

```javascript
const theme = {
  // All components will receive the prop fontFamily
  '*': {
    fontFamily: {
      regular: 'Lucida Sans',
      bold: 'Lucida Sans Bold',
    },
  },
  platform: {
    // When running on web, the fontFamily property will be overwritten by the following.
    web: {
      '*': {
        fontFamily: {
          regular: '"Lucida Sans Unicode","Lucida Grande",Arial,Helvetica,clean,sans-serif',
          bold: '"Lucida Grande", "Lucida Sans Unicode","Lucida Grande",Arial,Helvetica,clean,sans-serif',
        },
      },
    },
  },
}
```

### Component

Themes can be overwritten by component.

```javascript
const theme = {
  // All components will receive the prop fontFamily
  '*': {
    fontFamily: {
      regular: 'Lucida Sans',
      bold: 'Lucida Sans Bold',
    },
  },
  Title: {
    // Title will receive the following fontFamily.
    fontFamily: {
      regular: 'Arial',
      bold: 'Arial Bold',
    },
  },
}
```

## License

[MIT](https://moroshko.mit-license.org/)
