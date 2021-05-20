import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import noop from 'lodash/noop';
import RNDatepicker from 'react-datepicker';
import moment from 'moment';
import { withTheme } from '../Theme';
import { formatMask } from '../utils';
import StylePropType from '../StylePropType';
import { Helmet, style } from '../Helmet';
import View from '../View';
import createDomStyle from '../createDomStyle';

const styles = StyleSheet.create({
  datepicker: {
    backgroundColor: 'black',
  },
  fullWidth: {
    width: '100%',
  },
});

const popperModifiers = {
  flip: {
    enabled: false,
  },
  hide: {
    enabled: false,
  },
  preventOverflow: {
    enabled: false,
    escapeWithReference: false,
  },
};

const baseCustomCss = `
  .react-datepicker-wrapper, .react-datepicker__input-container {
    display: flex;
  }
  .react-datepicker__input-container input {
    outline: none;
    padding-top: 8px;
    padding-right: 12px;
    padding-left: 12px;
    padding-bottom: 8px;
    resize: none;
    height: 40px;
    background-image: url(https://divin2sy6ce0b.cloudfront.net/images/calendar-icon.png);
    background-repeat: no-repeat;
    background-position: right 10px center;
  }
  .react-datepicker-popper {
    width: max-content;
  }
  .react-datepicker__time-container .react-datepicker__time {
    border-bottom-right-radius: 3px;
  }
  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box {
    width: 69px;
  }
`;

const DATE_FORMAT = /[a-zA-Z]/g;

const FORMAT = [
  'YYYY-MM-DD[T]HH:mm:ssZ',
  'YYYY-MM-DD[T]HH:mm:ss.SSSZ',
  'MM/DD/YYYY',
  'MM/D/YYYY',
  'M/D/YYYY',
  'M/DD/YYYY',
  'MM/DD/YYYY h:mma',
  'MM/D/YYYY h:mma',
  'M/D/YYYY h:mma',
  'M/DD/YYYY h:mma',
  'h:mma',
];

const useEvents = ({
  onBlur,
  format,
  minDate,
  maxDate,
  onDateChange = noop,
}) => {
  const formats = FORMAT.concat([format]);

  const input = useRef();
  const value = useRef();

  const onRef = (ref) => {
    input.current = ref && ref.input;
  };

  const onChange = (date) => {
    const nextDate = moment(date, formats).format(format);
    if (input.current) {
      input.current.value = nextDate;
    }
    value.current = nextDate;
    setTimeout(() => onDateChange(nextDate));
  };

  const onChangeRaw = () => {
    if (input.current) {
      const nodeValue = input.current.value;
      const mask = format.replace(DATE_FORMAT, '9');
      const formattedValue = formatMask(nodeValue, mask);
      if (nodeValue !== formattedValue) {
        input.current.value = formattedValue;
      }
    }
  };

  const onBlurEvent = (e) => {
    onBlur();
    if (value.current !== e.target.value) {
      const nextDate = moment(e.target.value, format, true);
      if (nextDate.isValid()) {
        if (
          (minDate && moment(minDate, formats).isAfter(nextDate)) // before min date
          || (maxDate && moment(maxDate, formats).isBefore(nextDate)) // after max date
        ) {
          alert('This date cannot be selected. Please choose another one.'); // eslint-disable-line
          return onDateChange('');
        }
        return onDateChange(nextDate.format(format));
      }
      return onDateChange('');
    }
    return null;
  };

  return [
    onRef,
    onChange,
    onChangeRaw,
    onBlurEvent,
  ];
};

const useCss = ({
  date,
  auto,
  name,
  themeInputStyle,
  selectedDateColor,
  showMonthDropdown,
  showYearDropdown
}) => {
  const id = `DatePicker__${(name && name.replace(/\./g, '-')) || Math.random().toString(36).substr(2, 9)}`;
  const customCss = `
    ${baseCustomCss}
    .react-datepicker__input-container input.${id} {
      ${createDomStyle(themeInputStyle.text)}
      ${createDomStyle(themeInputStyle.border)}
      ${createDomStyle(themeInputStyle.opacity)}
      ${createDomStyle(themeInputStyle.background)}
    }
    .react-datepicker__day--selected,
    .react-datepicker__day--in-selecting-range,
    .react-datepicker__day--in-range,
    .react-datepicker__day--keyboard-selected,
    .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected {
      background-color: ${selectedDateColor || StyleSheet.flatten(themeInputStyle.selected).color};
    }
    ${(!showMonthDropdown || !showYearDropdown )? `
      .react-datepicker__current-month {
        display: none;
      }
      .react-datepicker__year-read-view--down-arrow, 
      .react-datepicker__month-read-view--down-arrow {
        margin-left: 5px;
      }
      .react-datepicker__year-read-view, 
      .react-datepicker__month-read-view {
        text-align: left;
        width: fit-content;
      }
      .react-datepicker__month-read-view {
        margin-right: 8px;
      }
      .react-datepicker__navigation--next,
      .react-datepicker__navigation--previous {
        top: 14px;
      }
    ` : ''}
    .react-datepicker__day--selected:hover,
    .react-datepicker__day--in-selecting-range:hover,
    .react-datepicker__day--in-range:hover,
    .react-datepicker__day--keyboard-selected:hover,
    .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected:hover {
      opacity: 0.8;
      background-color: ${selectedDateColor || StyleSheet.flatten(themeInputStyle.selected).color};
    }
    .react-datepicker-wrapper, .react-datepicker__input-container {
      width: 100%;
    }
    [data-class~="${id}"],
    .react-datepicker__input-container input.${id} {
      ${!auto ? 'width: 100%;' : ''}
    }
    ${!date ? `
      .react-datepicker__input-container input.${id}::placeholder {
        ${createDomStyle(themeInputStyle.placeholder)}
      }
    ` : ''}
  `;

  return [id, customCss];
};

const Datepicker = (props) => {
  const {
    auto,
    mode,
    format,
    placeholder,
    minDate,
    maxDate,
    disabled,
    readonly,
    excludeDates,
    css,
    date,
    onFocus,
    className,
    is24Hour,
    timeIntervals,
    showMonthDropdown,
    showYearDropdown,
  } = props;

  let currentFormat = format;
  if (!currentFormat) {
    switch (mode) {
      case 'time': currentFormat = 'h:mma'; break;
      case 'datetime': currentFormat = 'MM/DD/YYYY h:mma'; break;
      default: currentFormat = 'MM/DD/YYYY';
    }
  }

  const formats = FORMAT.concat([format]);
  const params = {
    ...props,
    formats,
    format: currentFormat,
  };

  const [autoComplete] = useState(`date-field-${Math.random().toString(36).substring(2, 9)}`);

  const [
    onRef,
    onChange,
    onChangeRaw,
    onBlur,
  ] = useEvents(params);

  const [id, customCss] = useCss(params);

  const selected = moment(date, formats);

  const currentStyle = [
    styles.datepicker,
    auto ? null : styles.fullWidth,
    props.style, // eslint-disable-line
  ];
  return (
    <View className={id}>
      <Helmet>
        <style>
          {`.react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle,.react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle,.react-datepicker__year-read-view--down-arrow,.react-datepicker__month-read-view--down-arrow,.react-datepicker__month-year-read-view--down-arrow{margin-left:-8px;position:absolute}.react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle,.react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle,.react-datepicker__year-read-view--down-arrow,.react-datepicker__month-read-view--down-arrow,.react-datepicker__month-year-read-view--down-arrow,.react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle::before,.react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle::before,.react-datepicker__year-read-view--down-arrow::before,.react-datepicker__month-read-view--down-arrow::before,.react-datepicker__month-year-read-view--down-arrow::before{box-sizing:content-box;position:absolute;border:8px solid transparent;height:0;width:1px}.react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle::before,.react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle::before,.react-datepicker__year-read-view--down-arrow::before,.react-datepicker__month-read-view--down-arrow::before,.react-datepicker__month-year-read-view--down-arrow::before{content:"";z-index:-1;border-width:8px;left:-8px;border-bottom-color:#aeaeae}.react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle{top:0;margin-top:-8px}.react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle,.react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle::before{border-top:0;border-bottom-color:#f0f0f0}.react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle::before{top:-1px;border-bottom-color:#aeaeae}.react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle,.react-datepicker__year-read-view--down-arrow,.react-datepicker__month-read-view--down-arrow,.react-datepicker__month-year-read-view--down-arrow{bottom:0;margin-bottom:-8px}.react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle,.react-datepicker__year-read-view--down-arrow,.react-datepicker__month-read-view--down-arrow,.react-datepicker__month-year-read-view--down-arrow,.react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle::before,.react-datepicker__year-read-view--down-arrow::before,.react-datepicker__month-read-view--down-arrow::before,.react-datepicker__month-year-read-view--down-arrow::before{border-bottom:0;border-top-color:#fff}.react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle::before,.react-datepicker__year-read-view--down-arrow::before,.react-datepicker__month-read-view--down-arrow::before,.react-datepicker__month-year-read-view--down-arrow::before{bottom:-1px;border-top-color:#aeaeae}.react-datepicker-wrapper{display:inline-block}.react-datepicker *{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:.8rem}.react-datepicker{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:.8rem;background-color:#fff;color:#000;border:1px solid #aeaeae;border-radius:.3rem;display:inline-block;position:relative}.react-datepicker--time-only .react-datepicker__triangle{left:35px}.react-datepicker--time-only .react-datepicker__time-container{border-left:0}.react-datepicker--time-only .react-datepicker__time{border-radius:.3rem}.react-datepicker--time-only .react-datepicker__time-box{border-radius:.3rem}.react-datepicker__triangle{position:absolute;left:50px}.react-datepicker-popper{z-index:1}.react-datepicker-popper[data-placement^="bottom"]{margin-top:10px}.react-datepicker-popper[data-placement^="top"]{margin-bottom:10px}.react-datepicker-popper[data-placement^="right"]{margin-left:8px}.react-datepicker-popper[data-placement^="right"] .react-datepicker__triangle{left:auto;right:42px}.react-datepicker-popper[data-placement^="left"]{margin-right:8px}.react-datepicker-popper[data-placement^="left"] .react-datepicker__triangle{left:42px;right:auto}.react-datepicker__header{text-align:center;background-color:#f0f0f0;border-bottom:1px solid #aeaeae;border-top-left-radius:.3rem;border-top-right-radius:.3rem;padding-top:8px;position:relative}.react-datepicker__header--time{padding-bottom:8px;padding-left:5px;padding-right:5px}.react-datepicker__year-dropdown-container--select,.react-datepicker__month-dropdown-container--select,.react-datepicker__month-year-dropdown-container--select,.react-datepicker__year-dropdown-container--scroll,.react-datepicker__month-dropdown-container--scroll,.react-datepicker__month-year-dropdown-container--scroll{display:inline-block;margin:0 2px}.react-datepicker__current-month,.react-datepicker-time__header{margin-top:0;color:#000;font-weight:bold;font-size:.944rem}.react-datepicker-time__header{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.react-datepicker__navigation{background:0;line-height:1.7rem;text-align:center;cursor:pointer;position:absolute;top:10px;width:0;padding:0;border:.45rem solid transparent;z-index:1;height:10px;width:10px;text-indent:-999em;overflow:hidden}.react-datepicker__navigation--previous{left:10px;border-right-color:#ccc}.react-datepicker__navigation--previous:hover{border-right-color:#b3b3b3}.react-datepicker__navigation--previous--disabled,.react-datepicker__navigation--previous--disabled:hover{border-right-color:#e6e6e6;cursor:default}.react-datepicker__navigation--next{right:10px;border-left-color:#ccc}.react-datepicker__navigation--next--with-time:not(.react-datepicker__navigation--next--with-today-button){right:80px}.react-datepicker__navigation--next:hover{border-left-color:#b3b3b3}.react-datepicker__navigation--next--disabled,.react-datepicker__navigation--next--disabled:hover{border-left-color:#e6e6e6;cursor:default}.react-datepicker__navigation--years{position:relative;top:0;display:block;margin-left:auto;margin-right:auto}.react-datepicker__navigation--years-previous{top:4px;border-top-color:#ccc}.react-datepicker__navigation--years-previous:hover{border-top-color:#b3b3b3}.react-datepicker__navigation--years-upcoming{top:-4px;border-bottom-color:#ccc}.react-datepicker__navigation--years-upcoming:hover{border-bottom-color:#b3b3b3}.react-datepicker__month-container{float:left}.react-datepicker__month{margin:.4rem;text-align:center}.react-datepicker__time-container{float:right;border-left:1px solid #aeaeae;width:70px}.react-datepicker__time-container--with-today-button{display:inline;border:1px solid #aeaeae;border-radius:.3rem;position:absolute;right:-72px;top:0}.react-datepicker__time-container .react-datepicker__time{position:relative;background:white}.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box{width:70px;overflow-x:hidden;margin:0 auto;text-align:center}.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list{list-style:none;margin:0;height:calc(195px + (1.7rem / 2));overflow-y:scroll;padding-right:0;padding-left:0;width:100%;box-sizing:content-box}.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item{height:30px;padding:5px 10px}.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item:hover{cursor:pointer;background-color:#f0f0f0}.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected{background-color:#216ba5;color:white;font-weight:bold}.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected:hover{background-color:#216ba5}.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--disabled{color:#ccc}.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--disabled:hover{cursor:default;background-color:transparent}.react-datepicker__week-number{color:#ccc;display:inline-block;width:1.7rem;line-height:1.7rem;text-align:center;margin:.166rem}.react-datepicker__week-number.react-datepicker__week-number--clickable{cursor:pointer}.react-datepicker__week-number.react-datepicker__week-number--clickable:hover{border-radius:.3rem;background-color:#f0f0f0}.react-datepicker__day-names,.react-datepicker__week{white-space:nowrap}.react-datepicker__day-name,.react-datepicker__day,.react-datepicker__time-name{color:#000;display:inline-block;width:1.7rem;line-height:1.7rem;text-align:center;margin:.166rem}.react-datepicker__day{cu.react-datepicker__navigation--nextnd-color:#3dcc4a;color:#fff}.react-datepicker__day--highlighted:hover{background-color:#32be3f}.react-datepicker__day--highlighted-custom-1{color:magenta}.react-datepicker__day--highlighted-custom-2{color:green}.react-datepicker__day--selected,.react-datepicker__day--in-selecting-range,.react-datepicker__day--in-range{border-radius:.3rem;background-color:#216ba5;color:#fff}.react-datepicker__day--selected:hover,.react-datepicker__day--in-selecting-range:hover,.react-datepicker__day--in-range:hover{background-color:#1d5d90}.react-datepicker__day--keyboard-selected{border-radius:.3rem;background-color:#2a87d0;color:#fff}.react-datepicker__day--keyboard-selected:hover{background-color:#1d5d90}.react-datepicker__day--in-selecting-range:not(.react-datepicker__day--in-range){background-color:rgba(33,107,165,0.5)}.react-datepicker__month--selecting-range .react-datepicker__day--in-range:not(.react-datepicker__day--in-selecting-range){background-color:#f0f0f0;color:#000}.react-datepicker__day--disabled{cursor:default;color:#ccc}.react-datepicker__day--disabled:hover{background-color:transparent}.react-datepicker__input-container{position:relative;display:inline-block}.react-datepicker__year-read-view,.react-datepicker__month-read-view,.react-datepicker__month-year-read-view{border:1px solid transparent;border-radius:.3rem}.react-datepicker__year-read-view:hover,.react-datepicker__month-read-view:hover,.react-datepicker__month-year-read-view:hover{cursor:pointer}.react-datepicker__year-read-view:hover .react-datepicker__year-read-view--down-arrow,.react-datepicker__year-read-view:hover .react-datepicker__month-read-view--down-arrow,.react-datepicker__month-read-view:hover .react-datepicker__year-read-view--down-arrow,.react-datepicker__month-read-view:hover .react-datepicker__month-read-view--down-arrow,.react-datepicker__month-year-read-view:hover .react-datepicker__year-read-view--down-arrow,.react-datepicker__month-year-read-view:hover .react-datepicker__month-read-view--down-arrow{border-top-color:#b3b3b3}.react-datepicker__year-read-view--down-arrow,.react-datepicker__month-read-view--down-arrow,.react-datepicker__month-year-read-view--down-arrow{border-top-color:#ccc;float:right;margin-left:20px;top:8px;position:relative;border-width:.45rem}.react-datepicker__year-dropdown,.react-datepicker__month-dropdown,.react-datepicker__month-year-dropdown{background-color:#f0f0f0;position:absolute;width:50%;left:25%;top:30px;z-index:1;text-align:center;border-radius:.3rem;border:1px solid #aeaeae}.react-datepicker__year-dropdown:hover,.react-datepicker__month-dropdown:hover,.react-datepicker__month-year-dropdown:hover{cursor:pointer}.react-datepicker__year-dropdown--scrollable,.react-datepicker__month-dropdown--scrollable,.react-datepicker__month-year-dropdown--scrollable{height:150px;overflow-y:scroll}.react-datepicker__year-option,.react-datepicker__month-option,.react-datepicker__month-year-option{line-height:20px;width:100%;display:block;margin-left:auto;margin-right:auto}.react-datepicker__year-option:first-of-type,.react-datepicker__month-option:first-of-type,.react-datepicker__month-year-option:first-of-type{border-top-left-radius:.3rem;border-top-right-radius:.3rem}.react-datepicker__year-option:last-of-type,.react-datepicker__month-option:last-of-type,.react-datepicker__month-year-option:last-of-type{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border-bottom-left-radius:.3rem;border-bottom-right-radius:.3rem}.react-datepicker__year-option:hover,.react-datepicker__month-option:hover,.react-datepicker__month-year-option:hover{background-color:#ccc}.react-datepicker__year-option:hover .react-datepicker__navigation--years-upcoming,.react-datepicker__month-option:hover .react-datepicker__navigation--years-upcoming,.react-datepicker__month-year-option:hover .react-datepicker__navigation--years-upcoming{border-bottom-color:#b3b3b3}.react-datepicker__year-option:hover .react-datepicker__navigation--years-previous,.react-datepicker__month-option:hover .react-datepicker__navigation--years-previous,.react-datepicker__month-year-option:hover .react-datepicker__navigation--years-previous{border-top-color:#b3b3b3}.react-datepicker__year-option--selected,.react-datepicker__month-option--selected,.react-datepicker__month-year-option--selected{position:absolute;left:15px}.react-datepicker__close-icon{background-color:transparent;border:0;cursor:pointer;outline:0;padding:0;vertical-align:middle;position:absolute;height:16px;width:16px;top:25%;right:7px}.react-datepicker__close-icon::after{background-color:#216ba5;border-radius:50%;bottom:0;box-sizing:border-box;color:#fff;content:"\\ud7";cursor:pointer;font-size:12px;height:16px;width:16px;line-height:1;margin:-8px auto 0;padding:2px;position:absolute;right:0;text-align:center}.react-datepicker__today-button{background:#f0f0f0;border-top:1px solid #aeaeae;cursor:pointer;text-align:center;font-weight:bold;padding:5px 0;clear:left}.react-datepicker__portal{position:fixed;width:100vw;height:100vh;background-color:rgba(0,0,0,0.8);left:0;top:0;justify-content:center;align-items:center;display:flex;z-index:2147483647}.react-datepicker__portal .react-datepicker__day-name,.react-datepicker__portal .react-datepicker__day,.react-datepicker__portal .react-datepicker__time-name{width:3rem;line-height:3rem}@media(max-width:400px),(max-height:550px){.react-datepicker__portal .react-datepicker__day-name,.react-datepicker__portal .react-datepicker__day,.react-datepicker__portal .react-datepicker__time-name{width:2rem;line-height:2rem}}.react-datepicker__portal .react-datepicker__current-month,.react-datepicker__portal .react-datepicker-time__header{font-size:1.44rem}.react-datepicker__portal .react-datepicker__navigation{border:.81rem solid transparent}.react-datepicker__portal .react-datepicker__navigation--previous{border-right-color:#ccc}.react-datepicker__portal .react-datepicker__navigation--previous:hover{border-right-color:#b3b3b3}.react-datepicker__portal .react-datepicker__navigation--previous--disabled,.react-datepicker__portal .react-datepicker__navigation--previous--disabled:hover{border-right-color:#e6e6e6;cursor:default}.react-datepicker__portal .react-datepicker__navigation--next{border-left-color:#ccc}.react-datepicker__portal .react-datepicker__navigation--next:hover{border-left-color:#b3b3b3}.react-datepicker__portal .react-datepicker__navigation--next--disabled,.react-datepicker__portal .react-datepicker__navigation--next--disabled:hover{border-left-color:#e6e6e6;cursor:default}${customCss}${css}`}
        </style>
      </Helmet>
      <RNDatepicker
        ref={onRef}
        className={`${id} ${className}`}
        selected={selected.isValid() ? selected.toDate() : null}
        dateFormat={currentFormat.replace(/Y/g, 'y').replace(/d/g, '<>').replace(/D/g, 'd').replace(/<>/g, 'D')}
        onChange={onChange}
        onChangeRaw={onChangeRaw}
        placeholderText={placeholder}
        popperPlacement="bottom"
        popperModifiers={popperModifiers}
        showTimeSelect={mode === 'time' || mode === 'datetime'}
        timeFormat={is24Hour ? 'HH:mm' : 'h:mma'}
        timeIntervals={timeIntervals}
        minDate={minDate ? moment(minDate, formats).toDate() : null}
        maxDate={maxDate ? moment(maxDate, formats).toDate() : null}
        disabled={disabled || readonly}
        excludeDates={excludeDates}
        onFocus={onFocus}
        onBlur={onBlur}
        style={currentStyle}
        strictParsing
        autoComplete={autoComplete}
        showMonthDropdown={showMonthDropdown}
        showYearDropdown={showYearDropdown}
      />
    </View>
  );
};

Datepicker.propTypes = {
  className: PropTypes.string,
  css: PropTypes.string,
  auto: PropTypes.bool,
  style: StylePropType,
  placeholder: PropTypes.string,
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  excludeDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  onFocus: PropTypes.func,
  onBlur: PropTypes.func, // eslint-disable-line
  mode: PropTypes.oneOf(['date', 'datetime', 'time']),
  format: PropTypes.string,
  is24Hour: PropTypes.bool,
  timeIntervals: PropTypes.number,
  showMonthDropdown: PropTypes.bool,
  showYearDropdown: PropTypes.bool,
};

Datepicker.defaultProps = {
  className: '',
  css: '',
  auto: false,
  style: null,
  placeholder: '',
  minDate: null,
  maxDate: null,
  disabled: false,
  readonly: false,
  date: null,
  excludeDates: [],
  onFocus: noop,
  onBlur: noop,
  mode: 'date',
  format: null,
  is24Hour: false,
  timeIntervals: 15,
  showMonthDropdown: true,
  showYearDropdown: true,
};

export default withTheme('Datepicker')(Datepicker);
