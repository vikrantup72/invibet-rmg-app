import { baseColors } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { ReactNode } from 'react';
import { Image } from 'react-native';
import { Button, Div } from 'react-native-magnus';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppImages from '../../constants/AppImages';
import { wp } from '../../Utils/dimension';

export type LoginFlowTopBarProps = {
  rightComponent?: ReactNode;
};

export function LoginFlowTopBar(props: LoginFlowTopBarProps) {
  const navigation = useNavigation();

  return (
    <Div px={20} pt={60} py="md" w="100%" flexDir="row" alignItems="center" bg={baseColors.theme} justifyContent="space-between">
      <Button
        p={0}
        w={24}
        h={24}
        shadow="sm"
        rounded="circle"
        alignItems="center"
        justifyContent="center"
        bg={'transparent'}
        onPress={() => (navigation.canGoBack() ? navigation.goBack() : {})}>
        {/* <Ionicons name="arrow-back" size={16} color={baseColors.white} /> */}
        <Image  source={AppImages.back} style={{height:wp(6),width:wp(6),resizeMode:'contain'}} />
      </Button>
      {props.rightComponent ? props.rightComponent : <Div w={40} h={40} />}
    </Div>
  );
}
