import React from 'react';
import PropTypes from 'prop-types';
import withStateHandlers from 'recompact/withStateHandlers';
import StylePropType from '../StylePropType';
import { toDescription, isSSR } from '../utils';
import { withTheme } from '../Theme';
import Text from '../Text';
import ReadMoreLessLink from '../ReadMoreLessLink';

const HideShowText = withStateHandlers(
  ({ visible = false }) => ({ show: visible }),
  {
    toggle: ({ show }) => () => ({ show: !show }),
  },
)(({
  toggle,
  show,
  visible,
  threshold,
  children,
  buttonStyle,
  showLabel,
  hideLabel,
  ending,
  auto,
  ...props
}) => {
  if (isSSR()) {
    return <Text {...props}>{children}</Text>;
  }
  const visibleText = toDescription(children, threshold, ending);
  return (
    <React.Fragment>
      <Text auto={auto} {...props}>
        {show ? children : visibleText}
        {auto && visibleText !== children ? (
          <React.Fragment>
            {' '}
            <ReadMoreLessLink
              auto
              showLabel={showLabel}
              hideLabel={hideLabel}
              style={buttonStyle}
              type="pink"
              onChange={toggle}
              visible={show}
            />
          </React.Fragment>
        ) : null}
      </Text>
      {!auto && visibleText !== children ? (
        <ReadMoreLessLink
          showLabel={showLabel}
          hideLabel={hideLabel}
          style={buttonStyle}
          type="pink"
          onChange={toggle}
          visible={show}
        />
      ) : null}
    </React.Fragment>
  );
});

HideShowText.propTypes = {
  children: PropTypes.string.isRequired,
  auto: PropTypes.bool,
  visible: PropTypes.bool,
  threshold: PropTypes.number,
  buttonStyle: StylePropType,
  ending: PropTypes.string,
  showLabel: PropTypes.string,
  hideLabel: PropTypes.string,
};

HideShowText.defaultProps = {
  auto: false,
  visible: false,
  threshold: 200,
  buttonStyle: null,
  ending: '...',
  showLabel: 'show more...',
  hideLabel: 'show less...',
};

export default withTheme('HideShowText')(HideShowText);
