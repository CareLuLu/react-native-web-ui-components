import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import Text from '../Text';
import Bold from '../Bold';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import { isEmpty, escapeRegExp } from '../utils';
import createDomStyle from '../createDomStyle';
import { Helmet, style } from '../Helmet';
import TouchableOpacity from '../TouchableOpacity';

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
  autocompleteId,
  activeStyle,
  themeTextStyle,
  themeInputStyle,
  numberOfLines,
  highlightMatches,
  style: currentStyle,
}) => {
  const onItemPress = () => onPress(item, index);

  let textStyle = [styles.defaults, themeTextStyle.text, currentStyle];
  const activeTextStyle = [
    styles.defaults,
    themeTextStyle.text,
    currentStyle,
    {
      color: '#FFFFFF',
      backgroundColor: StyleSheet.flatten(themeInputStyle.selected).color,
    },
    activeStyle,
  ];
  if (active) {
    textStyle = activeTextStyle;
  }
  const components = [];
  if (isEmpty(value) || !highlightMatches) {
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
    <>
      <Helmet>
        <style>
          {`
            [data-class~="${autocompleteId}"] [data-class~="Autocomplete__Item-${index}"]:hover {
              ${createDomStyle(activeTextStyle)}
            }
          `}
        </style>
      </Helmet>
      <TouchableOpacity onPress={onItemPress}>
        <Text
          className={`Autocomplete__Item Autocomplete__Item-${index} ${active ? 'Autocomplete__Item-active' : ''}`}
          style={textStyle}
          numberOfLines={numberOfLines}
          ellipsizeMode="tail"
        >
          {components}
        </Text>
      </TouchableOpacity>
    </>
  );
};

Item.propTypes = {
  highlightMatches: PropTypes.bool.isRequired,
  autocompleteId: PropTypes.string.isRequired,
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
