import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Alert, StyleSheet } from 'react-native';
import noop from 'lodash/noop';
import moment from 'moment';
import RNDatepicker from 'react-native-datepicker';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';

const styles = StyleSheet.create({
  datepicker: {
    padding: 0,
    margin: 0,
    height: undefined,
  },
  input: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    height: 40,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  icon: {
    position: 'absolute',
    top: 12,
    right: 5,
    width: 16,
    height: 16,
  },
  text: {
    position: 'absolute',
    left: 12,
    top: 10,
    fontSize: 13,
    textAlign: 'left',
  },
  placeholder: {
    position: 'absolute',
    left: 10,
    top: 10,
    fontSize: 13,
    textAlign: 'left',
  },
  confirmText: {},
  fullWidth: {
    width: '100%',
  },
});

const FORMAT = 'MM/DD/YYYY';

const icon = { uri: 'https://divin2sy6ce0b.cloudfront.net/images/calendar-icon.png' };

const useOnChange = ({ onDateChange, excludeDates }) => {
  const onChange = useCallback((dateString) => {
    if (excludeDates) {
      const date = moment(dateString, FORMAT).format(FORMAT);
      const notValid = excludeDates.filter(d => (moment(d).format(FORMAT) === date)).length;
      if (notValid) {
        setTimeout(() => Alert.alert('This date cannot be selected. Please choose another one.'), 500);
        return onDateChange('');
      }
    }
    return onDateChange(dateString);
  }, [onDateChange, excludeDates]);

  return onChange;
};

const Datepicker = ({
  fontFamily,
  themeTextStyle,
  themeInputStyle,
  style,
  auto,
  customStyles,
  placeholder,
  minDate,
  maxDate,
  disabled,
  readonly,
  onDateChange,
  excludeDates,
  ...props
}) => {
  const onChange = useOnChange({ onDateChange, excludeDates });
  const mergedStyles = {
    dateInput: [
      styles.input,
      themeInputStyle.background,
      themeInputStyle.border,
      themeInputStyle.opacity,
      customStyles.input,
    ],
    dateIcon: [styles.icon, customStyles.icon],
    dateText: [
      styles.text,
      themeInputStyle.text,
      { fontFamily: fontFamily.regular },
      customStyles.text,
    ],
    placeholderText: [
      styles.placeholder,
      themeInputStyle.placeholder,
      customStyles.placeholder,
    ],
    dateTouch: [styles.datepicker, customStyles.datepicker],
    dateTouchBody: [styles.datepicker, customStyles.datepicker],
    btnTextConfirm: [styles.confirmText, themeTextStyle.text, customStyles.confirmText],
  };
  const datepickerProps = {
    ...props,
    disabled: disabled || readonly,
    format: FORMAT,
    onDateChange: onChange,
    confirmBtnText: 'Confirm',
    cancelBtnText: 'Cancel',
    placeholder: placeholder === '' ? ' ' : placeholder,
    mode: 'date',
    iconSource: icon,
    customStyles: mergedStyles,
    style: [styles.datepicker, auto ? null : styles.fullWidth, style],
  };
  if (minDate) {
    datepickerProps.minDate = moment(minDate, FORMAT).format('MM/DD/YYYY');
  }
  if (maxDate) {
    datepickerProps.maxDate = moment(maxDate, FORMAT).format('MM/DD/YYYY');
  }
  return <RNDatepicker {...datepickerProps} />;
};

Datepicker.propTypes = {
  fontFamily: PropTypes.shape().isRequired,
  themeTextStyle: PropTypes.shape().isRequired,
  themeInputStyle: PropTypes.shape().isRequired,
  auto: PropTypes.bool,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  style: StylePropType,
  customStyles: StylePropType,
  placeholder: PropTypes.string,
  onDateChange: PropTypes.func,
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  excludeDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
};

Datepicker.defaultProps = {
  auto: false,
  disabled: false,
  readonly: false,
  style: null,
  customStyles: {},
  placeholder: ' ',
  onDateChange: noop,
  excludeDates: [],
  minDate: null,
  maxDate: null,
};

export default withTheme('Datepicker')(Datepicker);
