import { baseColors } from '../../constants/colors';
import { Div, Text } from 'react-native-magnus';
import { Circle, Svg } from 'react-native-svg';
import AppFonts from '../../constants/fonts';

const radius = 40;
const circumference = 2 * Math.PI * radius;

export function IndexTop(props: { index: number; max: number }) {
  const strokeDashoffset = circumference - circumference * (props.index / props.max);

  return (
    <Div w={100} h={70} bg={baseColors.white} rounded="circle" alignItems="center" justifyContent="center"  >
      <Svg height="100" width="100" viewBox="0 0 120 120" rotation={-90}>
        <Circle cy={60} cx={60} r={radius} fill="none" strokeWidth={1} stroke={baseColors.btn_disable} />
        <Circle
          cx={59}
          cy={59}
          r={radius}
          fill="none"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          stroke={baseColors.circle_pbar}
          strokeDashoffset={strokeDashoffset}
        />
      </Svg>

      <Div position="absolute">
        <Text style={{fontFamily: AppFonts.semibold,fontWeight: '600'}} fontSize="5xl" color={baseColors.theme}>
          {props.index}
        </Text>
      </Div>
    </Div>
  );
}
