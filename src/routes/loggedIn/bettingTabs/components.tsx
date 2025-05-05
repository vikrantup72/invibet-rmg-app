import { isDeviceConnected } from '../../../components/native';
import { baseColors } from '../../../constants/colors';
import { Div, Text } from 'react-native-magnus';

export function BettingDashboardHeading(props: { title: string } & ({ subTitle: string; onSubTitleClick: () => void } | { subTitle: false })) {
  return (
    <Div flexDir="row" alignItems="baseline" justifyContent="space-between" mt="xl" mb="md">
      <Text onPress={()=>{
        isDeviceConnected()
          .then((i) => {
            console.log('device connection status from isDeviceConnected====>', i);
          })
          .catch((error) => {
            console.log('error while isDeviceConnected', error);
          });
      }} fontSize={17} fontWeight="bold" color={baseColors.theme}>
        {props.title}
      </Text>

      {props.subTitle ? (
        <Text fontSize={12} fontWeight="700" textDecorLine="underline" color={baseColors.themeLight} onPress={props.onSubTitleClick}>
          {props.subTitle}
        </Text>
      ) : null}
    </Div>
  );
}
