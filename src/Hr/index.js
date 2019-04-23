import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../Theme';
import Container from '../Container';
import View from '../View';
import Text from '../Text';

const Hr = (props) => {
  const {
    text,
    color,
    thickness,
    marginTop,
    marginBottom,
    shadow,
  } = props;

  let textShadowStyle;
  let shadowStyle;

  if (shadow) {
    textShadowStyle = {
      textShadowColor: shadow.color,
      textShadowOffset: { width: shadow.offset.width, height: shadow.offset.height },
      textShadowRadius: shadow.radius,
    };

    shadowStyle = {
      shadowColor: shadow.color,
      shadowOffset: { width: shadow.offset.width, height: shadow.offset.height },
      shadowRadius: shadow.radius,
    };
  }

  return (
    <Container style={
      {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop,
        marginBottom,
      }
    }
    >
      <View style={
        {
          flex: 0.5,
          backgroundColor: color,
          height: thickness,
          width: '100%',
          alignSelf: 'center',
          ...shadowStyle,
        }
      }
      />
      {text !== null ? (
        <Text type={color} auto style={{ color, ...textShadowStyle }}>
        &nbsp;
          { text }
        &nbsp;
        </Text>
      ) : null}
      <View style={
        {
          flex: 0.5,
          backgroundColor: color,
          height: thickness,
          width: '100%',
          alignSelf: 'center',
          ...shadowStyle,
        }
      }
      />
    </Container>
  );
};

Hr.propTypes = {
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  color: PropTypes.string,
  thickness: PropTypes.number,
  marginTop: PropTypes.number,
  marginBottom: PropTypes.number,
  shadow: PropTypes.shape({
    color: PropTypes.string.isRequired,
    offset: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
    radius: PropTypes.number.isRequired,
  }),
};

Hr.defaultProps = {
  text: null,
  color: '#FFFFFF',
  thickness: 1,
  marginTop: 1,
  marginBottom: 1,
  shadow: null,
};

export default withTheme('Hr')(Hr);
