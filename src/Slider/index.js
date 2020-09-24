import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import noop from 'lodash/noop';
import NativeSlider from '@ptomasroos/react-native-multi-slider';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';

const styles = StyleSheet.create({
  container: {
    height: 18,
  },
  track: {
    height: 12,
    borderRadius: 32,
    marginTop: 3,
  },
  selected: {
    height: 12,
    borderRadius: 32,
    marginTop: 3,
  },
  markerContainer: {
    width: 30,
    height: 30,
  },
  marker: {
    width: 18,
    height: 18,
    borderRadius: 9,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
});

const Slider = ({
  themeInputStyle,
  min,
  max,
  step,
  values,
  onValuesChangeStart,
  onValuesChange,
  onValuesChangeFinish,
  style,
  sliderLength,
  disabled,
  readonly,
  touchDimensions,
}) => {
  const selectedStyle = StyleSheet.flatten(themeInputStyle.selected);
  const unselectedStyle = StyleSheet.flatten(themeInputStyle.unselected);
  return (
    <NativeSlider
      values={values}
      min={min}
      max={max}
      step={step}
      markerOffsetY={18}
      markerOffsetX={9}
      containerStyle={[styles.container, themeInputStyle.opacity, style]}
      markerStyle={[
        styles.marker,
        {
          backgroundColor: selectedStyle.color,
          borderColor: selectedStyle.color,
        },
      ]}
      pressedMarkerStyle={styles.marker}
      markerContainerStyle={styles.markerContainer}
      unselectedStyle={[
        styles.track,
        { backgroundColor: unselectedStyle.color },
      ]}
      selectedStyle={[
        styles.selected,
        { backgroundColor: selectedStyle.color },
      ]}
      touchDimensions={touchDimensions}
      sliderLength={sliderLength}
      onValuesChange={onValuesChange}
      onValuesChangeStart={onValuesChangeStart}
      onValuesChangeFinish={onValuesChangeFinish}
      enableOne={!(disabled || readonly)}
      enableTwo={!(disabled || readonly)}
    />
  );
};

Slider.propTypes = {
  themeInputStyle: PropTypes.shape().isRequired,
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  onValuesChange: PropTypes.func,
  onValuesChangeStart: PropTypes.func,
  onValuesChangeFinish: PropTypes.func,
  style: StylePropType,
  sliderLength: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  touchDimensions: PropTypes.shape(),
};

Slider.defaultProps = {
  min: 0,
  max: 10,
  step: 1,
  onValuesChange: noop,
  onValuesChangeStart: noop,
  onValuesChangeFinish: noop,
  style: null,
  disabled: false,
  readonly: false,
  touchDimensions: {
    height: 50,
    width: 50,
    borderRadius: 15,
    slipDisplacement: 200,
  },
};

export default withTheme('Slider')(Slider);
