import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import Text from '../Text';
import Bold from '../Bold';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import { isEmpty, escapeRegExp } from '../utils';

const styles = StyleSheet.create({
  defaults: {
    padding: 5,
    minHeight: 30,
    color: '#FFFFFF',
  },
});

const Item = ({
  item,
  index,
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
  const onItemPress = useCallback(() => onPress(item, index), [item, index, onPress]);

  const textStyle = [styles.defaults, themeTextStyle.text, style];
  if (active) {
    textStyle.push([{
      color: '#FFFFFF',
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
    text.replace(regex, (match, i) => {
      components.push(text.substring(lastIndex, i));
      components.push(<Bold style={{ color: css.color }} key={`${i}__${match}`}>{match}</Bold>);
      lastIndex = i + match.length;
    });
    components.push(text.substring(lastIndex));
  }
  return (
    <Text
      onPress={onItemPress}
      style={textStyle}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
    >
      {components}
    </Text>
  );
};

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
