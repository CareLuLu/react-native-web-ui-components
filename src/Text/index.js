import React from 'react';
import PropTypes from 'prop-types';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import NativeText from './NativeText';
import { withTheme } from '../Theme';
import Link from '../Link';

const LINEBREAK = /\\n/g;
const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

const parse = (text, theme) => {
  const parsedText = text.replace(LINEBREAK, '\n');
  if (LINK.test(parsedText)) {
    const components = [];
    let lastIndex = 0;
    parsedText.replace(LINK, (match, anchor, to, index) => {
      components.push(parsedText.substring(lastIndex, index));
      components.push(<Link key={to} type={theme.colors.primary} to={to}>{anchor}</Link>);
      lastIndex = index + match.length;
    });

    components.push(parsedText.substring(lastIndex));
    return components;
  }
  return parsedText;
};

const normalize = (children, theme) => {
  if (!children) {
    return children;
  }
  if (isString(children)) {
    return parse(children, theme);
  }
  if (!isArray(children)) {
    return children;
  }
  return children.map((child) => {
    if (!isString(child)) {
      return child;
    }
    return parse(child, theme);
  });
};

const Text = ({ theme, children, ...props }) => (
  <NativeText {...props}>
    {normalize(children, theme)}
  </NativeText>
);

Text.propTypes = {
  theme: PropTypes.shape().isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]),
};

Text.defaultProps = {
  children: null,
};

export default withTheme('Text')(Text);
