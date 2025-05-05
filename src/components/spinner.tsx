import { baseColors } from '../constants/colors';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { Text } from 'react-native-magnus';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

type SpinnerProps = {
  color?: string;
};

export function Spinner(props: SpinnerProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.transformOriginView, { transform: [{ rotate: spin }] }]}>
      <Text>
        <FontAwesome name="spinner" size={20} color={props.color || baseColors.white} />
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  transformOriginView: {
    backgroundColor: 'transparent',
    transformOrigin: [10, 10, 0],
  },
});
