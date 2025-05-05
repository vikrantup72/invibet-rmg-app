import { baseColors } from '../../constants/colors';
import { Div } from 'react-native-magnus';

export function Dots(props: { index: number; max: number }) {
  return (
    <Div alignItems="center" flexDir="row" justifyContent="center">
      {Array.from({ length: props.max }).map((_, index) => (
        <Div
          h={7}
          w={7}
          mr={6}
          key={index}
          style={{ borderRadius: 5 }}
          bg={props.index === index + 1 ? baseColors.yellowPrimary : baseColors.themeLight}
        />
      ))}
    </Div>
  );
}
