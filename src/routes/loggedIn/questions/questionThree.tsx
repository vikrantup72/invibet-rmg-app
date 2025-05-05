import { heightValues, useProfileDataState } from '../../../atoms/profileData';
import { QuestionireWrapper } from '../../../components/questionaire/wrapper';
import { ItemToRender } from '../../../components/verticalScrolls';
import { baseColors } from '../../../constants/colors';
import { LoggedInStackParamsList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Div, Text } from 'react-native-magnus';
import SmoothPicker from 'react-native-smooth-picker';

export function QuestionThree({ navigation }: NativeStackScreenProps<LoggedInStackParamsList, 'questionThree'>) {
  const [profile, setProfile] = useProfileDataState();

  return (
    <QuestionireWrapper index={3} title="How Tall are you?">
      <Div pt={60} minH={250} pb={30} flex={1} flexDir="column" justifyContent="space-evenly" alignItems="center" bg="transparent">
        <Div w={250} h={300} justifyContent="center" alignItems="center" m="auto">
          <SmoothPicker
            magnet
            selectOnPress
            scrollAnimation
            data={heightValues}
            keyExtractor={item => item}
            onScrollToIndexFailed={() => {}}
            initialScrollIndex={profile.heightIndex}
            showsVerticalScrollIndicator={false}
            initialScrollToIndex={profile.heightIndex}
            renderItem={({ index, item }) => <ItemToRender {...{ index, item, selectedIndex: profile.heightIndex }} />}
            onSelected={({ index }) => setProfile(prev => ({ ...prev, heightIndex: index, height: heightValues[index] }))}
          />
        </Div>
      </Div>
      <Div flexDir="row" w={130} alignItems="center" justifyContent="center" py={5} px={5} bg={baseColors.themeLight} rounded={2}>
        <Text w={60} bg={baseColors.yellowPrimary} color={baseColors.white} rounded={2} px={20} h={30} fontWeight="600">
          FT
        </Text>
        <Text w={60} color={baseColors.white} px={16} fontWeight="600">
          Inch
        </Text>
      </Div>
    </QuestionireWrapper>
  );
}
