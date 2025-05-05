import { BrandLogo, Description } from '../../components/loginFlow/helpers';
import { LoginFlowTopBar } from '../../components/loginFlow/topBar';
import { baseColors } from '../../constants/colors';
import { LoggedOutStackParamsList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Div } from 'react-native-magnus';

export function Welcome({ navigation }: NativeStackScreenProps<LoggedOutStackParamsList, 'welcome'>) {
  return (
    <>
      {/* <LoginFlowTopBar /> */}
      <Div p="lg" pt={80} px={20} flex={1} alignItems="center" bg={baseColors.white} justifyContent="space-between">
        <BrandLogo />

        <Div w="100%" pb={50} alignItems="center">
          <Description
            title="Welcome to the Invibet"
            description="Lorem Ipsum is simply dummy text of the printing and typesetting
            industry."
            textProps={{ color: baseColors.theme }}
          />

          <Button
            bg={baseColors.themeLight}
            fontWeight="500"
            fontSize="lg"
            color={baseColors.white}
            w="100%"
            px={36}
            py={12}
            onPress={() => navigation.navigate({ key: 'mobileInput', name: 'mobileInput' })}>
            Get Started
          </Button>
        </Div>
      </Div>
    </>
  );
}
