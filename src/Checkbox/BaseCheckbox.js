import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import withHandlers from 'recompact/withHandlers';
import withProps from 'recompact/withProps';
import compose from 'recompact/compose';
import StylePropType from '../StylePropType';
import { Helmet, style } from '../Helmet';
import Icon from '../Icon';
import Text from '../Text';
import View from '../View';

const styles = StyleSheet.create({
  empty: {},
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 23,
    lineHeight: 23,
  },
  text: {
    fontSize: 13,
    lineHeight: 23,
    textAlignVertical: 'center',
  },
});

const BaseCheckbox = compose(
  withProps(({
    theme,
    checked,
    disabled,
    iconChecked,
    iconUnchecked,
    styleChecked,
    styleUnchecked,
    styleCheckedText,
    styleUncheckedText,
    style, // eslint-disable-line
  }) => {
    const themeStyles = theme.input[disabled ? 'disabled' : 'regular'];
    return {
      className: `Checkbox ${!checked ? 'Checkbox__unchecked' : ''}`,
      viewStyle: [styles.container, style],
      iconName: checked ? iconChecked : iconUnchecked,
      iconStyle: [
        styles.icon,
        checked
          ? [themeStyles.selected, styleChecked]
          : [themeStyles.unselected, styleUnchecked],
      ],
      textStyle: [
        styles.text,
        checked
          ? [themeStyles.selected, styleCheckedText]
          : [themeStyles.unselected, styleUncheckedText],
      ],
    };
  }),
  withHandlers({
    press: ({ checked, value, onPress }) => () => onPress(checked, value),
  }),
)(({
  text,
  className,
  viewStyle,
  iconName,
  iconStyle,
  textStyle,
  iconUncheckedContent,
  press,
}) => (
  <React.Fragment>
    <Helmet>
      <style>
        {`
          .Checkbox {
            cursor: pointer;
          }
          .Checkbox__unchecked:hover .fa:before {
            content: ${iconUncheckedContent};
          }
        `}
      </style>
    </Helmet>
    <TouchableWithoutFeedback className={className} onPress={press}>
      <View style={viewStyle}>
        <Icon name={iconName} style={iconStyle} />
        {text !== null ? (
          <Text auto style={textStyle}>
            &nbsp;&nbsp;
            {text}
          </Text>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  </React.Fragment>
));

BaseCheckbox.propTypes = {
  theme: PropTypes.shape().isRequired,
  text: PropTypes.string,
  value: PropTypes.any, // eslint-disable-line
  checked: PropTypes.bool,
  onPress: PropTypes.func,
  style: StylePropType,
  styleChecked: StylePropType,
  styleUnchecked: StylePropType,
  styleCheckedText: StylePropType,
  styleUncheckedText: StylePropType,
  iconChecked: PropTypes.string,
  iconUnchecked: PropTypes.string,
  iconUncheckedContent: PropTypes.string,
};

BaseCheckbox.defaultProps = {
  text: null,
  value: true,
  checked: false,
  onPress: noop,
  style: styles.empty,
  styleChecked: styles.empty,
  styleUnchecked: styles.empty,
  styleCheckedText: styles.empty,
  styleUncheckedText: styles.empty,
  iconChecked: 'check-square',
  iconUnchecked: 'square',
  iconUncheckedContent: '\\f14a',
};

export default BaseCheckbox;
