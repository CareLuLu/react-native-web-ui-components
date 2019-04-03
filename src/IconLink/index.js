import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import Icon from '../Icon';
import Link from '../Link';
import Text from '../Text';

const IconLink = ({
  iconName,
  iconStyle,
  children,
  type,
  theme,
  ...props
}) => (
  <Link type={type || theme.colors.primary} {...props}>
    <Text type={type || theme.colors.primary}>
      <Icon name={iconName} style={iconStyle} />
      {' '}
      {children}
    </Text>
  </Link>
);

IconLink.propTypes = {
  theme: PropTypes.shape().isRequired,
  iconName: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  type: PropTypes.string,
  iconStyle: StylePropType,
};

IconLink.defaultProps = {
  type: null,
  iconStyle: null,
};

export default withTheme('IconLink')(IconLink);
