import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';

const Theme = React.createContext('theme');

const defaults = {
  resource: uri => uri,
  '*': {
    fontFamily: {
      regular: 'Lucida Sans',
      bold: 'Lucida Sans Bold',
    },
  },
  Link: {
    basepath: 'localhost',
  },
  input: {
    regular: StyleSheet.create({
      background: { backgroundColor: '#FFFFFF' },
      border: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#D3D6D6',
        borderRadius: 2,
      },
      text: { color: '#545454' },
      placeholder: { color: '#D3D6D6' },
      opacity: { opacity: 1 },
      selected: { color: '#49AFC3' },
      unselected: { color: '#BDC3C7' },
    }),
    disabled: StyleSheet.create({
      background: { backgroundColor: '#F4F6F6' },
      border: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#D5DBDB',
        borderRadius: 2,
      },
      text: { color: '#545454' },
      placeholder: { color: '#D3D6D6' },
      opacity: { opacity: 0.7 },
      selected: { color: '#49AFC3' },
      unselected: { color: '#BDC3C7' },
    }),
    focused: StyleSheet.create({
      background: { backgroundColor: '#FFFFFF' },
      border: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#EE2D68',
        borderRadius: 2,
      },
      text: { color: '#545454' },
      placeholder: { color: '#D3D6D6' },
      opacity: { opacity: 1 },
      selected: { color: '#49AFC3' },
      unselected: { color: '#BDC3C7' },
    }),
    error: StyleSheet.create({
      background: { backgroundColor: '#FFFFFF' },
      border: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#EE2D68',
        borderRadius: 2,
      },
      text: { color: '#545454' },
      placeholder: { color: '#EE2D68' },
      opacity: { opacity: 1 },
      selected: { color: '#49AFC3' },
      unselected: { color: '#BDC3C7' },
    }),
  },
  colors: {
    text: 'gray',
    primary: 'pink',
    pink: StyleSheet.create({
      background: { backgroundColor: '#F15786' },
      border: { borderColor: '#BF4E71' },
      text: { color: '#F15786' },
    }),
    yellow: StyleSheet.create({
      background: { backgroundColor: '#FEB715' },
      border: { borderColor: '#D99D14' },
      text: { color: '#FEB715' },
    }),
    gray: StyleSheet.create({
      background: { backgroundColor: '#D4D4D4' },
      border: { borderColor: '#BFBFBF' },
      text: { color: '#545454' },
    }),
    lightGray: StyleSheet.create({
      background: { backgroundColor: '#BFBFBF' },
      border: { borderColor: '#BFBFBF' },
      text: { color: '#BFBFBF' },
    }),
    white: StyleSheet.create({
      background: { backgroundColor: '#FFFFFF' },
      border: { borderColor: '#BFBFBF' },
      text: { color: '#FFFFFF' },
    }),
    blue: StyleSheet.create({
      background: { backgroundColor: '#BFF1F5' },
      border: { borderColor: '#BFBFBF' },
      text: { color: '#1F497D' },
    }),
    teal: StyleSheet.create({
      background: { backgroundColor: '#23AAAA' },
      border: { borderColor: '#23AAAA' },
      text: { color: '#23AAAA' },
    }),
    black: StyleSheet.create({
      background: { backgroundColor: '#000000' },
      border: { borderColor: '#000000' },
      text: { color: '#000000' },
    }),
  },
  platform: {
    web: {
      '*': {
        fontFamily: {
          regular: '"Lucida Sans Unicode","Lucida Grande",Arial,Helvetica,clean,sans-serif',
          bold: '"Lucida Grande", "Lucida Sans Unicode","Lucida Grande",Arial,Helvetica,clean,sans-serif',
        },
      },
    },
  },
};

const getInputStyle = (theme, {
  disabled,
  readonly,
  hasError,
  autoFocus,
}) => {
  let label = 'regular';
  if (disabled || readonly) {
    label = 'disabled';
  } else if (autoFocus) {
    label = 'focused';
  } if (hasError) {
    label = 'hasError';
  }
  return theme.input[label];
};

export class Provider extends React.Component {
  static propTypes = {
    value: PropTypes.shape(),
  };

  static defaultProps = {
    value: {},
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.value) {
      return merge({}, defaults, nextProps.value);
    }
    return null;
  }

  constructor(props) {
    super(props);
    const { value } = props;
    this.state = merge({}, defaults, value);
  }

  render() {
    const { value } = this.state;
    return <Theme.Provider {...this.props} value={value} />;
  }
}

export const { Consumer } = Theme;

export const withTheme = type => Component => ({ style, ...props }) => ( // eslint-disable-line
  <Theme.Consumer>
    {theme => (
      <Component
        {...(theme['*'] || {})}
        {...((theme.platform[Platform.OS] && theme.platform[Platform.OS]['*']) || {})}
        {...(theme[type] || {})}
        {...((theme.platform[Platform.OS] && theme.platform[Platform.OS][type]) || {})}
        {...props}
        style={[theme[type] && theme[type].style, style]}
        theme={theme}
        themeInputStyle={getInputStyle(theme, props)}
      />
    )}
  </Theme.Consumer>
);

export default {
  withTheme,
  Provider,
  Consumer,
};
