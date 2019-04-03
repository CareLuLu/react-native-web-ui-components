import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import DomSidebar from 'react-sidebar';
import lifecycle from 'recompact/lifecycle';
import { withTheme } from '../Theme';
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
        >
          <DomSidebar
            styles={styles}
            open={rightOpen}
            bounceBackOnOverdraw={false}
            sidebar={rightComponent}
            pullRight
            onSetOpen={rightOnChange}
            touchHandleWidth={edgeHitWidth}
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
        >
          {children}
        </DomSidebar>
      );
    }
  }
  return <Row>{ children }</Row>;
});

Sidebar.propTypes = {
  screen: PropTypes.shape({
    type: PropTypes.string.isRequired,
  }).isRequired,
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
};

Sidebar.defaultProps = {
  leftOpen: false,
  leftOnChange: noop,
  leftComponent: null,
  rightOpen: false,
  rightOnChange: noop,
  rightComponent: null,
  children: null,
};

export default withTheme('Sidebar')(Sidebar);
