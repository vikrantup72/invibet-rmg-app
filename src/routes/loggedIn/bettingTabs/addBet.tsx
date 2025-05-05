import { BettingTopBar } from '../../../components/betting/topBar';
import { baseColors } from '../../../constants/colors';
import { LoggedInBettingTabsParamsList } from '../../types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Div } from 'react-native-magnus';

export function AddBet({ navigation }: BottomTabScreenProps<LoggedInBettingTabsParamsList, 'betting/add'>) {
  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar title="Add Bet" subTitle="January 2023" noBackBtn />
    </Div>
  );
}
