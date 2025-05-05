import { baseColors } from '../../../constants/colors';
import { Div } from 'react-native-magnus';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function GoalFireIcon() {
  return (
    <Div h={34} w={34} rounded={17} bg="#FF805D" alignItems="center" justifyContent="center">
      <MaterialCommunityIcons name="fire" size={20} color={baseColors.white} />
    </Div>
  );
}

export function GoalWalkingIcon() {
  return (
    <Div h={34} w={34} rounded={17} bg="#41CDE6" alignItems="center" justifyContent="center">
      <FontAwesome5 name="walking" size={20} color={baseColors.white} />
    </Div>
  );
}

export function GoalBothIcon() {
  return (
    <Div h={34} w={34} rounded={17}>
      <Div h={17} w={34} roundedTop={17} bg="#FF805D" alignItems="center" justifyContent="center">
        <FontAwesome5 name="walking" size={12} color={baseColors.white} />
      </Div>
      <Div h={17} w={34} roundedBottom={17} bg="#41CDE6" alignItems="center" justifyContent="center">
        <MaterialCommunityIcons name="fire" size={12} color={baseColors.white} />
      </Div>
    </Div>
  );
}
