import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import Link from '../Link';

/* eslint no-shadow: 0 */
/* eslint react/no-children-prop: 0 */
/* eslint react/require-default-props: 0 */
/* eslint react/forbid-prop-types: 0 */

const NavLink = ({
  to,
  exact,
  strict,
  location,
  activeClassName,
  className,
  activeStyle,
  style,
  type,
  activeType,
  isActive: getIsActive,
  'aria-current': ariaCurrent,
  ...rest
}) => {
  const path = typeof to === 'object' ? to.pathname : to;

  // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
  const escapedPath = path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');

  return (
    <Route
      path={escapedPath}
      exact={exact}
      strict={strict}
      location={location}
      children={({ location, match }) => {
        const isActive = !!(getIsActive ? getIsActive(match, location) : match);
        return (
          <Link
            to={to}
            type={isActive && activeType ? activeType : type}
            className={
              isActive
                ? [className, activeClassName].filter(i => i).join(' ')
                : className
            }
            style={isActive ? [style, activeStyle] : style}
            aria-current={(isActive && ariaCurrent) || null}
            {...rest}
          />
        );
      }}
    />
  );
};

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  activeType: PropTypes.string.isRequired,
  style: StylePropType,
  activeStyle: StylePropType,
  children: PropTypes.node,
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  location: PropTypes.object,
  activeClassName: PropTypes.string,
  className: PropTypes.string,
  isActive: PropTypes.func,
  'aria-current': PropTypes.oneOf([
    'page',
    'step',
    'location',
    'date',
    'time',
    'true',
  ]),
};

NavLink.defaultProps = {
  children: null,
  activeClassName: 'active',
  'aria-current': 'page',
};

export default withTheme('NavLink')(NavLink);
