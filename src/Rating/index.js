import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform } from 'react-native';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import View from '../View';
import Icon from '../Icon';

/* eslint react/no-array-index-key: 0 */

const styles = StyleSheet.create({
  default: {},
  container: {
    flexDirection: 'row',
  },
  empty: {
    marginRight: 1,
    color: '#C0C0C0',
    fontSize: 18,
  },
  full: {
    marginRight: 1,
    color: '#FEC430',
    fontSize: 18,
  },
  half: {
    marginRight: 1,
  },
  halfLeft: {
    position: 'absolute',
  },
  halfRight: {
    position: 'absolute',
    overflow: 'hidden',
  },
});

const Rating = ({
  style,
  emptyStyle,
  fullStyle,
  halfStyle,
  halfLeftStyle,
  halfRightStyle,
  rating,
  iconName,
  ...props
}) => {
  const r = rating || 0;
  const full = parseInt(r, 10);
  const half = parseInt((r - full) / 0.5, 10);
  const empty = 5 - full - half;
  const css = StyleSheet.flatten([styles.full, styles.halfLeft, fullStyle, halfLeftStyle]);
  let width = css.fontSize / 2;
  let size = css.fontSize;
  if (Platform.OS !== 'web') {
    width += 0.5;
    size += 1;
  }
  return (
    <View {...props} style={[styles.container, style]}>
      {Array(full).fill(0).map((v, i) => (
        <View
          className={`Rating__group Rating__group-${i}`}
          key={`full-${i}`}
          style={[styles.half, { width: size, height: size }]}
        >
          <Icon
            name={iconName}
            className={`Rating Rating__${(2 * i) + 1}`}
            style={[styles.full, styles.halfLeft, fullStyle]}
          />
          <Icon
            name={iconName}
            className={`Rating Rating__${2 * i}`}
            style={[styles.full, styles.halfRight, fullStyle, { width }]}
          />
        </View>
      ))}
      {half > 0 ? (
        <View
          className={`Rating__group Rating__group-${full}`}
          style={[styles.half, { width: size, height: size }]}
        >
          {Array(half).fill(0).map((v, i) => (
            <Icon
              key={`halfFull-${i}`}
              name={iconName}
              className={`Rating Rating__${(2 * full) + 1}`}
              style={[styles.empty, styles.halfLeft, emptyStyle, halfRightStyle]}
            />
          ))}
          {Array(half).fill(0).map((v, i) => (
            <Icon
              key={`halfEmpty-${i}`}
              name={iconName}
              className={`Rating Rating__${2 * full}`}
              style={[styles.full, styles.halfRight, fullStyle, halfRightStyle, { width }]}
            />
          ))}
        </View>
      ) : null}
      {Array(empty).fill(0).map((v, i) => (
        <View
          className={`Rating__group Rating__group-${full + half + i}`}
          key={`empty-${i}`}
          style={[styles.half, { width: size, height: size }]}
        >
          <Icon
            name={iconName}
            className={`Rating Rating__${(2 * (i + full + half)) + 1}`}
            style={[styles.empty, styles.halfLeft, emptyStyle]}
          />
          <Icon
            name={iconName}
            className={`Rating Rating__${2 * (i + full + half)}`}
            style={[styles.empty, styles.halfRight, emptyStyle, { width }]}
          />
        </View>
      ))}
    </View>
  );
};

Rating.propTypes = {
  style: StylePropType,
  emptyStyle: StylePropType,
  fullStyle: StylePropType,
  halfStyle: StylePropType,
  halfLeftStyle: StylePropType,
  halfRightStyle: StylePropType,
  rating: PropTypes.number,
  iconName: PropTypes.string,
};

Rating.defaultProps = {
  style: styles.default,
  emptyStyle: styles.default,
  fullStyle: styles.default,
  halfStyle: styles.default,
  halfLeftStyle: styles.default,
  halfRightStyle: styles.default,
  rating: 0,
  iconName: 'star',
};

export default withTheme('Rating')(Rating);
