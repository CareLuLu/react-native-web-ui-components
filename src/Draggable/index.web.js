import React from 'react';
import PropTypes from 'prop-types';
import RNDraggable from 'react-draggable';
import withHandlers from 'recompact/withHandlers';
import compose from 'recompact/compose';
import noop from 'lodash/noop';

const Draggable = compose(
  withHandlers({
    onStart: ({ onDragStart }) => (e, data) => onDragStart(data),
    onStop: ({ onDragEnd }) => (e, data) => onDragEnd(data),
  }),
)(({
  children,
  onStart,
  onStop,
  axis,
  disabled,
  handle,
}) => (
  <RNDraggable
    handle={handle ? `.${handle}` : undefined}
    disabled={disabled}
    onStart={onStart}
    onStop={onStop}
    axis={axis}
  >
    {children({})}
  </RNDraggable>
));

Draggable.propTypes = {
  children: PropTypes.func.isRequired,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  axis: PropTypes.oneOf(['x', 'y', 'both']),
  disabled: PropTypes.bool,
  handle: PropTypes.string,
};

Draggable.defaultProps = {
  onDragStart: noop,
  onDragEnd: noop,
  axis: 'both',
  disabled: false,
  handle: null,
};

export default Draggable;
