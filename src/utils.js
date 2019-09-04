import { useState } from 'react';
import each from 'lodash/each';

const maskOptions = {
  undefined: /^$/,
  a: /^[A-Za-zÀ-ÖØ-öø-ÿ]$/,
  9: /^[0-9]$/,
  '*': /^.$/,
};

const toFormat = (format, replaceMap) => {
  let f = [format];
  const replace = (str, rep) => {
    const n = [];
    for (let i = 0, l = f.length; i < l; i += 1) {
      if (typeof f[i] === 'string') {
        const t = f[i].split(str);
        const ll = t.length - 1;
        for (let j = 0; j < ll; j += 1) {
          n.push(t[j]);
          n.push([rep]); // replacement pushed as non-string
        }
        n.push(t[ll]);
      } else {
        // must be a replacement, don't process, just push
        n.push(f[i]);
      }
    }
    f = n;
  };

  each(replaceMap, (v, k) => {
    replace(k, v);
  });
  return f.join('');
};

export const isEmpty = value => (
  value === ''
  || value === null
  || value === undefined
);

export const isSSR = () => process.env.SERVER === '1';

export const blankOr = (value) => {
  if (value === undefined || value === null) {
    return '';
  }
  return `${value}`;
};

export const ucfirst = (text) => {
  if (!text) {
    return '';
  }
  return `${text[0].toUpperCase()}${text.substring(1)}`;
};

export const pick = (...args) => {
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] !== undefined && args[i] !== null) {
      return args[i];
    }
  }
  return args[args.length - 1];
};

export const formatMask = (text, mask) => {
  let result = '';
  let cursorText = 0;
  let cursorMask = 0;
  for (; cursorText < text.length; cursorText += 1) {
    let charText = text[cursorText];
    let charMask;
    let extras = '';
    do {
      charMask = mask[cursorMask];
      cursorMask += 1;
      if (!(charMask in maskOptions)) {
        extras += charMask;
        if (charMask === charText) {
          cursorText += 1;
          charText = text[cursorText] || '';
          result += extras;
          extras = '';
        }
      }
    } while (!(charMask in maskOptions));
    if (maskOptions[charMask].test(charText)) {
      result += extras + charText;
    }
  }
  return result;
};

export const dasherize = txt => (txt || '').trim().replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();

export const toDescription = (originalText, threshold, ending = '') => {
  const text = blankOr(originalText || '').trim();
  if (text.length <= threshold) {
    return text;
  }
  for (let i = threshold - 1; i >= 0; i -= 1) {
    if (/^\s/.test(text.substr(i, 1))) {
      return text.substr(0, i) + ending;
    }
  }
  return text;
};

export const parseTime = (timeNumber) => {
  const value = parseInt(timeNumber, 10);
  const time = {
    MIX: '',
    HHHH: '',
    HHH: '',
    HH: '',
    H: '',
    MM: '',
    M: '',
    AA: '',
    AP: '',
    A: '',
  };
  if (Number.isNaN(value)) {
    return time;
  }
  if (value === 720) {
    time.MIX = 'Noon';
    time.HHHH = '12';
    time.HHH = '12';
    time.HH = '12';
    time.H = '12';
    time.MM = '00';
    time.M = '0';
    time.AA = 'PM';
    time.A = 'pm';
    time.AP = 'p';
  } else if (value === 1440) {
    time.MIX = 'Midnight';
    time.HHHH = '00';
    time.HHH = '0';
    time.HH = '00';
    time.H = '0';
    time.MM = '00';
    time.M = '0';
    time.AA = 'AM';
    time.A = 'am';
    time.AP = 'a';
  } else {
    let h = (value - 720 > 59) ? (value - 720) : value;
    if (h < 60) h += 720;
    const m = blankOr(h % 60);
    h = blankOr(Math.floor(h / 60));
    const a = (value >= 720) ? 'pm' : 'am';
    time.HHH = Math.floor(value / 60);
    time.HHHH = blankOr(time.HHH > 10 ? time.HHH : `0${time.HHH}`);
    time.HHH = blankOr(time.HHH);
    time.HH = blankOr(h >= 10 ? h : `0${h}`);
    time.H = blankOr(h);
    time.MMM = blankOr(m >= 10 ? m : `0${m}`);
    time.MM = blankOr(m >= 10 ? m : `0${m}`);
    time.M = blankOr(m);
    time.AA = a.toUpperCase();
    time.A = a;
    time.AP = a.replace(/m/i, '');
    time.MIX = `${time.H}:${time.MM}${time.A}`;
  }
  return time;
};

export const toTime = (value, format = 'MIX') => {
  if (value === '' || value === null || value === undefined) {
    return '';
  }
  return toFormat(format, parseTime(value));
};

export const escapeRegExp = text => blankOr(text).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

export const useDerivedState = (prop) => {
  const [value, setValue] = useState(prop);
  const [valueProp, setValueProp] = useState(prop);

  if (prop !== valueProp) {
    setTimeout(() => {
      setValue(prop);
      setValueProp(prop);
    });
  }
  return [value, setValue];
};
