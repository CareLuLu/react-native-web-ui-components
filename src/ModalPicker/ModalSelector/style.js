import { StyleSheet } from 'react-native';

const PADDING = 8;
const BORDER_RADIUS = 5;
const FONT_SIZE = 16;
const HIGHLIGHT_COLOR = 'rgba(0,118,255,0.9)';

export default StyleSheet.create({
  overlayStyle: {
    flex: 1,
    padding: '5%',
    justifyContent: 'center',
    backgroundColor: 'rgba(100, 100, 100, 0.7)',
  },

  optionContainer: {
    borderRadius: BORDER_RADIUS,
    flexShrink: 1,
    marginBottom: 8,
    padding: PADDING,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },

  optionScrollView: {
    backgroundColor: 'transparent',
  },

  cancelContainer: {
    alignSelf: 'stretch',
  },

  touchableStyle: {},

  selectStyle: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: PADDING,
    borderRadius: BORDER_RADIUS,
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: '100%',
  },

  selectTextStyle: {
    textAlign: 'center',
    color: '#333',
    maxWidth: '90%',
    overflow: 'hidden',
    fontSize: FONT_SIZE,
  },

  selectTextIconStyle: {
    textAlign: 'right',
    color: '#333',
    paddingRight: 5,
    fontSize: FONT_SIZE,
  },

  cancelStyle: {
    borderRadius: BORDER_RADIUS,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: PADDING,
  },

  cancelTextStyle: {
    textAlign: 'center',
    color: '#333',
    fontSize: FONT_SIZE,
  },

  optionStyle: {
    padding: PADDING,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  optionTextStyle: {
    textAlign: 'center',
    fontSize: FONT_SIZE,
    color: HIGHLIGHT_COLOR,
  },

  sectionStyle: {
    padding: PADDING * 2,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  sectionTextStyle: {
    textAlign: 'center',
    fontSize: FONT_SIZE,
  },
});
