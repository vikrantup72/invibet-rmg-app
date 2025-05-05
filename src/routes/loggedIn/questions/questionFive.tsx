import { Disease, useProfileDataState } from '../../../atoms/profileData';
import { QuestionireWrapper } from '../../../components/questionaire/wrapper';
import { baseColors } from '../../../constants/colors';
import { LoggedInStackParamsList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Div } from 'react-native-magnus';

export function QuestionFive({ navigation }: NativeStackScreenProps<LoggedInStackParamsList, 'questionFive'>) {
  const [profile, setProfile] = useProfileDataState();

  const hanldeSetDiseases = (disease: Disease) => () => {
    setProfile(prev => {
      if (disease === 'none') return { ...prev, health_issues: ['none'] };
      const diseaseSet = new Set<Disease>();
      prev.health_issues.forEach(d => diseaseSet.add(d));
      diseaseSet.delete('none');
      if (prev.health_issues.includes(disease)) diseaseSet.delete(disease);
      else diseaseSet.add(disease);
      return { ...prev, health_issues: [...diseaseSet] };
    });
  };

  const InnerBtn = ({ disease, label }: { disease: Disease; label: String }) => (
    <Button mx="md" w="50%" h={60} fontSize="lg" bg={bg(disease)} color={color(disease)} onPress={hanldeSetDiseases(disease)}>
      {label}
    </Button>
  );

  const bg = (disease: Disease) => (profile.health_issues.includes(disease) ? baseColors.white : baseColors.themeLight);
  const color = (disease: Disease) => (profile.health_issues.includes(disease) ? baseColors.theme : baseColors.white);

  return (
    <QuestionireWrapper index={5} title="Do you have any health issues?">
      <Div row mb="lg" mt="lg">
        <InnerBtn disease="diabetes" label="Diabetes" />
        <InnerBtn disease="cholestrol" label="Cholestrol" />
      </Div>

      <Div row mb="lg" mt="lg">
        <InnerBtn disease="injury" label="Injury" />
        <InnerBtn disease="breathing-issue" label="Breathing Issue" />
      </Div>

      <Div row mb="lg" mt="lg">
        <Button w="103%" h={60} fontSize="lg" color={color('none')} bg={bg('none')} onPress={hanldeSetDiseases('none')}>
          I am Healthy
        </Button>
      </Div>
    </QuestionireWrapper>
  );
}
