import { BettingTopBar } from '../../components/betting/topBar';
import { baseColors } from '../../constants/colors';
import { ScrollDiv } from 'react-native-magnus';

export function AddMoney() {
  return (
    <ScrollDiv bg={baseColors.white}>
      <BettingTopBar title="Add Money" noBackBtn />
    </ScrollDiv>
  );
}
