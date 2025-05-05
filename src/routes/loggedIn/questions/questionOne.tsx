import { Gender, useProfileDataState } from '../../../atoms/profileData';
import { QuestionireWrapper } from '../../../components/questionaire/wrapper';
import { baseColors } from '../../../constants/colors';
import { LoggedInStackParamsList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Div } from 'react-native-magnus';

export function QuestionOne({ navigation }: NativeStackScreenProps<LoggedInStackParamsList, 'questionOne'>) {
  const [profile, setProfile] = useProfileDataState();

  const color = (val: Gender) => (val === profile.gender ? baseColors.theme : baseColors.white);
  const bg = (val: Gender) => (val === profile.gender ? baseColors.white : baseColors.themeLight);

  return (
    <QuestionireWrapper index={1} title="What's your Biological Gender?">
      <Div row mb="lg" mt="lg">
        <Button
          h={60}
          mx="md"
          w="50%"
          fontSize="lg"
          bg={bg('female')}
          color={color('female')}
          onPress={() => setProfile(prev => ({ ...prev, gender: 'female' }))}>
          Female
        </Button>
        <Button
          h={60}
          mx="md"
          w="50%"
          fontSize="lg"
          bg={bg('male')}
          color={color('male')}
          onPress={() => setProfile(prev => ({ ...prev, gender: 'male' }))}>
          Male
        </Button>
      </Div>

      <Div row mb="lg" mt="lg">
        <Button
          h={60}
          mx="md"
          w="50%"
          fontSize="lg"
          bg={bg('non-binary')}
          color={color('non-binary')}
          onPress={() => setProfile(prev => ({ ...prev, gender: 'non-binary' }))}>
          Non-Binary
        </Button>
        <Button
          h={60}
          mx="md"
          w="50%"
          fontSize="lg"
          bg={bg('prefer-not-to-say')}
          color={color('prefer-not-to-say')}
          onPress={() => setProfile(prev => ({ ...prev, gender: 'prefer-not-to-say' }))}>
          Prefer not to say
        </Button>
      </Div>
    </QuestionireWrapper>
  );
}
