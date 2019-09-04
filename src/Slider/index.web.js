import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import noop from 'lodash/noop';
import NativeSlider from 'react-slider';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import { Helmet, style } from '../Helmet';
import View from '../View';

/* eslint react/destructuring-assignment: 0 */

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 18,
  },
});

const Slider = ({
  themeInputStyle,
  min,
  max,
  step,
  values,
  onValuesChange,
  onValuesChangeFinish,
  disabled,
  readonly,
  ...props
}) => {
  const selectedStyle = StyleSheet.flatten(themeInputStyle.selected);
  const unselectedStyle = StyleSheet.flatten(themeInputStyle.unselected);
  return (
    <React.Fragment>
      <Helmet>
        <style>
          {`
            .slider-1, .slider-2 {
              width: 100%;
              height: 18px;
            }
            .slider-1 .bar, .slider-2 .bar {
              position: relative;
              height: 12px;
              border-radius: 32px;
              top: 3px;
            }
            .slider-1 .handle, .slider-2 .handle {
              margin-left: -9px;
              width: 18px;
              height: 18px;
              cursor: pointer;
              border-radius: 50%;
              background-color: ${selectedStyle.color};
            }
            .slider-1 .handle:hover, .slider-2 .handle:hover {
              opacity: 0.7;
            }
            .slider-1 .bar.bar-0 {
              background: ${selectedStyle.color};
            }
            .slider-1 .bar.bar-1 {
              background: ${unselectedStyle.color};
            }
            .slider-2 .bar.bar-0 {
              background: ${unselectedStyle.color};
            }
            .slider-2 .bar.bar-1 {
              background: ${selectedStyle.color};
            }
            .slider-2 .bar.bar-2 {
              background: ${unselectedStyle.color};
            }
          `}
        </style>
      </Helmet>
      <View style={[styles.container, props.style]}>
        <NativeSlider
          className={`slider-${values.length}`}
          withBars
          value={values}
          min={min}
          max={max}
          step={step}
          onChange={onValuesChange}
          onAfterChange={onValuesChangeFinish}
          disabled={disabled || readonly}
        />
      </View>
    </React.Fragment>
  );
};

Slider.propTypes = {
  themeInputStyle: PropTypes.shape().isRequired,
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  onValuesChange: PropTypes.func,
  onValuesChangeFinish: PropTypes.func,
  style: StylePropType,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
};

Slider.defaultProps = {
  min: 0,
  max: 10,
  step: 1,
  onValuesChange: noop,
  onValuesChangeFinish: noop,
  style: null,
  disabled: false,
  readonly: false,
};

export default withTheme('Slider')(Slider);
