import { ReactNode } from 'react';
import { Component, createRef, RefObject } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { FlatList, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';

export type Element = {
  index: number;
};

export type ListSliderProps = {
  value: number;
  onValueChange: (val: number) => void;
  thumb: ReactNode;
  thumbStyle?: StyleProp<ViewStyle>;
  multiplicity: number;
  decimalPlaces?: number;
  arrayLength: number;
  scrollEnabled: boolean;
  mainContainerStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  tenthItemStyle?: StyleProp<ViewStyle>;
  initialPositionValue: number;
  maximumValue?: number;
};

export type ListSliderState = {
  value: number;
  width: number;
  items: Array<number>;
  oneItemWidth: number;
};

const itemAmountPerScreen = 20;
const borderWidth = 1;

export class ListSlider extends Component<ListSliderProps, ListSliderState> {
  flatListRef: RefObject<FlatList<any>> = createRef();

  static defaultProps = {
    multiplicity: 0.1,
    decimalPlaces: 1,
    arrayLength: 10000,
    scrollEnabled: true,
    mainContainerStyle: null,
    itemStyle: null,
    tenthItemStyle: null,
    initialPositionValue: 0,
  };

  constructor(props: ListSliderProps) {
    super(props);
    this.state = {
      items: this.generateArrayBlock(),
      width: 0,
      oneItemWidth: 0,
      value: props.initialPositionValue,
    };
  }

  shouldComponentUpdate(nextProps: Readonly<ListSliderProps>, nextState: Readonly<ListSliderState>, nextContext: any): boolean {
    const { width } = this.state;

    if (width === 0 && nextState.width !== 0) return true;
    if (nextProps.value !== nextState.value) {
      this.setState({ value: nextProps.value });
      this.scrollToElement(nextProps.value);
    }
    return false;
  }

  onLayout = (event: LayoutChangeEvent) => {
    this.setState({
      width: event.nativeEvent.layout.width,
      oneItemWidth: Math.round(event.nativeEvent.layout.width / itemAmountPerScreen),
    });
    this.init();
  };

  onSliderMoved = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { oneItemWidth } = this.state;
    const { onValueChange, initialPositionValue, maximumValue, decimalPlaces } = this.props;

    let newValue = initialPositionValue + Math.floor(event.nativeEvent.contentOffset.x / oneItemWidth) * this.props.multiplicity;
    if (maximumValue && newValue > maximumValue) newValue = maximumValue;

    const setValue = parseFloat(parseFloat(newValue.toString()).toFixed(decimalPlaces));
    this.setState({ value: setValue });
    onValueChange(setValue);
  };

  generateArrayBlock = (): Array<number> => {
    const { arrayLength, maximumValue, multiplicity } = this.props;
    let length = arrayLength;

    if (maximumValue) {
      length = maximumValue / multiplicity;
      length += itemAmountPerScreen;
    }
    return new Array(length).fill(0);
  };

  init = () => {
    setTimeout(() => this.scrollToElement(this.props.value), 100);
  };

  scrollToElement = (value: number) => {
    if (!this.flatListRef.current) return;
    this.flatListRef.current.scrollToOffset({
      offset: (value * this.state.oneItemWidth) / this.props.multiplicity,
      animated: false,
    });
  };

  render() {
    const { thumb, scrollEnabled, mainContainerStyle } = this.props;
    const { items, width } = this.state;

    return (
      <View style={[{ width: '100%', height: 30, position: 'relative' }, mainContainerStyle]} onLayout={this.onLayout}>
        <FlatList
          style={{ flex: 1 }}
          ref={this.flatListRef}
          getItemLayout={(data, index) => ({
            length: this.state.oneItemWidth,
            offset: this.state.oneItemWidth * index,
            index,
          })}
          scrollEnabled={scrollEnabled}
          data={width === 0 ? [] : items}
          keyboardShouldPersistTaps="always"
          horizontal
          onScrollEndDrag={this.onSliderMoved}
          onScroll={this.onSliderMoved}
          onMomentumScrollBegin={this.onSliderMoved}
          onMomentumScrollEnd={this.onSliderMoved}
          keyExtractor={(element, index) => index.toString()}
          renderItem={(element: Element) => (
            <View
              style={[
                {
                  height: 55,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  borderColor: '#979797',
                  backgroundColor: 'transparent',
                },
                { width: this.state.oneItemWidth, borderRightWidth: borderWidth },
                (element.index + 1) % 10 === 0 ? { borderRightWidth: borderWidth + 2, height: 70 } : null,
                this.props.itemStyle,
                (element.index + 1) % 10 === 0 ? this.props.tenthItemStyle : null,
              ]}
            />
          )}
          showsHorizontalScrollIndicator={false}
        />
        {thumb}
      </View>
    );
  }
}
