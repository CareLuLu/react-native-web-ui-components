import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Modal,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import styles from './style';
import Icon from '../../Icon';
import ScrollView from '../../ScrollView';
import TouchableOpacity from '../../TouchableOpacity';
import StylePropType from '../../StylePropType';

/* Code copied from react-native-modal-selector and adapted for our needs */

/* eslint react/forbid-prop-types:0 */
/* eslint react/no-did-update-set-state: 0 */
/* eslint react/forbid-foreign-prop-types: 0 */
/* eslint react/destructuring-assignment: 0 */

let componentIndex = 0;

const blankOr = (str) => {
  if (str === null || str === undefined) {
    return '';
  }
  return `${str}`;
};

const propTypes = {
  icon: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
  onModalOpen: PropTypes.func,
  onModalClose: PropTypes.func,
  keyExtractor: PropTypes.func,
  labelExtractor: PropTypes.func,
  visible: PropTypes.bool,
  initValue: PropTypes.node,
  animationType: PropTypes.string,
  style: StylePropType,
  selectStyle: StylePropType,
  selectTextStyle: Text.propTypes.style,
  optionStyle: StylePropType,
  optionTextStyle: Text.propTypes.style,
  optionContainerStyle: StylePropType,
  sectionStyle: StylePropType,
  childrenContainerStyle: StylePropType,
  touchableStyle: StylePropType,
  touchableActiveOpacity: PropTypes.number,
  sectionTextStyle: Text.propTypes.style,
  cancelContainerStyle: StylePropType,
  cancelStyle: StylePropType,
  cancelTextStyle: Text.propTypes.style,
  overlayStyle: StylePropType,
  cancelText: PropTypes.string,
  disabled: PropTypes.bool,
  supportedOrientations: PropTypes.arrayOf(PropTypes.string),
  keyboardShouldPersistTaps: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  backdropPressToClose: PropTypes.bool,
  accessible: PropTypes.bool,
  scrollViewAccessibilityLabel: PropTypes.string,
  cancelButtonAccessibilityLabel: PropTypes.string,
  passThruProps: PropTypes.object,
  modalOpenerHitSlop: PropTypes.object,
  children: PropTypes.node,
};

const defaultProps = {
  icon: 'align-justify',
  data: [],
  onChange: () => {},
  onModalOpen: () => {},
  onModalClose: () => {},
  keyExtractor: item => item.key,
  labelExtractor: item => blankOr(item.label),
  visible: false,
  initValue: 'Select me!',
  animationType: 'slide',
  style: {},
  selectStyle: {},
  selectTextStyle: {},
  optionStyle: {},
  optionTextStyle: {},
  optionContainerStyle: {},
  sectionStyle: {},
  childrenContainerStyle: {},
  touchableStyle: {},
  touchableActiveOpacity: 0.2,
  sectionTextStyle: {},
  cancelContainerStyle: {},
  cancelStyle: {},
  cancelTextStyle: {},
  overlayStyle: {},
  cancelText: 'cancel',
  disabled: false,
  supportedOrientations: ['portrait', 'landscape'],
  keyboardShouldPersistTaps: 'always',
  backdropPressToClose: false,
  accessible: false,
  scrollViewAccessibilityLabel: undefined,
  cancelButtonAccessibilityLabel: undefined,
  passThruProps: {},
  modalOpenerHitSlop: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  children: null,
};

export default class ModalSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: props.visible,
      selected: props.initValue,
    };
  }

  componentDidUpdate(prevProps) {
    const newState = {};
    let doUpdate = false;
    if (prevProps.initValue !== this.props.initValue) {
      newState.selected = this.props.initValue;
      doUpdate = true;
    }
    if (prevProps.visible !== this.props.visible) {
      newState.modalVisible = this.props.visible;
      doUpdate = true;
    }
    if (doUpdate) {
      this.setState(newState);
    }
  }

  onChange = (item) => {
    if (this.props.onChange(item) !== false) {
      this.setState({
        selected: this.props.labelExtractor(item),
        modalVisible: false,
      });
      this.close(false);
      return;
    }
    this.close();
  }

  close = (updateState = true) => {
    this.props.onModalClose();
    if (updateState) {
      this.setState({
        modalVisible: false,
      });
    }
  }

  open = () => {
    this.props.onModalOpen();
    this.setState({
      modalVisible: true,
    });
  }

  renderSection = section => (
    <View
      key={this.props.keyExtractor(section)}
      style={[styles.sectionStyle, this.props.sectionStyle]}
    >
      <Text
        style={[styles.sectionTextStyle, this.props.sectionTextStyle]}
      >
        {this.props.labelExtractor(section)}
      </Text>
    </View>
  );

  renderOption = (option, isLastItem) => (
    <TouchableOpacity
      key={this.props.keyExtractor(option)}
      onPress={() => this.onChange(option)}
      activeOpacity={this.props.touchableActiveOpacity}
      accessible={this.props.accessible}
      accessibilityLabel={option.accessibilityLabel || undefined}
      {...this.props.passThruProps}
    >
      <View
        style={[
          styles.optionStyle, this.props.optionStyle,
          isLastItem && { borderBottomWidth: 0 },
        ]}
      >
        <Text
          style={[styles.optionTextStyle, this.props.optionTextStyle]}
        >
          {this.props.labelExtractor(option)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  renderOptionList = () => {
    const options = this.props.data.map((item, index) => {
      if (item.section) {
        return this.renderSection(item);
      }
      return this.renderOption(item, index === this.props.data.length - 1);
    });

    const closeOverlay = this.props.backdropPressToClose;

    componentIndex += 1;
    return (
      <TouchableWithoutFeedback key={`modalSelector${componentIndex}`} onPress={() => closeOverlay && this.close()}>
        <View style={[styles.overlayStyle, this.props.overlayStyle]}>
          <View style={[styles.optionContainer, this.props.optionContainerStyle]}>
            <ScrollView
              style={styles.optionScrollView}
              keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps}
              accessible={this.props.accessible}
              accessibilityLabel={this.props.scrollViewAccessibilityLabel}
            >
              <View style={{ paddingHorizontal: 10 }}>
                {options}
              </View>
            </ScrollView>
          </View>
          <View style={[styles.cancelContainer, this.props.cancelContainerStyle]}>
            <TouchableOpacity
              onPress={this.close}
              activeOpacity={this.props.touchableActiveOpacity}
              accessible={this.props.accessible}
              accessibilityLabel={this.props.cancelButtonAccessibilityLabel}
            >
              <View style={[styles.cancelStyle, this.props.cancelStyle]}>
                <Text style={[styles.cancelTextStyle, this.props.cancelTextStyle]}>
                  {this.props.cancelText}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderChildren = () => {
    if (this.props.children) {
      return this.props.children;
    }
    return (
      <View style={[styles.selectStyle, this.props.selectStyle]}>
        <Text style={[styles.selectTextStyle, this.props.selectTextStyle]}>
          {blankOr(this.state.selected)}
          &nbsp;
        </Text>
        <Icon
          name={this.props.icon}
          style={[styles.selectTextIconStyle, this.props.selectTextStyle]}
        />
      </View>
    );
  }

  render() {
    const dp = (
      <Modal
        transparent
        ref={(element) => { this.model = element; }}
        supportedOrientations={this.props.supportedOrientations}
        visible={this.state.modalVisible}
        onRequestClose={this.close}
        animationType={this.props.animationType}
      >
        {this.renderOptionList()}
      </Modal>
    );
    return (
      <React.Fragment>
        {dp}
        <TouchableOpacity
          hitSlop={this.props.modalOpenerHitSlop}
          activeOpacity={this.props.touchableActiveOpacity}
          style={this.props.style}
          onPress={this.open}
          disabled={this.props.disabled}
        >
          {this.renderChildren()}
        </TouchableOpacity>
      </React.Fragment>
    );
  }
}

ModalSelector.propTypes = propTypes;
ModalSelector.defaultProps = defaultProps;
