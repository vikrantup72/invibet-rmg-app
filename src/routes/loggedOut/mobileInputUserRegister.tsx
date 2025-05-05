import { FacebookIcon, GoogleIcon } from '../../components/GoogleIcon';
import { BrandLogo, Description } from '../../components/loginFlow/helpers';
import { baseColors } from '../../constants/colors';
import { LoggedOutStackParamsList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Checkbox, Div, Input, Text } from 'react-native-magnus';

export function MobileInputUserRegister({ navigation }: NativeStackScreenProps<LoggedOutStackParamsList, 'mobileInputUserRegister'>) {
  return (
    <Div bg={baseColors.white} h="100%">
      <Div alignItems="center" p="lg" pt={80} px={20}>
        <BrandLogo />
        <Div my={5} />
        <Description title="Tychee" description="Start your journey with Tychee" textProps={{ color: baseColors.theme }} />
      </Div>

      <Div px={20}>
        <Text color="gray" mb="md">
          Mobile Number
        </Text>

        <Input keyboardType="number-pad" placeholder="Enter Mobile Number" mb={20} py={6} />

        <Checkbox
          mb={5}
          defaultChecked
          activeColor={baseColors.theme}
          suffix={
            <Text fontSize="sm" color="gray600" pl={10}>
              I accept all Terms & Conditions*
            </Text>
          }
        />

        <Button
          w="100%"
          px={36}
          py={12}
          fontSize="lg"
          fontWeight="500"
          bg={baseColors.theme}
          color={baseColors.white}
          onPress={() => navigation.navigate({ key: 'termsAndConditions', name: 'termsAndConditions' })}>
          Submit
        </Button>

        <Div alignItems="center">
          <Text my={20}>Or</Text>

          <Div flexDir="row">
            <FacebookIcon />
            <GoogleIcon />
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
