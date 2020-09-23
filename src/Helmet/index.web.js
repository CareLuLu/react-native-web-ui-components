import React from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import { Helmet as ReactHelmet } from 'react-helmet';
import { useHistory } from '../History';

/* eslint no-script-url: 0 */
/* eslint no-param-reassign: 0 */

const parseTags = (children, tags) => {
  let script;
  const list = isArray(children) ? children : [children];
  list.forEach((tag) => {
    if (tag !== null && tag !== undefined) {
      if (isArray(tag)) {
        parseTags(tag, tags);
      } else if (tag.type === React.Fragment) {
        parseTags(tag.props.children, tags);
      } else {
        switch (tag.type) {
          case 'title':
            tags.title = tag.props.children || '';
            break;
          case 'style':
            tags.style.push(Object.assign({
              cssText: tag.props.children,
              'amp-custom': '',
            }));
            break;
          case 'meta':
            tags.meta.push(pick(tag.props, 'name', 'property', 'content'));
            break;
          case 'link':
            tags.link.push(pick(tag.props, 'rel', 'href', 'type', 'as', 'crossorigin', 'media'));
            break;
          case 'script':
            script = omit(tag.props, 'children');
            if (
              tag.props.type === 'application/ld+json'
              || (isString(tag.props.children) && tag.props.children)
            ) {
              script.innerHTML = tag.props.children;
            }
            tags.script.push(script);
            break;
          default: break;
        }
      }
    }
  });
};

export const Helmet = ({ children }) => {
  const history = useHistory();

  const key = typeof history.location.pathname === 'function'
    ? history.location.pathname()
    : history.location.pathname;

  const tags = {
    title: undefined,
    link: [],
    meta: [],
    style: [],
    script: [],
  };
  if (children) {
    parseTags(children, tags);
  }
  if (tags.title === undefined) {
    delete tags.title;
  }
  return (
    <ReactHelmet
      {...tags}
      key={key}
    />
  );
};

Helmet.propTypes = {
  children: PropTypes.node,
};

Helmet.defaultProps = {
  children: null,
};

export const link = props => <link {...props} />;
export const meta = props => <meta {...props} />;
export const title = props => <title {...props} />;
export const style = props => <style amp-custom="javascript:undefined" {...props} />;
export const script = props => <script {...props} />;

export default {
  Helmet,
  link,
  meta,
  title,
  style,
  script,
};
