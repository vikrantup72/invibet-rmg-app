import { Active, useProfileDataState } from '../../../atoms/profileData';
import { QuestionireWrapper } from '../../../components/questionaire/wrapper';
import { baseColors } from '../../../constants/colors';
import { LoggedInStackParamsList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Div } from 'react-native-magnus';

export function QuestionSix({ navigation }: NativeStackScreenProps<LoggedInStackParamsList, 'questionSix'>) {
  const [profile, setProfile] = useProfileDataState();

  const bg = (ac: Active) => (profile.howActive === ac ? baseColors.white : baseColors.themeLight);
  const color = (ac: Active) => (profile.howActive === ac ? baseColors.theme : baseColors.white);

  return (
    <QuestionireWrapper index={6} title="How active you are?">
      <Div row mb="lg" mt="lg">
        <Button
          mx="md"
          w="50%"
          h={60}
          fontSize="lg"
          bg={bg('active')}
          color={color('active')}
          onPress={() => setProfile(prev => ({ ...prev, howActive: 'active' }))}>
          Active
        </Button>
        <Button
          mx="md"
          w="50%"
          h={60}
          fontSize="lg"
          bg={bg('slightly-active')}
          color={color('slightly-active')}
          onPress={() => setProfile(prev => ({ ...prev, howActive: 'slightly-active' }))}>
          Slightly Active
        </Button>
      </Div>

      <Div row mb="lg" mt="lg">
        <Button
          w="103%"
          h={60}
          fontSize="lg"
          bg={bg('not-active')}
          color={color('not-active')}
          onPress={() => setProfile(prev => ({ ...prev, howActive: 'not-active' }))}>
          Not Active
        </Button>
      </Div>
    </QuestionireWrapper>
  );
}
