import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { StyleSheet } from 'react-native';
import StylePropType from '../StylePropType';
import { Helmet, style } from '../Helmet';
import Icon from '../Icon';
import Text from '../Text';
import View from '../View';
import TouchableWithoutFeedback from '../TouchableWithoutFeedback';

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
    paddingLeft: 10,
    textAlignVertical: 'center',
  },
});

const BaseCheckbox = ({
  onBlur,
  onFocus,
  text,
  type,
  themeTextStyle,
  themeInputStyle,
  disabled,
  readonly,
  onPress,
  value,
  checked,
  iconChecked,
  iconUnchecked,
  styleChecked,
  styleUnchecked,
  styleCheckedText,
  styleUncheckedText,
  iconUncheckedContent,
  ...props
}) => {
  const press = () => {
    if (!disabled && !readonly) {
      onPress(checked, value);
    }
  };

  const className = `${type} ${!checked ? `${type}__unchecked` : ''}`;
  const viewStyle = [styles.container, themeInputStyle.opacity, props.style]; // eslint-disable-line
  const iconName = checked ? iconChecked : iconUnchecked;
  const iconStyle = [
    styles.icon,
    checked
      ? [themeInputStyle.selected, styleChecked]
      : [themeInputStyle.unselected, styleUnchecked],
  ];
  const textStyle = [
    styles.text,
    checked
      ? [themeInputStyle.selected, styleCheckedText]
      : [themeTextStyle.text, styleUncheckedText],
  ];

  return (
    <React.Fragment>
      <Helmet>
        <style>
          {`
            [data-class~="${type}"] {
              cursor: pointer;
            }
            ${!disabled && !readonly ? `
              [data-class~="${type}__unchecked"]:hover .fa:before {
                content: "${iconUncheckedContent}";
              }
            ` : ''}
          `}
        </style>
      </Helmet>
      <TouchableWithoutFeedback
        className={className}
        onPress={press}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <View style={viewStyle}>
          <Icon name={iconName} style={iconStyle} />
          {text !== null ? (
            <Text auto style={textStyle}>
              {text}
            </Text>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    </React.Fragment>
  );
};

BaseCheckbox.propTypes = {
  themeTextStyle: PropTypes.shape().isRequired,
  themeInputStyle: PropTypes.shape().isRequired,
  text: PropTypes.string,
  value: PropTypes.any, // eslint-disable-line
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  onPress: PropTypes.func,
  style: StylePropType,
  styleChecked: StylePropType,
  styleUnchecked: StylePropType,
  styleCheckedText: StylePropType,
  styleUncheckedText: StylePropType,
  iconChecked: PropTypes.string,
  iconUnchecked: PropTypes.string,
  iconUncheckedContent: PropTypes.string,
  type: PropTypes.string,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
};

BaseCheckbox.defaultProps = {
  text: null,
  value: true,
  checked: false,
  disabled: false,
  readonly: false,
  onPress: noop,
  style: styles.empty,
  styleChecked: styles.empty,
  styleUnchecked: styles.empty,
  styleCheckedText: styles.empty,
  styleUncheckedText: styles.empty,
  iconChecked: 'check-square',
  iconUnchecked: 'square',
  iconUncheckedContent: '\\f14a',
  type: 'Checkbox',
  onBlur: noop,
  onFocus: noop,
};

export default BaseCheckbox;
