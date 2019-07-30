import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import DomSidebar from 'react-sidebar';
import compose from 'recompact/compose';
import lifecycle from 'recompact/lifecycle';
import { withTheme } from '../Theme';
import { withScreen } from '../Screen';
import Row from '../Row';

const edgeHitWidth = 120;

const Sidebar = lifecycle({
  componentWillReceiveProps(nextProps) {
    if (this.props.location && this.props.location.pathname !== nextProps.location.pathname) {
      if (nextProps.leftOnChange) {
        nextProps.leftOnChange(false);
      }
      if (nextProps.rightOnChange) {
        nextProps.rightOnChange(false);
      }
    }
  },
})(({
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
  return <Row>{ children }</Row>;
});

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
