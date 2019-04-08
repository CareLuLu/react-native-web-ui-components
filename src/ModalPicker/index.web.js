import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import noop from 'lodash/noop';
import { withTheme } from '../Theme';
import { Helmet, style } from '../Helmet';

/* eslint react/prefer-stateless-function: 0 */
/* eslint react/no-unused-prop-types: 0 */

class ModalPicker extends React.Component {
  componentDidMount() {
    const { align, fitContent } = this.props;
    const select = document.getElementsByClassName(this.id)[0];
    if (select) {
      if (fitContent) {
        const width = select
          .getElementsByClassName('select__placeholder')[0]
          .clientWidth;
        select.children[0].style.width = `${(width + 50)}px`;
        select.children[0].style.float = align;
      } else {
        select.children[0].style.width = '100%';
      }
    }
  }

  componentDidUpdate() {
    const { align, fitContent } = this.props;
    const select = document.getElementsByClassName(this.id)[0];
    if (select) {
      if (fitContent) {
        const width = select
          .getElementsByClassName('select__placeholder')[0]
          .clientWidth;
        select.children[0].style.width = `${(width + 50)}px`;
        select.children[0].style.float = align;
      } else {
        select.children[0].style.width = '100%';
      }
    }
  }

  render() {
    const { props } = this;
    this.id = `select-${props.name}`;
    return (
      <React.Fragment>
        <Helmet>
          <style>
            {`
              .select {
                font-family: ${props.fontFamily.regular};
              }
              .select,
              .select.select--is-focused {
                cursor: pointer;
                border-radius: 2px;
                min-height: 32px;
                outline: none;
              }
              .select__control {
                align-items: center;
                background-color: rgb(255, 255, 255);
                cursor: default;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                min-height: 38px;
                position: relative;
                box-sizing: border-box;
                border-color: rgb(204, 204, 204);
                border-radius: 4px;
                border-style: solid;
                border-width: 1px;
              }
              .select__control, 
              .select__control.select__control--is-focused {
                cursor: pointer;
                border-radius: 2px;
                min-height: 32px;
              }
              .select .select__value-container {
                padding: 0px 8px;
                align-items: center;
                display: flex;
                flex-wrap: wrap;
                position: relative;
                box-sizing: border-box;
                flex: 1 1 0%;
                padding: 2px 8px;
                overflow: hidden;
              }
              .select .select__value-container .select__placeholder {
                margin-left: 2px;
                margin-right: 2px;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                box-sizing: border-box; 
              }
              .select__indicator-separator {
                align-self: stretch;
                background-color: rgb(204, 204, 204);
                margin-bottom: 8px;
                margin-top: 8px;
                width: 1px;
                box-sizing: border-box;
              }
              .select .select__indicators {
                min-height: 32px;
                align-items: center;
                align-self: stretch;
                display: flex;
                flex-shrink: 0;
                box-sizing: border-box;
              }
              .select__indicator.select__dropdown-indicator {
                padding: 0px 8px;
                color: rgb(204, 204, 204);
                display: flex;
                box-sizing: border-box;
                padding: 8px;
              }
              .select__indicator.select__dropdown-indicator svg {
                display: inline-block;
                fill: currentcolor;
                line-height: 1;
                stroke: currentcolor;
                stroke-width: 0;
              }
              .select .select__option {
                cursor: pointer;
              }
              .select .select__menu-list {
                border-radius: 2px;
              }
              .select.no-arrow .select__indicators {
                display: none;
              }
              .select.yellow *,
              .select.yellow .select__control {
                border-color: #FEB715;
                background-color: #FEB715;
                color: #FFFFFF;
              }
              .select.yellow .select__control.select__control--is-focused {
                border-color: #FEB715;
                background-color: #FEB715;
              }
              .select.yellow:hover,
              .select.yellow .select__control:hover {
                border-color: #FEB715;
              }
              .select.yellow .select__option--is-focused {
                background-color: #F7AC00;
              }
              .select.pink * {
                border-color: #EE2D68;
                background-color: #EE2D68;
                color: #FFFFFF
              }
              .select.pink .select__control.select__control--is-focused {
                border-color: #EE2D68;
                background-color: #EE2D68;
              }
              .select.pink:hover,
              .select.pink .select__control:hover {
                border-color: #EE2D68;
              }
              .select.pink .select__option--is-focused {
                background-color: #F15786;
              }
              .select.white .select__control {
                border-color: #D3D6D6;
              }
              .select.white .select__control.select__control--is-focused {
                border-color: #EE2D68;
                box-shadow: none;
              }
              .select.white .select__option--is-focused {
                background-color: #FFA3C0;
              }
            `}
          </style>
        </Helmet>
        <Select
          autoFocus={props.autoFocus}
          name={props.name}
          placeholder={props.placeholder}
          value={props.value}
          onFocus={props.onFocus}
          onChange={props.onChange}
          options={props.options}
          isDisabled={props.disabled}
          isSearchable={false}
          clearable={false}
          className={`select ${this.id} ${props.type} ${props.arrow ? 'arrow' : 'no-arrow'} ${props.center ? 'center' : ''}`}
          classNamePrefix="select"
        />
      </React.Fragment>
    );
  }
}

ModalPicker.propTypes = {
  fontFamily: PropTypes.shape().isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  onFocus: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  arrow: PropTypes.bool,
  center: PropTypes.bool,
  fitContent: PropTypes.bool,
  align: PropTypes.string,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
};

ModalPicker.defaultProps = {
  onFocus: noop,
  value: null,
  placeholder: 'Select...',
  type: 'gray',
  arrow: true,
  center: false,
  fitContent: true,
  align: 'left',
  autoFocus: false,
  disabled: false,
};

export default withTheme('ModalPicker')(ModalPicker);
