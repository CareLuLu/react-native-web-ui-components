import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Permissions from 'expo-permissions';
import noop from 'lodash/noop';
import last from 'lodash/last';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import View from '../View';
import Text from '../Text';
import TouchableOpacity from '../TouchableOpacity';

const styles = StyleSheet.create({
  container: {
    borderWidth: 5,
    borderStyle: 'dashed',
    borderColor: '#E0E0E0',
    width: '100%',
    minHeight: 150,
  },
  inner: {},
  touchable: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    padding: '5%',
    justifyContent: 'center',
    backgroundColor: 'rgba(100, 100, 100, 0.7)',
  },
  optionContainer: {
    borderRadius: 5,
    flexShrink: 1,
    marginBottom: 8,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  option: {
    padding: 8,
  },
  optionBorder: {
    borderTopWidth: 1,
    borderTopColor: '#CCC',
  },
  optionText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'rgba(0,118,255,0.9)',
  },
  cancelContainer: {
    alignSelf: 'stretch',
  },
  cancel: {
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 8,
  },
  cancelText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 16,
  },
});

const videoRegex = /^(\*|video\/)/i;
const imageRegex = /^(\*|image\/)/i;
const imageVideoRegex = /^(\*|(image|video)\/)/i;
const extensionRegex = /\.(\w+)$/;
const imageExtensionRegex = /^(jpg|jpeg|png|gif|bmp)$/i;
const videoExtensionRegex = /^(mp4|m4a|m4v|f4v|f4a|m4b|m4r|f4b|mov|3gp|3gp2|3g2|3gpp|3gpp2|ogg|oga|ogv|ogx|wmv|wma|asf*|flv|avi*|wav*|mpeg*)$/i;

const hasMimeType = (accept, regex) => accept.filter(mime => regex.test(mime)).length;

const getMime = ({ uri, type }) => {
  const match = extensionRegex.exec(uri);
  const extension = match ? `${match[1]}` : '';
  let prefix = type;
  if (!prefix) {
    if (imageExtensionRegex.test(extension)) {
      prefix = 'image';
    } else if (videoExtensionRegex.test(extension)) {
      prefix = 'video';
    } else {
      prefix = 'application';
    }
  }
  let mime = `${prefix}${extension ? `/${extension}` : ''}`;
  if (mime === 'application') {
    mime += '/octet-stream';
  }
  return mime;
};

const getMediaTypes = (accept) => {
  const video = !!hasMimeType(accept, videoRegex);
  const image = !!hasMimeType(accept, imageRegex);
  let mediaTypes;
  if (image && video) {
    mediaTypes = 'All';
  } else if (!video) {
    mediaTypes = 'Images';
  } else {
    mediaTypes = 'Videos';
  }
  return mediaTypes;
};

const toFile = result => ({
  ...result,
  type: getMime(result),
  name: result.name || last(result.uri.split('/')),
});

const SelectionOption = ({ text, index, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.option, index > 0 ? styles.optionBorder : null]}>
      <Text style={styles.optionText}>{text}</Text>
    </View>
  </TouchableOpacity>
);

SelectionOption.propTypes = {
  index: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const CancelOption = ({ text, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.cancel}>
      <Text style={styles.cancelText}>{text}</Text>
    </View>
  </TouchableOpacity>
);

CancelOption.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

class Dropzone extends React.Component {
  static propTypes = {
    theme: PropTypes.shape().isRequired,
    accept: PropTypes.arrayOf(PropTypes.string),
    onDrop: PropTypes.func,
    style: StylePropType,
    cameraText: PropTypes.string,
    albumText: PropTypes.string,
    fileText: PropTypes.string,
    cancelText: PropTypes.string,
    disabled: PropTypes.bool,
    children: PropTypes.node,
    onRef: PropTypes.func,
  };

  static defaultProps = {
    accept: ['*/*'],
    onDrop: noop,
    style: null,
    cameraText: 'Camera',
    albumText: 'Photo & Video Library',
    fileText: 'File',
    cancelText: 'Cancel',
    disabled: false,
    children: null,
    onRef: noop,
  };

  constructor(props) {
    super(props);

    const { onRef } = this.props;
    onRef(this);

    this.onDismiss = null;
    this.state = {
      step: '',
    };
  }

  hasPicker = () => !!this.onDismiss;

  selectMime = () => {
    const { disabled, accept } = this.props;

    const acceptsImageVideo = !!hasMimeType(accept, imageVideoRegex);

    if (!disabled) {
      if (acceptsImageVideo) {
        this.setState({ step: 'mime' });
      } else {
        this.pickDocument();
      }
    }
  };

  cancelMimeSelection = () => this.setState({ step: 'dropzone' });

  pickDocument = () => {
    const { accept, onDrop } = this.props;

    this.onDismiss = async () => {
      this.onDismiss = null;
      this.setState({ step: '' }, async () => {
        const result = await DocumentPicker.getDocumentAsync({ type: accept.join(',') });
        if (result.type === 'success') {
          onDrop([toFile({ ...result, type: '' })]);
        }
      });
    };
    this.setState({ step: 'dropzone' });
  };

  pickImage = () => {
    const { accept, onDrop } = this.props;

    this.onDismiss = async () => {
      this.onDismiss = null;
      this.setState({ step: '' }, async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status === 'granted') {
          const { cancelled, ...result } = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: getMediaTypes(accept),
          });
          if (!cancelled) {
            onDrop([toFile({ ...result })]);
          }
        }
      });
    };
    this.setState({ step: 'dropzone' });
  };

  pickPhoto = () => {
    const { accept, onDrop } = this.props;

    this.onDismiss = async () => {
      this.onDismiss = null;
      this.setState({ step: '' }, async () => {
        const { status } = await Permissions.askAsync(
          Permissions.CAMERA_ROLL,
          Permissions.CAMERA,
        );
        if (status === 'granted') {
          const { cancelled, ...result } = await ImagePicker.launchCameraAsync({});
          if (!cancelled) {
            const mediaTypes = getMediaTypes(accept);
            if (
              mediaTypes === 'All'
              || (mediaTypes === 'Image' && imageExtensionRegex.test(result.uri))
              || (mediaTypes === 'Video' && videoExtensionRegex.test(result.uri))
            ) {
              onDrop([toFile({ ...result })]);
            }
          }
        }
      });
    };
    this.setState({ step: 'dropzone' });
  };

  open = () => this.selectMime();

  render() {
    const {
      theme,
      style,
      accept,
      disabled,
      fileText,
      albumText,
      cameraText,
      cancelText,
      children,
    } = this.props;

    const { step } = this.state;

    const acceptsImageVideo = !!hasMimeType(accept, imageVideoRegex);

    const selectionOptions = acceptsImageVideo ? [
      [cameraText, this.pickPhoto],
      [albumText, this.pickImage],
      [fileText, this.pickDocument],
    ] : [
      [fileText, this.pickDocument],
    ];

    if (Platform.OS !== 'ios' && this.hasPicker()) {
      setTimeout(() => (this.onDismiss && this.onDismiss()), 1000);
    }
    const currentStyle = [styles.container];
    if (disabled) {
      currentStyle.push(theme.input.disabled.opacity);
    }
    return (
      <TouchableWithoutFeedback onPress={this.selectMime}>
        <View style={[currentStyle, style]}>
          <Modal
            transparent
            visible={step === 'mime'}
            onRequestClose={this.cancelMimeSelection}
            animationType="slide"
            onDismiss={this.onDismiss || noop}
          >
            <TouchableWithoutFeedback onPress={this.cancelMimeSelection}>
              <View style={styles.overlay}>
                <View style={styles.optionContainer}>
                  {selectionOptions.map(([text, onPress], index) => (
                    <SelectionOption key={text} index={index} text={text} onPress={onPress} />
                  ))}
                </View>
                <View style={styles.cancelContainer}>
                  <CancelOption text={cancelText} onPress={this.cancelMimeSelection} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          <View style={styles.inner}>
            {children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default withTheme('Dropzone')(Dropzone);
