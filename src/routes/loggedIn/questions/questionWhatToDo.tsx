import { useSetAuthValue } from '../../../atoms/auth';
import { Description } from '../../../components/loginFlow/helpers';
import { RoundedTopBar } from '../../../components/loginFlow/roundedTopBar';
import { baseColors } from '../../../constants/colors';
import { LoggedInStackParamsList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Div, Text, Radio, Button } from 'react-native-magnus';

export function QuestionWhatToDo({ navigation }: NativeStackScreenProps<LoggedInStackParamsList, 'questionWhatToDo'>) {
  const setAuth = useSetAuthValue();
  const [selected, setSelected] = useState<'setup' | 'no-setup' | undefined>(undefined);

  return (
    <Div bg={baseColors.white} h="100%">
      <RoundedTopBar optionalBackUrl="nameInput" title="Set Up" />

      <Div flexDir="column" alignItems="center" justifyContent="center" mt={80}>
        <Description
          title="What would you like to do?"
          textProps={{ color: baseColors.theme }}
          description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        />
      </Div>

      <Div row my="md" w="100%" justifyContent="center" px={16}>
        <Button
          px={16}
          py={24}
          borderColor="lightgray"
          borderWidth={2}
          bg={baseColors.white}
          onPress={() => setSelected('setup')}
          style={{ borderRadius: 6 }}>
          <Div flexDir="row" justifyContent="space-between" w="100%">
            <Text fontSize={16} fontWeight="600">
              Set up a device
            </Text>
            <Radio checked={selected === 'setup'} activeColor={baseColors.yellowPrimary}>
              <Text></Text>
            </Radio>
          </Div>
        </Button>
      </Div>

      <Div>
        <Text textAlign="center" fontSize="sm" color="gray">
          Don&apos;t Have a device? Get a device with 100% Cashback
        </Text>
      </Div>

      <Div row mt="lg" mb="md" w="100%" justifyContent="center" px={16}>
        <Button
          px={16}
          py={24}
          borderColor="lightgray"
          borderWidth={2}
          bg={baseColors.white}
          onPress={() => setSelected('no-setup')}
          style={{ borderRadius: 6 }}>
          <Div flexDir="row" w="100%" justifyContent="space-between">
            <Text fontSize={16} fontWeight="600">
              Continue using the app
            </Text>
            <Radio checked={selected === 'no-setup'} activeColor={baseColors.yellowPrimary}>
              <Text></Text>
            </Radio>
          </Div>
        </Button>
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
        onPress={() => setAuth({ isAuthenticated: true })}>
        Submit
      </Button>
    </Div>
  );
}
