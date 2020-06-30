import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import StylePropType from '../StylePropType';
import { pick } from '../utils';
import { withTheme } from '../Theme';
import { Helmet, style } from '../Helmet';
import Text from '../Text';

/* eslint react/destructuring-assignment: 0 */

const styles = StyleSheet.create({
  empty: {},
  defaults: {
    textAlign: 'center',
  },
});

const Title = ({
  id,
  level,
  xs,
  sm,
  md,
  lg,
  className,
  ...props
}) => {
  let defaultFontSize;
  switch (level) {
    case 1: defaultFontSize = 32; break;
    case 2: defaultFontSize = 24; break;
    case 3: defaultFontSize = 20; break;
    case 4: defaultFontSize = 16; break;
    default: defaultFontSize = 13;
  }

  const classNames = [className, id];

  return (
    <React.Fragment>
      <Helmet>
        <style>
          {`
            [data-class~="${id}"] {
              font-size: ${pick(xs, defaultFontSize)}px;
              line-height: ${parseFloat(pick(xs, defaultFontSize)) * 1.1}px;
            }
            @media (min-width: 768px) {
              [data-class~="${id}"] {
                font-size: ${pick(sm, xs, defaultFontSize)}px;
                line-height: ${parseFloat(pick(sm, xs, defaultFontSize)) * 1.1}px;
              }
            }
            @media (min-width: 992px) {
              [data-class~="${id}"] {
                font-size: ${pick(md, sm, xs, defaultFontSize)}px;
                line-height: ${parseFloat(pick(md, sm, xs, defaultFontSize)) * 1.1}px;
              }
            }
            @media (min-width: 1200px) {
              [data-class~="${id}"] {
                font-size: ${pick(lg, md, sm, xs, defaultFontSize)}px;
                line-height: ${parseFloat(pick(lg, md, sm, xs, defaultFontSize)) * 1.1}px;
              }
            }
          `}
        </style>
      </Helmet>
      <Text
        {...props}
        className={classNames.join(' ')}
        accessibilityRole="heading"
        aria-level={level}
        style={[styles.defaults, props.style]}
      />
    </React.Fragment>
  );
};

Title.propTypes = {
  id: PropTypes.string.isRequired,
  style: StylePropType,
  level: PropTypes.number,
  xs: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sm: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  md: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  lg: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
};

Title.defaultProps = {
  style: styles.empty,
  level: 1,
  xs: null,
  sm: null,
  md: null,
  lg: null,
  className: '',
};

export default withTheme('Title')(Title);
