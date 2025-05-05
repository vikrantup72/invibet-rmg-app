import { baseColors } from '../../constants/colors';
import { Div, Text, TextProps } from 'react-native-magnus';

export function Description(props: { title: string; description?: string; textProps?: TextProps }) {
  return (
    <>
      <Text mb={5} fontSize="2xl" fontWeight="500" textAlign="center" color={baseColors.white} {...props.textProps}>
        {props.title}
      </Text>
      <Text mb="xl" maxW={300} fontSize={14} textAlign="center" color={baseColors.white} {...props.textProps}>
        {props.description}
      </Text>
    </>
  );
}

export function BrandLogo() {
  return <Div h={100} w={100} bg={baseColors.theme} rounded="circle" />;
}
