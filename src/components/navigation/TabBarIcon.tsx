import { type IconProps } from 'react-native-vector-icons/Icon';
import Ionicons from 'react-native-vector-icons/Ionicons';

export function TabBarIcon({ style, ...rest }: IconProps) {
  return <Ionicons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
}
