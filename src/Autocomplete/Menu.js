import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView } from 'react-native';
import View from '../View';
import StylePropType from '../StylePropType';
import Spinner from '../Spinner';
import { withTheme } from '../Theme';
import Text from '../Text';
import DefaultItem from './Item';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    zIndex: 1,
  },
  noSuggestions: {
    padding: 5,
    height: 30,
    opacity: 0.7,
  },
});

class Menu extends React.PureComponent {
  static propTypes = {
    theme: PropTypes.shape().isRequired,
    loading: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(PropTypes.any).isRequired,
    getItemValue: PropTypes.func.isRequired,
    highlightedIndex: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
    Item: PropTypes.elementType,
    style: StylePropType,
    itemStyle: StylePropType,
    itemHeight: PropTypes.number,
    itemProps: PropTypes.shape(),
  };

  static defaultProps = {
    Item: DefaultItem,
    itemHeight: 30,
    style: null,
    itemStyle: null,
    itemProps: {},
  };

  constructor(props) {
    super(props);
    this.y = 0;
  }

  onRef = (ref) => {
    this.scrollView = ref;
  };

  onScroll = (event) => {
    this.y = event.nativeEvent.contentOffset.y;
  };

  render() {
    const {
      style,
      loading,
      items,
      Item,
      itemStyle,
      itemHeight,
      itemProps,
      highlightedIndex,
      onSelect,
      getItemValue,
      theme,
    } = this.props;

    const themeInputStyle = theme.input.regular;
    const containerStyle = [
      styles.container,
      themeInputStyle.border,
      themeInputStyle.background,
      themeInputStyle.opacity,
      { height: (Math.max(items.length, 1) * itemHeight) + 2 },
      style,
    ];
    const { maxHeight, height } = StyleSheet.flatten(containerStyle);
    const fy = itemHeight * highlightedIndex;
    const currentHeight = Math.max(0, Math.min(maxHeight, height));

    const { scrollView } = this;
    if (this.scrollView) {
      if (fy < this.y) {
        setTimeout(() => scrollView.scrollTo({ x: 0, y: fy }));
      } else if (fy + itemHeight > this.y + currentHeight) {
        setTimeout(() => scrollView.scrollTo({ x: 0, y: fy + itemHeight - currentHeight }));
      }
    }

    return (
      <View style={containerStyle}>
        <ScrollView
          ref={this.onRef}
          style={themeInputStyle.background}
          scrollEventThrottle={1}
          onScroll={this.onScroll}
        >
          {loading ? <Spinner /> : null}
          {items.length ? items.map((item, i) => (
            <Item
              {...this.props}
              item={item}
              index={i}
              key={getItemValue(item)}
              text={`${getItemValue(item)}`}
              active={highlightedIndex === i}
              onPress={onSelect}
              style={itemStyle}
              {...itemProps}
            />
          )) : (
            <Text style={styles.noSuggestions}>No suggestions...</Text>
          )}
        </ScrollView>
      </View>
    );
  }
}

export default withTheme('AutocompleteMenu')(Menu);
