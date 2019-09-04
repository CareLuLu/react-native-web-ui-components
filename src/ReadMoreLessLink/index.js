import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import noop from 'lodash/noop';
import { withTheme } from '../Theme';
import stylePropType from '../StylePropType';
import Text from '../Text/NativeText';

const styles = StyleSheet.create({
  empty: {},
  defaults: {},
});

const ReadMoreLessLink = ({
  auto,
  type,
  style,
  showLabel,
  hideLabel,
  visible,
  onChange,
}) => {
  const [opacity, setOpacity] = useState(1);

  const setOpacity50 = () => setOpacity(0.5);

  useEffect(() => {
    if (opacity === 0.5) {
      setTimeout(() => setOpacity(0.25));
    }
    if (opacity === 0.25) {
      setTimeout(() => {
        setOpacity(1);
        setTimeout(() => onChange(!visible));
      }, 100);
    }
  }, [opacity]); // eslint-disable-line

  return (
    <Text
      type={type}
      auto={auto}
      onPress={opacity === 1 ? setOpacity50 : noop}
      style={[styles.defaults, style, { opacity }]}
    >
      {visible ? hideLabel : showLabel}
    </Text>
  );
};

ReadMoreLessLink.propTypes = {
  auto: PropTypes.bool,
  type: PropTypes.string,
  style: stylePropType,
  onChange: PropTypes.func,
  showLabel: PropTypes.string,
  hideLabel: PropTypes.string,
  visible: PropTypes.bool,
};

ReadMoreLessLink.defaultProps = {
  auto: false,
  style: styles.empty,
  type: 'gray',
  onChange: noop,
  showLabel: 'Read more...',
  hideLabel: 'Read less...',
  visible: true,
};

export default withTheme('ReadMoreLessLink')(ReadMoreLessLink);
