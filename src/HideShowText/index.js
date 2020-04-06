import React, { useState } from 'react';
import PropTypes from 'prop-types';
import StylePropType from '../StylePropType';
import { toDescription } from '../utils';
import { withTheme } from '../Theme';
import Text from '../Text';
import ReadMoreLessLink from '../ReadMoreLessLink';
import { useAmp } from '../Amp';

const HideShowText = ({
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
  const amp = useAmp();

  const [isVisible, setVisible] = useState(visible);
  const toggle = () => setVisible(!isVisible);

  if (amp) {
    return <Text {...props}>{children}</Text>;
  }
  const visibleText = toDescription(children, threshold, ending);
  return (
    <React.Fragment>
      <Text auto={auto} {...props}>
        {isVisible ? children : visibleText}
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
              visible={isVisible}
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
          visible={isVisible}
        />
      ) : null}
    </React.Fragment>
  );
};

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
