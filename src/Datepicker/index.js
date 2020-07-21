import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  Alert,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import noop from 'lodash/noop';
import moment from 'moment';
import { withTheme } from '../Theme';
import Link from '../Link';
import View from '../View';
import Row from '../Row';
import Column from '../Column';
import TextInput from '../TextInput';
import TouchableOpacity from '../TouchableOpacity';

const styles = StyleSheet.create({
  defaults: {
    minWidth: 100,
    height: 40,
  },
  fullWidth: {
    width: '100%',
  },
  icon: {
    position: 'absolute',
    top: 12,
    right: 10,
    width: 16,
    height: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(100, 100, 100, 0.7)',
  },
  datepicker: {
    backgroundColor: '#FFFFFF',
  },
  cancelColumn: {
    paddingLeft: 15,
  },
  confirmColumn: {
    paddingRight: 15,
    alignItems: 'flex-end',
  },
  link: {
    fontSize: 16,
    paddingTop: 10,
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

const getFormat = (format, mode) => {
  let currentFormat = format;
  if (!currentFormat) {
    switch (mode) {
      case 'time': currentFormat = 'h:mma'; break;
      case 'datetime': currentFormat = 'MM/DD/YYYY h:mma'; break;
      default: currentFormat = 'MM/DD/YYYY';
    }
  }
  return currentFormat;
};

const parseDate = (value, format) => {
  if (!value) {
    return null;
  }
  if (typeof value === 'string') {
    return moment(value, FORMAT.concat([format])).toDate();
  }
  return value;
};

const toString = (date, format) => {
  if (!date) {
    return '';
  }
  return moment(date).format(format);
};

const isSame = (date1, date2, format) => {
  if (!date1 && !date2) {
    return true;
  }
  return moment(date1).format(format) === moment(date2).format(format);
};

const useSetDate = ({ format, onDateChange, excludeDates }) => {
  const setDate = (newValue) => {
    if (!newValue) {
      return onDateChange('');
    }
    const value = moment(newValue);
    if (excludeDates) {
      const date = value.format(DATE_FORMAT);

      const notValid = excludeDates
        .filter(d => (moment(parseDate(d, format)).format(DATE_FORMAT) === date))
        .length;

      if (notValid) {
        setTimeout(() => Alert.alert('This date cannot be selected. Please choose another one.'), 500);
        return onDateChange('');
      }
    }
    return onDateChange(value.format(format));
  };

  return setDate;
};

const Datepicker = ({
  date: value,
  onDateChange,
  mode,
  is24Hour,
  format,
  minDate,
  maxDate,
  excludeDates,
  animationType,
  supportedOrientations,
  ...props
}) => {
  const { auto } = props;

  const currentFormat = getFormat(format, mode);
  const parsedValue = parseDate(value, currentFormat);

  const valueProp = useRef(parsedValue);
  const date = useRef(parsedValue || new Date());
  const modal = useRef();

  const [step, setStep] = useState(null);

  const setDate = useSetDate({
    onDateChange,
    excludeDates,
    format: currentFormat,
  });

  const cancel = () => setStep(null);
  const clear = () => {
    setStep(null);
    setDate('');
  };
  const done = () => {
    setStep(null);
    setDate(date.current);
  };

  const onPress = () => {
    if (step) {
      done();
    } else {
      setStep('date');
    }
  };

  const onChange = (event, selected) => {
    date.current = selected || null;
    if (Platform.OS === 'android') {
      if (mode === 'datetime' && step === 'date') {
        setStep('transition');
      } else {
        done();
      }
    }
  };

  const onModalRef = (ref) => {
    modal.current = ref;
  };

  const params = {};
  if (minDate) {
    params.minimumDate = moment(minDate, FORMAT.concat([currentFormat])).toDate();
  }
  if (maxDate) {
    params.maximumDate = moment(maxDate, FORMAT.concat([currentFormat])).toDate();
  }

  useEffect(() => {
    if (!isSame(valueProp.current, parsedValue, currentFormat)) {
      date.current = parsedValue || new Date();
      valueProp.current = parsedValue;
      setTimeout(() => setStep(null));
    } else if (step === 'transition') {
      setTimeout(() => setStep('time'));
    }
  });

  return (
    <>
      <TouchableOpacity onPress={onPress} style={auto ? null : styles.fullWidth}>
        <View style={auto ? null : styles.fullWidth}>
          <TextInput
            {...props}
            editable={false}
            value={toString(parsedValue, format)}
            onPress={onPress}
            pointerEvents="none"
          />
          <Image source={icon} style={styles.icon} />
        </View>
      </TouchableOpacity>
      {Platform.OS !== 'android' ? (
        <Modal
          transparent
          ref={onModalRef}
          supportedOrientations={supportedOrientations}
          visible={step !== null && step !== 'transition'}
          onRequestClose={cancel}
          animationType={animationType}
        >
          <TouchableWithoutFeedback onPress={cancel}>
            <View style={styles.overlay}>
              <Row style={styles.datepicker}>
                <Row>
                  <Column xs={6} style={styles.cancelColumn}>
                    <Link auto onPress={clear} style={styles.link}>
                      Clear
                    </Link>
                  </Column>
                  <Column xs={6} style={styles.confirmColumn}>
                    <Link auto onPress={done} style={styles.link}>
                      Confirm
                    </Link>
                  </Column>
                </Row>
                <DateTimePicker
                  {...params}
                  style={styles.fullWidth}
                  value={date.current}
                  is24Hour={is24Hour}
                  mode={mode !== 'datetime' || Platform.OS !== 'android' ? mode : step}
                  onChange={onChange}
                  neutralButtonLabel="Clear"
                />
              </Row>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      ) : null}
      {Platform.OS === 'android' && step && step !== 'transition' ? (
        <DateTimePicker
          {...params}
          style={styles.fullWidth}
          value={date.current}
          is24Hour={is24Hour}
          mode={mode !== 'datetime' || Platform.OS !== 'android' ? mode : step}
          onChange={onChange}
        />
      ) : null}
    </>
  );
};

Datepicker.propTypes = {
  auto: PropTypes.bool,
  date: PropTypes.any, // eslint-disable-line
  onDateChange: PropTypes.func,
  mode: PropTypes.oneOf(['date', 'datetime', 'time']),
  is24Hour: PropTypes.bool,
  format: PropTypes.string,
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  excludeDates: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ])),
  animationType: PropTypes.string,
  supportedOrientations: PropTypes.arrayOf(PropTypes.string),
};

Datepicker.defaultProps = {
  auto: false,
  date: undefined,
  onDateChange: noop,
  mode: 'date',
  is24Hour: false,
  format: null,
  minDate: null,
  maxDate: null,
  excludeDates: [],
  animationType: 'slide',
  supportedOrientations: ['portrait', 'landscape'],
};

export default withTheme('Datepicker')(Datepicker);
