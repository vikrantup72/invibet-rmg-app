import { baseColors } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { Button, Div, Text } from 'react-native-magnus';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { wp } from '../../Utils/dimension';
import AppImages from '../../constants/AppImages';
import { Image } from 'react-native';

export type RoundedTopBarProps = {
  title: string;
  optionalBackUrl?: string;
};

export function RoundedTopBar(props: RoundedTopBarProps) {
  const navigation = useNavigation();

  function onPressBack() {
    if (navigation.canGoBack()) navigation.goBack();
    // if (props.optionalBackUrl) navigation.navigate(props.optionalBackUrl);
  }

  return (
    <Div
      px={20}
      pb={25}
      pt={70}
      py="md"
      w="100%"
      flexDir="row"
      alignItems="center"
      bg={baseColors.theme}
      style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
      justifyContent="flex-start">
      <Button
        p={0}
        w={24}
        h={24}
        mr={15}
        shadow="sm"
        rounded="circle"
        alignItems="center"
        justifyContent="center"
        bg={'transparent'}
        onPress={onPressBack}>
        {/* <Ionicons name="arrow-back" size={16} color={baseColors.white} /> */}
        <Image  source={AppImages.back} style={{height:wp(6),width:wp(6),resizeMode:'contain'}} />
      </Button>

      <Text fontWeight="bold" color={baseColors.white} fontSize={18}>
        {props.title}
      </Text>
    </Div>
  );
}
