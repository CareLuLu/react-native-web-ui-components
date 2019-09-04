import React from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { withTheme } from '../Theme';
import { Helmet, style } from '../Helmet';

ReactModal.setAppElement('#root');

const getParent = () => document.querySelector('#root');

const Modal = ({
  animationType,
  visible,
  onRequestClose,
  onShow,
  children,
  shouldCloseOnEsc,
  ...props
}) => {
  let { className } = props;
  className += ` modal-${animationType}`;
  return (
    <React.Fragment>
      <Helmet>
        <style>
          {`
            .ReactModal__Body--open #root {
              overflow: hidden;
            }
            .ReactModal__Overlay {
              position: fixed;
              top: 0px;
              left: 0px;
              right: 0px;
              bottom: 0px;
            }
            .ReactModal__Content.modal-fade {
              opacity: 0;
            }
            .ReactModal__Content--after-open.modal-fade {
              opacity: 1;
              transition: opacity 700ms;
            }
            .ReactModal__Content--before-close.modal-fade {
              opacity: 0;
            }
            .ReactModal__Content.modal-slide {
              margin-top: -20%;
              opacity: 0;
            }
            .ReactModal__Content--after-open.modal-slide {
              margin-top: 0;
              opacity: 1;
              transition: 700ms;
            }
            .ReactModal__Content--before-close.modal-slide {
              margin-top: 0;
              opacity: 0;
            }
            .ReactModal__Content--after-open:not(.NoAdjustment) > div:first-child {
              height: 100vh;
              overflow-y: auto;
              background: transparent;
            }
            .ReactModal__Content--after-open:not(.NoAdjustment) > div:first-child > div:first-child {
              margin: auto;
            }
          `}
        </style>
      </Helmet>
      <ReactModal
        isOpen={visible}
        className={className}
        overlayClassName={className}
        onRequestClose={onRequestClose}
        onAfterOpen={onShow}
        shouldCloseOnOverlayClick={shouldCloseOnEsc}
        shouldCloseOnEsc={false}
        parentSelector={getParent}
      >
        {children}
      </ReactModal>
    </React.Fragment>
  );
};

Modal.propTypes = {
  animationType: PropTypes.oneOf(['slide', 'fade', 'none']),
  visible: PropTypes.bool,
  onRequestClose: PropTypes.func,
  onShow: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  shouldCloseOnEsc: PropTypes.bool,
};

Modal.defaultProps = {
  animationType: 'fade',
  visible: true,
  onRequestClose: noop,
  onShow: noop,
  children: null,
  className: '',
  shouldCloseOnEsc: true,
};

export default withTheme('Modal')(Modal);
