import { useSelector } from 'react-redux';
import { RoundedTopBar } from '../../../components/loginFlow/roundedTopBar';
import { baseColors } from '../../../constants/colors';
import { LoggedInStackParamsList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Div, Image } from 'react-native-magnus';

export function WhatSettingUp({ navigation }: NativeStackScreenProps<LoggedInStackParamsList, 'product/whatSettingUp'>) {
  const {auth}=useSelector(state=>state?.userData)
  console.log('auth-=-=',auth)
  return (
    <Div bg={baseColors.white} h="100%">
      <RoundedTopBar title="What are you setting up?" />

      <Div row mt="lg" mx="md">
        <Div flexDir="row" alignItems="center" justifyContent="center">
          <Image h={220} w="48%" mr={6} source={require('../../../../assets/images/watches/w6.0.png')} rounded={8} />
          <Image h={220} w="48%" ml={6} source={require('../../../../assets/images/watches/w5.0.png')} rounded={8} />
        </Div>
      </Div>

      <Div row mt="lg" mx="md">
        <Div flexDir="row" alignItems="center" justifyContent="center">
          <Image h={220} w="48%" mr={6} source={require('../../../../assets/images/watches/w9.0.png')} rounded={8} />
          <Image h={220} w="48%" ml={6} source={require('../../../../assets/images/watches/w1.0.png')} rounded={8} />
        </Div>
      </Div>

      <Div row mt="lg" mx="md">
        <Div flexDir="row" alignItems="center" justifyContent="center">
          <Image h={220} w="48%" mr={6} source={require('../../../../assets/images/watches/w5.02.png')} rounded={8} />
          <Image h={220} w="48%" ml={6} source={require('../../../../assets/images/watches/w3.0.png')} rounded={8} />
        </Div>
      </Div>

      <Button
        mx="md"
        w="95%"
        position="absolute"
        bottom={30}
        fontSize="lg"
        fontWeight="500"
        bg={baseColors.theme}
        color={baseColors.white}
        onPress={() => navigation.navigate({ key: 'product/detail', name: 'product/detail' })}>
        Buy New Device
      </Button>
    </Div>
  );
}
