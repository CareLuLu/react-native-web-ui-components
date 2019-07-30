import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import NativeSidebar from 'react-native-side-menu';
import compose from 'recompact/compose';
import { withTheme } from '../Theme';
import { withScreen } from '../Screen';

const Sidebar = ({
  screen,
  leftOpen,
  rightOpen,
  leftOnChange,
  rightOnChange,
  leftComponent,
  rightComponent,
  disabled,
  children,
}) => {
  const { width } = screen;
  const openMenuOffset = Math.min(width * 0.8, 400);
  const edgeHitWidth = 120;

  if (leftComponent && rightComponent) {
    return (
      <NativeSidebar
        isOpen={leftOpen}
        bounceBackOnOverdraw={false}
        menu={leftComponent}
        menuPosition="left"
        onChange={leftOnChange}
        openMenuOffset={openMenuOffset}
        edgeHitWidth={edgeHitWidth}
        disableGestures={disabled || rightOpen}
      >
        <NativeSidebar
          isOpen={rightOpen}
          bounceBackOnOverdraw={false}
          menu={rightComponent}
          menuPosition="right"
          onChange={rightOnChange}
          openMenuOffset={openMenuOffset}
          edgeHitWidth={edgeHitWidth}
          disableGestures={disabled}
        >
          {children}
        </NativeSidebar>
      </NativeSidebar>
    );
  }
  if (leftComponent) {
    return (
      <NativeSidebar
        isOpen={leftOpen}
        bounceBackOnOverdraw={false}
        menu={leftComponent}
        menuPosition="left"
        onChange={leftOnChange}
        openMenuOffset={openMenuOffset}
        edgeHitWidth={edgeHitWidth}
        disableGestures={disabled}
      >
        {children}
      </NativeSidebar>
    );
  }
  if (rightComponent) {
    return (
      <NativeSidebar
        isOpen={rightOpen}
        bounceBackOnOverdraw={false}
        menu={rightComponent}
        menuPosition="right"
        onChange={rightOnChange}
        openMenuOffset={openMenuOffset}
        edgeHitWidth={edgeHitWidth}
        disableGestures={disabled}
      >
        {children}
      </NativeSidebar>
    );
  }
  return { children };
};

Sidebar.propTypes = {
  screen: PropTypes.shape().isRequired,
  leftOpen: PropTypes.bool,
  leftOnChange: PropTypes.func,
  leftComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]),
  rightOpen: PropTypes.bool,
  rightOnChange: PropTypes.func,
  rightComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]),
  children: PropTypes.node,
  disabled: PropTypes.bool,
};

Sidebar.defaultProps = {
  leftOpen: false,
  leftOnChange: noop,
  leftComponent: null,
  rightOpen: false,
  rightOnChange: noop,
  rightComponent: null,
  children: null,
  disabled: false,
};

export default compose(
  withTheme('Sidebar'),
  withScreen(),
)(Sidebar);
