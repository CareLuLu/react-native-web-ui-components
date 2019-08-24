import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { withRouter } from 'react-router';
import DomSidebar from 'react-sidebar';
import { withTheme } from '../Theme';
import { useScreen } from '../Screen';
import { useDerivedState } from '../utils';
import Row from '../Row';

const edgeHitWidth = 120;

const Sidebar = ({
  location,
  leftOpen,
  rightOpen,
  leftOnChange,
  rightOnChange,
  leftComponent,
  rightComponent,
  disabled,
  children,
}) => {
  const screen = useScreen();

  useDerivedState(location.pathname, () => {
    setTimeout(() => {
      if (leftOnChange) {
        leftOnChange(false);
      }
      if (rightOnChange) {
        rightOnChange(false);
      }
    });
  });

  if (screen.type === 'xs' || screen.type === 'sm') {
    const styles = {
      sidebar: { width: Math.min(screen.width * 0.8, 400) },
    };
    if (leftComponent && rightComponent) {
      return (
        <DomSidebar
          styles={styles}
          open={leftOpen}
          bounceBackOnOverdraw={false}
          sidebar={leftComponent}
          onSetOpen={leftOnChange}
          touchHandleWidth={edgeHitWidth}
          touch={!(disabled || rightOpen)}
        >
          <DomSidebar
            styles={styles}
            open={rightOpen}
            bounceBackOnOverdraw={false}
            sidebar={rightComponent}
            pullRight
            onSetOpen={rightOnChange}
            touchHandleWidth={edgeHitWidth}
            touch={!disabled}
          >
            {children}
          </DomSidebar>
        </DomSidebar>
      );
    }
    if (leftComponent) {
      return (
        <DomSidebar
          styles={styles}
          open={leftOpen}
          bounceBackOnOverdraw={false}
          sidebar={leftComponent}
          onSetOpen={leftOnChange}
          touchHandleWidth={edgeHitWidth}
          touch={!disabled}
        >
          {children}
        </DomSidebar>
      );
    }
    if (rightComponent) {
      return (
        <DomSidebar
          open={rightOpen}
          bounceBackOnOverdraw={false}
          sidebar={rightComponent}
          pullRight
          onSetOpen={rightOnChange}
          touchHandleWidth={edgeHitWidth}
          touch={!disabled}
        >
          {children}
        </DomSidebar>
      );
    }
  }
  return <Row>{children}</Row>;
};

Sidebar.propTypes = {
  location: PropTypes.shape().isRequired,
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

export default withTheme('Sidebar')(withRouter(Sidebar));
