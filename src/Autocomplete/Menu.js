import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView } from 'react-native';
import View from '../View';
import StylePropType from '../StylePropType';
import { withTheme } from '../Theme';
import DefaultItem from './Item';
import DefaultSpinner from './Spinner';
import DefaultEmptyResult from './EmptyResult';

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
    highlightMatches: PropTypes.bool.isRequired,
    theme: PropTypes.shape().isRequired,
    loading: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(PropTypes.any).isRequired,
    getItemValue: PropTypes.func.isRequired,
    getItemLabel: PropTypes.func.isRequired,
    highlightedIndex: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
    Item: PropTypes.elementType,
    style: StylePropType,
    itemStyle: StylePropType,
    itemActiveStyle: StylePropType,
    itemHeight: PropTypes.number,
    itemProps: PropTypes.shape(),
    Spinner: PropTypes.elementType,
    EmptyResult: PropTypes.elementType,
  };

  static defaultProps = {
    Item: DefaultItem,
    itemHeight: 30,
    Spinner: DefaultSpinner,
    EmptyResult: DefaultEmptyResult,
    style: null,
    itemStyle: null,
    itemActiveStyle: null,
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
      itemActiveStyle,
      itemProps,
      itemHeight,
      highlightedIndex,
      onSelect,
      getItemValue,
      getItemLabel,
      theme,
      Spinner,
      EmptyResult,
      highlightMatches,
    } = this.props;

    const themeInputStyle = theme.input.regular;
    const containerStyle = [
      styles.container,
      themeInputStyle.border,
      themeInputStyle.background,
      themeInputStyle.opacity,
      style,
    ];
    const { maxHeight, height } = StyleSheet.flatten(containerStyle);
    const fy = itemHeight * highlightedIndex;
    const currentHeight = Math.max(0, Math.min(maxHeight, height));

    const self = this;
    if (self.scrollView) {
      if (fy < this.y) {
        setTimeout(() => (self.scrollView && self.scrollView.scrollTo({ x: 0, y: fy })));
      } else if (fy + itemHeight > this.y + currentHeight) {
        setTimeout(() => (
          self.scrollView
          && self.scrollView.scrollTo({ x: 0, y: fy + itemHeight - currentHeight })
        ));
      }
    }
    return (
      <View className="Autocomplete__Menu" style={containerStyle}>
        <ScrollView
          style={themeInputStyle.background}
          scrollEventThrottle={1}
          onScroll={this.onScroll}
          ref={this.onRef}
        >
          {loading ? <Spinner key="spinner" /> : null}
          {items.map((item, i) => {
            const key = `${i}-${getItemValue(item)}`; // eslint-disable-line
            return (
              <Item
                {...this.props}
                item={item}
                index={i}
                key={key}
                text={`${getItemLabel(item)}`}
                active={highlightedIndex === i}
                onPress={onSelect}
                style={itemStyle}
                activeStyle={itemActiveStyle}
                highlightMatches={highlightMatches}
                {...itemProps}
              />
            );
          })}
          {!items.length && !loading ? <EmptyResult key="emptyResult" /> : null}
        </ScrollView>
      </View>
    );
  }
}

export default withTheme('AutocompleteMenu')(Menu);
