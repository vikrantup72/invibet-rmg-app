import { hp, wp } from '../../Utils/dimension';
import CustomBtn from '../../components/CustomBtn';
import AppImages from '../../constants/AppImages';
import { baseColors } from '../../constants/colors';
import AppFonts from '../../constants/fonts';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Div } from 'react-native-magnus';
import { RFValue } from 'react-native-responsive-fontsize';

export default function DeviceOverview({ navigation, route }) {
  const { deviceInfo } = route?.params
  console.log('device info-=-',deviceInfo)
  const product = route?.params?.product || {
    image: null,
    name: 'No Device Found',
    title: 'Nope Desc',
  };

  return (
    <Div bg={baseColors.white} h="100%">
      <View style={styles.main}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image source={AppImages.back} style={styles.decline_img} resizeMode="contain" />
          </Pressable>
          <Text style={styles.title}>Setup Device</Text>
        </View>
        <View style={{}}>
          <Text style={styles.product_name}>{deviceInfo?.[1]}</Text>
          <Text style={styles.product_title}>Sync your activity for a rewarding journey ahead</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Image source={AppImages.GP_watch} style={styles.product_img} />
        </View>

        <View style={{ marginBottom: hp(1) }} >
          <CustomBtn
            btnName={'Start Setup'}
            textStyle={{ color: baseColors.white, fontFamily: AppFonts.bold, fontWeight: '600' }}
            btnStyle={{ marginBottom: hp(2.5) }}
            onPress={() => {
              navigation.navigate('product/tnc', { product,deviceInfo });
            }}
          />
        </View>
      </View>
    </Div>
  );
}


const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(1),
    paddingTop: hp(2)
  },
  decline_img: {
    width: wp(6),
    height: hp(6),
    tintColor: baseColors.theme,
  },
  main: {
    flex: 1,
    backgroundColor: baseColors.white,
    // justifyContent: 'space-between',
    paddingHorizontal: wp(4),
  },
  title: {
    fontSize: RFValue(15),
    color: baseColors.black,
    fontFamily: AppFonts.medium,
    fontWeight: '600',
    marginLeft: wp(3),
  },
  img: {
    height: hp(30),
    width: wp(92),
    resizeMode: 'contain',
  },
  product_name: {
    fontSize: RFValue(15),
    fontFamily: AppFonts.bold,
    color: baseColors.black,
    marginTop: hp(2),
  },
  product_title: {
    fontSize: RFValue(12),
    color: baseColors.black,
    fontFamily: AppFonts.regular,
    marginTop: hp(1),
  },
  product_img: {
    marginTop: hp(10),
    height: hp(40),
    width: wp(90),

  },
});
