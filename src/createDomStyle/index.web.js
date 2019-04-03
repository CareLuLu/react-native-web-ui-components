import map from 'lodash/map';
import { StyleSheet } from 'react-native';
import createReactDOMStyle from 'react-native-web/dist/exports/StyleSheet/createReactDOMStyle';
import { dasherize } from '../utils';

const createDomStyle = (style) => {
  const css = StyleSheet.flatten(style);
  return map(createReactDOMStyle(css), (v, k) => `${dasherize(k)}: ${v};`).join('');
};

export default createDomStyle;
