import React from 'react';
import PropTypes from 'prop-types';
import { Parser } from 'html-to-react';

const htmlToReactParser = new Parser();

const WebView = ({ source }) => (
  <React.Fragment>
    {htmlToReactParser.parse(source.html)}
  </React.Fragment>
);

WebView.propTypes = {
  source: PropTypes.shape().isRequired,
};

export default WebView;
