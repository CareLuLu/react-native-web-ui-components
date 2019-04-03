import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import times from 'lodash/times';
import without from 'lodash/without';
import uniq from 'lodash/uniq';
import noop from 'lodash/noop';
import withHandlers from 'recompact/withHandlers';
import withProps from 'recompact/withProps';
import withStateHandlers from 'recompact/withStateHandlers';
import compose from 'recompact/compose';
import { toTime } from '../utils';
import { withTheme } from '../Theme';
import Row from '../Row';
import View from '../View';
import Text from '../Text';
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

const TimeCell = compose(
  withHandlers({
    press: ({ onPress, value }) => () => onPress(value),
  }),
)(({
  width,
  index,
  value,
  values,
  pressed,
  press,
  hover,
  disabled,
  selectedStyle,
  unselectedStyle,
  themeInputStyle,
}) => {
  const reverse = pressed === value;
  let active = values.indexOf(value) >= 0;
  if (reverse) {
    active = !active;
  }
  let className = `${hover}`;
  if (pressed === value) {
    className += ' Timepicker__pressed';
  } else if (value > pressed) {
    className += ' TimePicker__after';
  } else {
    className += ' TimePicker__before';
  }
  if (pressed === null) {
    className += active ? ' TimePicker__active' : ' TimePicker__inactive';
  }
  if (disabled) {
    className += ' TimePicker__disabled';
  }
  const css = [{
    width: `${width}%`,
    right: `${index * width}%`,
    borderStyle: index === 0 || index % 2 ? 'solid' : 'dashed',
  }];
  if (index === 0) {
    css.borderRightColor = 'transparent';
  }
  const background = [];
  if (active) {
    background.push({ backgroundColor: selectedStyle.color });
  } else {
    css.opacity = 0.2;
    background.push({ backgroundColor: selectedStyle.color });
  }
  if (disabled) {
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
});

TimeCell.propTypes = {
  selectedStyle: PropTypes.shape().isRequired,
  unselectedStyle: PropTypes.shape().isRequired,
  hover: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
  width: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  pressed: PropTypes.number,
};

TimeCell.defaultProps = {
  pressed: null,
};

const TimeRangePicker = compose(
  withProps(({
    themeInputStyle,
    minTime,
    maxTime,
    interval,
    value,
    decoder,
  }) => ({
    length: Math.ceil((maxTime - minTime) / interval),
    width: 100 / Math.ceil((maxTime - minTime) / interval),
    values: decoder(value).sort(sorter),
    selectedStyle: StyleSheet.flatten(themeInputStyle.selected),
    unselectedStyle: StyleSheet.flatten(themeInputStyle.unselected),
  })),
  withStateHandlers({ pressed: null }, {
    onStart: (__, { onFocus, disabled }) => (start) => {
      if (disabled) {
        return {};
      }
      onFocus();
      return { pressed: start };
    },
    onEnd: ({ pressed }, {
      onChange,
      values,
      interval,
      disabled,
      encoder,
    }) => (end) => {
      if (disabled) {
        return {};
      }
      const reverse = values.indexOf(pressed) >= 0;
      const range = [];
      for (let i = pressed; i <= end; i += interval) {
        range.push(i);
      }
      const newValues = reverse
        ? without(values, ...range) : uniq(values.concat(range)).sort(sorter);
      onChange(encoder(newValues));
      return { pressed: null };
    },
  }),
  withProps(({ pressed, values }) => ({
    hover: pressed && (values.indexOf(pressed) < 0 ? 'TimePicker__enable' : 'TimePicker__disable'),
  })),
  withHandlers({
    renderCell: ({
      width,
      values,
      onStart,
      pressed,
      onEnd,
      maxTime,
      interval,
      hover,
      disabled,
      selectedStyle,
      unselectedStyle,
      themeInputStyle,
    }) => index => (
      <TimeCell
        key={index}
        width={width}
        index={index}
        value={maxTime - ((index + 1) * interval)}
        values={values}
        pressed={pressed}
        hover={hover || ''}
        disabled={disabled}
        onPress={pressed === null ? onStart : onEnd}
        selectedStyle={selectedStyle}
        unselectedStyle={unselectedStyle}
        themeInputStyle={themeInputStyle}
      />
    ),
    renderHeader: ({ width, minTime, interval }) => index => (
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
    ),
  }),
)(({
  maxTime,
  width,
  header,
  length,
  renderCell,
  renderHeader,
  selectedStyle,
  unselectedStyle,
}) => (
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
            .TimePicker__after,
            .Timepicker__pressed,
            .TimePicker__before,
            .TimePicker__disabled {
              user-drag: none; 
              user-select: none;
            }
            .TimePicker__after.TimePicker__disable:hover,
            .TimePicker__after.TimePicker__disable:hover ~ .TimePicker__after {
              opacity: 0.2;
              background-color: ${selectedStyle.color};
            }
            .TimePicker__inactive:hover,
            .TimePicker__after.TimePicker__enable:hover,
            .TimePicker__after.TimePicker__enable:hover ~ .TimePicker__after {
              opacity: 1;
              background-color: ${selectedStyle.color};
            }
            .TimePicker__disabled,
            .TimePicker__disabled:hover {
              background-color: ${unselectedStyle.color};
            }
          `}
        </style>
      </Helmet>
      {times(length, renderCell)}
    </Row>
  </React.Fragment>
));

export const NUMBER_DECODER = value => (value || []);
export const NUMBER_ENCODER = value => value;

export const STRING_DECODER = value => (value || '').split(',').filter(v => (v !== '')).map(v => parseInt(v, 10));
export const STRING_ENCODER = value => value.join(',');

TimeRangePicker.propTypes = {
  themeInputStyle: PropTypes.shape().isRequired,
  minTime: PropTypes.number,
  maxTime: PropTypes.number,
  interval: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  decoder: PropTypes.func,
  encoder: PropTypes.func,
  onFocus: PropTypes.func,
  onChange: PropTypes.func,
  header: PropTypes.bool,
  disabled: PropTypes.bool,
};

TimeRangePicker.defaultProps = {
  minTime: 360,
  maxTime: 1140,
  interval: 30,
  value: [],
  decoder: NUMBER_DECODER,
  encoder: NUMBER_ENCODER,
  onFocus: noop,
  onChange: noop,
  header: true,
  disabled: false,
};

export default withTheme('TimeRangePicker')(TimeRangePicker);
