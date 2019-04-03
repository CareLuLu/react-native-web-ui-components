import { Platform } from 'react-native';

const WebOnly = (props) => {
  if (Platform.OS === 'web') {
    return props.children;
  }
  return null;
};

export default WebOnly;
