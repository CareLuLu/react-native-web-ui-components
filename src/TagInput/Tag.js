import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { withTheme } from '../Theme';
import StylePropType from '../StylePropType';
import Text from '../Text';

const styles = StyleSheet.create({
  tag: {
    color: '#FFFFFF',
    height: 34,
    marginRight: 5,
    marginTop: 2,
    marginBottom: 2,
    lineHeight: 34,
    paddingLeft: 5,
    paddingRight: 5,
  },
  first: {
    marginLeft: -9,
  },
});

const Tag = ({
  tag,
  style,
  index,
  onDelete,
  getItemValue,
  themeInputStyle,
}) => {
  const onPress = useCallback(() => onDelete(index), [onDelete, index]);

  const { color } = StyleSheet.flatten(themeInputStyle.selected);

  return (
    <Text
      auto
      onPress={onPress}
      style={[
        styles.tag,
        themeInputStyle.border,
        index === 0 ? styles.first : null,
        {
          width: undefined,
          borderColor: color,
          backgroundColor: color,
        },
        style,
      ]}
    >
      {`${getItemValue(tag)} ×`}
    </Text>
  );
};

Tag.propTypes = {
  themeInputStyle: PropTypes.shape().isRequired,
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.shape(),
    PropTypes.number,
  ]).isRequired,
  index: PropTypes.number.isRequired,
  getItemValue: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  style: StylePropType,
};

Tag.defaultProps = {
  style: null,
};

export default withTheme('TagInputTag')(Tag);
