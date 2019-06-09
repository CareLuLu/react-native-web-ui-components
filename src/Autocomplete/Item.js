import React from 'react';
import PropTypes from 'prop-types';
import { withHandlers, compose } from 'recompact';
import { StyleSheet } from 'react-native';
import Text from '../Text';
import Bold from '../Bold';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import { isEmpty, escapeRegExp } from '../utils';

const styles = StyleSheet.create({
  defaults: {
    padding: 5,
    height: 30,
    color: '#FFFFFF',
  },
});

const Item = compose(
  withHandlers({
    onPress: ({ item, index, onPress }) => () => onPress(item, index),
  }),
)(({
  text,
  onPress,
  value,
  active,
  style,
  activeStyle,
  themeTextStyle,
  themeInputStyle,
  numberOfLines,
}) => {
  const textStyle = [styles.defaults, themeTextStyle.text, style];
  if (active) {
    textStyle.push([{
      backgroundColor: StyleSheet.flatten(themeInputStyle.selected).color,
    }, activeStyle]);
  }
  const components = [];
  if (isEmpty(value)) {
    components.push(text);
  } else {
    const css = StyleSheet.flatten(textStyle);
    const regex = new RegExp(escapeRegExp(value), 'i');
    let lastIndex = 0;
    text.replace(regex, (match, index) => {
      components.push(text.substring(lastIndex, index));
      components.push(<Bold style={{ color: css.color }} key={`${index}__${match}`}>{match}</Bold>);
      lastIndex = index + match.length;
    });
    if (lastIndex > 0) {
      components.push(text.substring(lastIndex));
    }
  }
  return (
    <Text onPress={onPress} style={textStyle} numberOfLines={numberOfLines} ellipsizeMode="tail">
      {components}
    </Text>
  );
});

Item.propTypes = {
  themeTextStyle: PropTypes.shape().isRequired,
  themeInputStyle: PropTypes.shape().isRequired,
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  item: PropTypes.any, // eslint-disable-line
  value: PropTypes.any, // eslint-disable-line
  style: StylePropType,
  activeStyle: StylePropType,
  numberOfLines: PropTypes.number,
};

Item.defaultProps = {
  item: undefined,
  value: undefined,
  style: null,
  activeStyle: null,
  numberOfLines: 1,
};

export default withTheme('AutocompleteItem')(Item);
