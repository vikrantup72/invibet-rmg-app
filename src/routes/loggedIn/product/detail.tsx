import { RoundedTopBar } from '../../../components/loginFlow/roundedTopBar';
import { baseColors } from '../../../constants/colors';
import { LoggedInStackParamsList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Div, Image } from 'react-native-magnus';

export function ProductDetail({ navigation }: NativeStackScreenProps<LoggedInStackParamsList, 'product/detail'>) {
  return (
    <Div bg={baseColors.white} h="100%">
      <RoundedTopBar optionalBackUrl="product/whatSettingUp" title="Tychee - Band 6.0" />

      <Div row mt={150} mx="md" w="100%" alignItems="center" justifyContent="center">
        <Image w={250} h={450} source={require('../../../../assets/images/watches/tychee6.0.png')} rounded={8} />
      </Div>

      <Div position="absolute" bottom={30} w="100%" flexDir="column">
        <Button
          mx="md"
          w="95%"
          fontSize="lg"
          fontWeight="500"
          bg={baseColors.theme}
          color={baseColors.white}
          onPress={() => navigation.navigate({ key: 'product/tnc', name: 'product/tnc' })}>
          Set up
        </Button>

        <Button
          mx="md"
          w="95%"
          mt={10}
          fontSize="lg"
          fontWeight="500"
          borderWidth={2}
          bg={baseColors.white}
          color={baseColors.theme}
          borderColor={baseColors.theme}
          onPress={() => navigation.navigate({ key: 'product/detail', name: 'product/detail' })}>
          Buy New Product
        </Button>
      </Div>
    </Div>
  );
}
