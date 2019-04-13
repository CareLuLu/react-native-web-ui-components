import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from 'react-native';
import WebFontAwesome from 'react-fontawesome';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import { Helmet, link } from '../Helmet';

const styles = StyleSheet.create({
  empty: {},
  defaults: {},
});

const Icon = ({ name, style, className }) => (
  <React.Fragment>
    <Helmet>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
      />
    </Helmet>
    <Text className={className} style={[styles.defaults, style]}>
      <WebFontAwesome name={name} />
    </Text>
  </React.Fragment>
);

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  style: StylePropType,
  className: PropTypes.string,
};

Icon.defaultProps = {
  style: styles.empty,
  className: '',
};

export default withTheme('Icon')(Icon);
