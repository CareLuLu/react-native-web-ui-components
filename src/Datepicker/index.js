import React from 'react';
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

const DATE_FORMAT = 'MM/DD/YYYY';

const FORMAT = [
  'YYYY-MM-DD[T]HH:mm:ssZ',
  'YYYY-MM-DD[T]HH:mm:ss.SSSZ',
  'MM/DD/YYYY',
  'MM/D/YYYY',
  'M/D/YYYY',
  'M/DD/YYYY',
  'MM/DD/YYYY h:mma',
  'MM/D/YYYY h:mma',
  'M/D/YYYY h:mma',
  'M/DD/YYYY h:mma',
  'h:mma',
];

const icon = { uri: 'https://divin2sy6ce0b.cloudfront.net/images/calendar-icon.png' };

const useOnChange = ({ format, onDateChange, excludeDates }) => {
  const onChange = (dateString) => {
    if (excludeDates) {
      const date = moment(dateString, format).format(DATE_FORMAT);
      const notValid = excludeDates.filter(d => (moment(d).format(DATE_FORMAT) === date)).length;
      if (notValid) {
        setTimeout(() => Alert.alert('This date cannot be selected. Please choose another one.'), 500);
        return onDateChange('');
      }
    }
    return onDateChange(dateString);
  };

  return onChange;
};

const Datepicker = ({
  mode,
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
  format,
  ...props
}) => {
  let currentFormat = format;
  if (!currentFormat) {
    switch (mode) {
      case 'time': currentFormat = 'h:mma'; break;
      case 'datetime': currentFormat = 'MM/DD/YYYY h:mma'; break;
      default: currentFormat = 'MM/DD/YYYY';
    }
  }

  const onChange = useOnChange({
    onDateChange,
    excludeDates,
    format: currentFormat,
  });
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
      fontFamily.regular !== 'system font' ? { fontFamily: fontFamily.regular } : {},
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
    format: currentFormat,
    disabled: disabled || readonly,
    onDateChange: onChange,
    confirmBtnText: 'Confirm',
    cancelBtnText: 'Cancel',
    placeholder: placeholder === '' ? ' ' : placeholder,
    iconSource: icon,
    customStyles: mergedStyles,
    style: [styles.datepicker, auto ? null : styles.fullWidth, style],
  };
  if (minDate) {
    datepickerProps.minDate = moment(minDate, FORMAT.concat([currentFormat])).toDate();
  }
  if (maxDate) {
    datepickerProps.maxDate = moment(maxDate, FORMAT.concat([currentFormat])).toDate();
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
  mode: PropTypes.oneOf(['date', 'datetime', 'time']),
  format: PropTypes.string,
  is24Hour: PropTypes.bool,
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
  mode: 'date',
  format: null,
  is24Hour: false,
};

export default withTheme('Datepicker')(Datepicker);
