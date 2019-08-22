import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  DocumentPicker,
  ImagePicker,
  Permissions,
} from 'expo';
import withProps from 'recompact/withProps';
import withHandlers from 'recompact/withHandlers';
import withState from 'recompact/withState';
import compose from 'recompact/compose';
import noop from 'lodash/noop';
import last from 'lodash/last';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import View from '../View';
import Text from '../Text';
import TouchableOpacity from '../TouchableOpacity';
import TouchableWithoutFeedback from '../TouchableWithoutFeedback';

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
    mediaTypes = 'Image';
  } else {
    mediaTypes = 'Video';
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

const Dropzone = compose(
  withProps(({ accept }) => ({
    acceptsImageVideo: !!hasMimeType(accept, imageVideoRegex),
  })),
  withState('step', 'setStep', 'dropzone'),
  withHandlers(() => {
    const handlers = {
      onDismiss: null,
    };
    return {
      hasPicker: () => () => !!handlers.onDismiss,
      onDismiss: () => () => (handlers.onDismiss && handlers.onDismiss()),
      pickDocument: ({ setStep, accept, onDrop }) => () => {
        setStep('dropzone');
        handlers.onDismiss = async () => {
          handlers.onDismiss = null;
          const result = await DocumentPicker.getDocumentAsync({ type: accept.join(',') });
          if (result.type === 'success') {
            onDrop([toFile({ ...result, type: '' })]);
          }
        };
      },
      pickImage: ({ setStep, accept, onDrop }) => () => {
        setStep('dropzone');
        handlers.onDismiss = async () => {
          handlers.onDismiss = null;
          const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          if (status === 'granted') {
            const { cancelled, ...result } = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: getMediaTypes(accept),
            });
            if (!cancelled) {
              onDrop([toFile({ ...result })]);
            }
          }
        };
      },
      pickPhoto: ({ setStep, accept, onDrop }) => () => {
        setStep('dropzone');
        handlers.onDismiss = async () => {
          handlers.onDismiss = null;
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
        };
      },
    };
  }),
  withHandlers({
    selectMime: ({
      disabled,
      setStep,
      acceptsImageVideo,
      pickDocument,
    }) => () => {
      if (!disabled) {
        if (acceptsImageVideo) {
          setStep('mime');
        } else {
          pickDocument();
        }
      }
    },
    cancelMimeSelection: ({ setStep }) => () => setStep('dropzone'),
  }),
  withProps(({
    acceptsImageVideo,
    pickPhoto,
    pickImage,
    pickDocument,
    cameraText,
    albumText,
    fileText,
  }) => ({
    selectionOptions: acceptsImageVideo ? [
      [cameraText, pickPhoto],
      [albumText, pickImage],
      [fileText, pickDocument],
    ] : [
      [fileText, pickDocument],
    ],
  })),
)(({
  theme,
  disabled,
  step,
  style,
  children,
  selectMime,
  cancelMimeSelection,
  onModalMounted,
  selectionOptions,
  cancelText,
  onDismiss,
  hasPicker,
}) => {
  if (Platform.OS !== 'ios' && hasPicker()) {
    setTimeout(() => onDismiss(), 1000);
  }
  const currentStyle = [styles.container];
  if (disabled) {
    currentStyle.push(theme.input.disabled.opacity);
  }
  return (
    <TouchableWithoutFeedback onPress={selectMime}>
      <View style={[currentStyle, style]}>
        <Modal
          transparent
          ref={onModalMounted}
          visible={step === 'mime'}
          onRequestClose={cancelMimeSelection}
          animationType="slide"
          onDismiss={onDismiss}
        >
          <TouchableWithoutFeedback onPress={cancelMimeSelection}>
            <View style={styles.overlay}>
              <View style={styles.optionContainer}>
                {selectionOptions.map(([text, onPress], index) => (
                  <SelectionOption key={text} index={index} text={text} onPress={onPress} />
                ))}
              </View>
              <View style={styles.cancelContainer}>
                <CancelOption text={cancelText} onPress={cancelMimeSelection} />
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
});

Dropzone.propTypes = {
  theme: PropTypes.shape().isRequired,
  accept: PropTypes.arrayOf(PropTypes.string),
  onDrop: PropTypes.func,
  style: StylePropType,
  cameraText: PropTypes.string,
  albumText: PropTypes.string,
  fileText: PropTypes.string,
  cancelText: PropTypes.string,
  disabled: PropTypes.bool,
};

Dropzone.defaultProps = {
  accept: ['*/*'],
  onDrop: noop,
  style: null,
  cameraText: 'Camera',
  albumText: 'Photo & Video Library',
  fileText: 'File',
  cancelText: 'Cancel',
  disabled: false,
};

export default withTheme('Dropzone')(Dropzone);
