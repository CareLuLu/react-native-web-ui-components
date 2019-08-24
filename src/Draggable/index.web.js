import React from 'react';
import PropTypes from 'prop-types';
import RNDraggable from 'react-draggable';
import noop from 'lodash/noop';

const Draggable = ({
  children,
  axis,
  disabled,
  handle,
  onDragStart,
  onDragEnd,
}) => {
  const onStart = (e, data) => onDragStart(data);
  const onStop = (e, data) => onDragEnd(data);

  return (
    <RNDraggable
      handle={handle ? `.${handle}` : undefined}
      disabled={disabled}
      onStart={onStart}
      onStop={onStop}
      axis={axis}
    >
      {children({})}
    </RNDraggable>
  );
};

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
