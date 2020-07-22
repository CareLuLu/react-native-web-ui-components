import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform, TouchableWithoutFeedback } from 'react-native';
import times from 'lodash/times';
import without from 'lodash/without';
import uniq from 'lodash/uniq';
import noop from 'lodash/noop';
import { toTime } from '../utils';
import { withTheme } from '../Theme';
import Row from '../Row';
import View from '../View';
import Text from '../Text';
import TouchableOpacity from '../TouchableOpacity';
import StylePropType from '../StylePropType';
import { Helmet, style } from '../Helmet';

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 2,
    height: 40,
  },
  headerContainer: {
    height: 14,
  },
  header: {
    position: 'absolute',
    top: 0,
    fontSize: 8,
    textAlign: 'center',
  },
  time: {
    position: 'absolute',
    top: 0,
    borderRightWidth: 1,
    borderRightColor: '#FFFFFF',
    height: '100%',
  },
  view: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  active: {
    backgroundColor: '#49AFC3',
  },
  inactive: {
    backgroundColor: '#DCF0F5',
  },
  disabled: {
    backgroundColor: '#C8C8C8',
  },
  opacity: {
    opacity: 0.7,
  },
});

const sorter = (a, b) => (a - b);

const TimeCell = ({
  id,
  width,
  index,
  value,
  values,
  pressed,
  hover,
  onPress,
  disabled,
  selectedStyle,
  unselectedStyle,
  themeInputStyle,
  filterTime,
}) => {
  const press = () => onPress(value);

  const reverse = pressed === value;
  let active = values.indexOf(value) >= 0;
  if (reverse) {
    active = !active;
  }
  let className = `${hover}`;
  if (pressed === value) {
    className += ` ${id}__pressed`;
  } else if (value > pressed) {
    className += ` ${id}__after`;
  } else {
    className += ` ${id}__before`;
  }
  if (pressed === null) {
    className += active ? ` ${id}__active` : ` ${id}__inactive`;
  }
  const isDisabled = disabled || !filterTime(value);
  if (isDisabled) {
    className += ` ${id}__disabled`;
  }
  const css = [{
    width: `${width}%`,
    right: `${index * width}%`,
    borderStyle: index === 0 || index % 2 ? 'solid' : 'dashed',
  }];
  if (index === 0) {
    css.push({ borderRightColor: 'transparent' });
  }
  const background = [];
  if (active) {
    background.push({ backgroundColor: selectedStyle.color });
  } else {
    css.push({ opacity: 0.2 });
    background.push({ backgroundColor: selectedStyle.color });
  }
  if (isDisabled) {
    css.push(themeInputStyle.opacity);
    background.push({ backgroundColor: unselectedStyle.color });
  }
  let Wrapper;
  let wrapperProps;
  if (Platform.OS === 'web') {
    Wrapper = TouchableWithoutFeedback;
    wrapperProps = { onPressIn: press };
  } else {
    Wrapper = TouchableOpacity;
    wrapperProps = { onPress: press, style: styles.view };
  }
  // There is some weird bug on iOS and we need
  // to set the background color both to outer
  // view and inner view.
  return (
    <View className={className} style={[styles.time, css, background]}>
      <Wrapper {...wrapperProps}>
        <View style={[styles.view, Platform.OS !== 'web' ? background : null]} />
      </Wrapper>
    </View>
  );
};

TimeCell.propTypes = {
  id: PropTypes.string.isRequired,
  selectedStyle: PropTypes.shape().isRequired,
  unselectedStyle: PropTypes.shape().isRequired,
  hover: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
  width: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  filterTime: PropTypes.func.isRequired,
  themeInputStyle: PropTypes.shape().isRequired,
  pressed: PropTypes.number,
};

TimeCell.defaultProps = {
  pressed: null,
};

const getParams = ({
  themeInputStyle,
  minTime,
  maxTime,
  interval,
  value,
  decoder,
  name,
  selectedStyle,
  unselectedStyle,
}) => ({
  id: `TimeRangePicker__${(name && name.replace(/\./g, '-')) || Math.random().toString(36).substr(2, 9)}`,
  length: Math.ceil((maxTime - minTime) / interval),
  width: 100 / Math.ceil((maxTime - minTime) / interval),
  values: decoder(value).sort(sorter),
  selectedStyle: StyleSheet.flatten([themeInputStyle.selected, selectedStyle]),
  unselectedStyle: StyleSheet.flatten([themeInputStyle.unselected, unselectedStyle]),
});

const TimeRangePicker = (props) => {
  const {
    onFocus,
    onBlur,
    onChange,
    interval,
    encoder,
    disabled,
    readonly,
    filterTime,
    header,
    minTime,
    maxTime,
    themeInputStyle,
  } = props;

  const {
    id,
    length,
    width,
    values,
    selectedStyle,
    unselectedStyle,
  } = getParams(props);

  const [pressed, setPressed] = useState(null);

  const onStart = (start) => {
    if (!disabled && !readonly && filterTime(start)) {
      onFocus();
      setPressed(start);
    }
  };

  const onEnd = (end) => {
    if (!disabled && !readonly) {
      onBlur();
      const reverse = values.indexOf(pressed) >= 0;
      const range = [];
      for (let i = pressed; i <= end; i += interval) {
        range.push(i);
      }
      const newValues = reverse
        ? without(values, ...range) : uniq(values.concat(range)).sort(sorter);
      onChange(encoder(newValues));
      setPressed(null);
    }
  };

  const hover = pressed && (values.indexOf(pressed) < 0 ? `${id}__enable` : `${id}__disable`);

  const renderCell = index => (
    <TimeCell
      id={id}
      key={index}
      width={width}
      index={index}
      value={maxTime - ((index + 1) * interval)}
      values={values}
      pressed={pressed}
      hover={hover || ''}
      disabled={disabled || readonly}
      onPress={pressed === null ? onStart : onEnd}
      selectedStyle={selectedStyle}
      unselectedStyle={unselectedStyle}
      themeInputStyle={themeInputStyle}
      filterTime={filterTime}
    />
  );

  const renderHeader = index => (
    <Text
      key={`header-${index}`}
      type="gray"
      style={[styles.header, {
        width: `${2 * width}%`,
        left: `${(2 * index * width) - width}%`,
      }]}
    >
      {toTime(minTime + (index * 2 * interval), 'H:MMA').replace('m', '').replace(':00', '')}
    </Text>
  );

  return (
    <React.Fragment>
      {header ? (
        <Row style={styles.headerContainer}>
          {times(!(length % 2) ? (length / 2) : ((length + 1) / 2), renderHeader)}
          <Text
            type="gray"
            style={[styles.header, {
              width: `${2 * width}%`,
              right: `-${width}%`,
            }]}
          >
            {toTime(maxTime, 'H:MMA').replace('m', '').replace(':00', '')}
          </Text>
        </Row>
      ) : null}
      <Row style={styles.container}>
        <Helmet>
          <style>
            {`
              [data-class~="${id}__after"],
              [data-class~="${id}__pressed"],
              [data-class~="${id}__before"],
              [data-class~="${id}__disabled"] {
                user-drag: none; 
                user-select: none;
              }
              [data-class~="${id}__after"][data-class~="${id}__disable"]:hover,
              [data-class~="${id}__after"][data-class~="${id}__disable"]:hover ~ [data-class~="${id}__after"] {
                ${!(disabled || readonly) ? 'opacity: 0.2 !important;' : ''}
                background-color: ${selectedStyle.color};
              }
              [data-class~="${id}__inactive"]:hover,
              [data-class~="${id}__after"][data-class~="${id}__enable"]:hover,
              [data-class~="${id}__after"][data-class~="${id}__enable"]:hover ~ [data-class~="${id}__after"] {
                ${!(disabled || readonly) ? 'opacity: 1 !important;' : ''}
                background-color: ${selectedStyle.color};
              }
              [data-class~="${id}__disabled"],
              [data-class~="${id}__disabled"]:hover {
                background-color: ${unselectedStyle.color};
              }
            `}
          </style>
        </Helmet>
        {times(length, renderCell)}
      </Row>
    </React.Fragment>
  );
};

export const NUMBER_DECODER = value => (value || []);
export const NUMBER_ENCODER = value => value;

export const STRING_DECODER = value => (value || '').split(',').filter(v => (v !== '')).map(v => parseInt(v, 10));
export const STRING_ENCODER = value => value.join(',');

TimeRangePicker.propTypes = {
  themeInputStyle: PropTypes.shape().isRequired,
  minTime: PropTypes.number,
  maxTime: PropTypes.number,
  interval: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // eslint-disable-line
  decoder: PropTypes.func, // eslint-disable-line
  encoder: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  header: PropTypes.bool,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  name: PropTypes.string, // eslint-disable-line
  filterTime: PropTypes.func,
  selectedStyle: StylePropType, // eslint-disable-line
  unselectedStyle: StylePropType, // eslint-disable-line
};

TimeRangePicker.defaultProps = {
  minTime: 360,
  maxTime: 1140,
  interval: 30,
  value: [],
  decoder: NUMBER_DECODER,
  encoder: NUMBER_ENCODER,
  onFocus: noop,
  onBlur: noop,
  onChange: noop,
  header: true,
  disabled: false,
  readonly: false,
  name: '',
  filterTime: () => true,
  selectedStyle: {},
  unselectedStyle: {},
};

export default withTheme('TimeRangePicker')(TimeRangePicker);
