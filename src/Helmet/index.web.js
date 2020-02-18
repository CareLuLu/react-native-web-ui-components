import React from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import isArray from 'lodash/isArray';
import { Helmet as ReactHelmet } from 'react-helmet';
import { withRouter } from 'react-router';

/* eslint no-script-url: 0 */
/* eslint no-param-reassign: 0 */

const parseTags = (children, tags) => {
  let script;
  const list = isArray(children) ? children : [children];
  list.forEach((tag) => {
    if (isArray(tag)) {
      parseTags(tag, tags);
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
          tags.link.push(pick(tag.props, 'rel', 'href', 'type', 'as', 'crossorigin'));
          break;
        case 'script':
          script = omit(tag.props, 'children');
          if (tag.props.type === 'application/ld+json') {
            script.innerHTML = tag.props.children;
          }
          tags.script.push(script);
          break;
        default: break;
      }
    }
  });
};

export const Helmet = withRouter(({ children, history }) => {
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
      key={history.location.pathname}
    />
  );
});

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
