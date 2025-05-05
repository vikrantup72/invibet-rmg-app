import { hp, wp } from '../../../Utils/dimension';
import { BettingTopBar } from '../../../components/betting/topBar';
import { baseColors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Div } from 'react-native-magnus';
import { useSelector } from 'react-redux';

export function NeedHelp({ navigation }) {
  const { deviceAddress, auth, token, user } = useSelector(state => state?.userData);
  const data =
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. ';

  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar title="Device not tracking accurate data" noIcons />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: hp(2) }} showsVerticalScrollIndicator={false}>
        <View style={style.main}>
          <Text style={style.desc}>{data}</Text>
          <Text style={style.desc}>{data}</Text>
        </View>      
      </ScrollView>
    </Div>
  );
}

const style = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: wp(5),
  },
  desc: {
    fontSize: 13,
    fontFamily: AppFonts.medium,
    fontWeight: '400',
    color: baseColors.theme,
    marginTop: hp(3),
  },
});
