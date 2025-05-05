import { useDispatch, useSelector } from 'react-redux';
import { hp, wp } from '../../../Utils/dimension';
import Gamesview from '../../../components/Gamesview';
import { BettingTopBar } from '../../../components/betting/topBar';
import AppImages from '../../../constants/AppImages';
import { baseColors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import { LoggedInBettingTabsParamsList } from '../../types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { FlatList, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Div } from 'react-native-magnus';
import { disconnectDevice } from '../../../components/native';
import { useSetAuthValue } from '../../../atoms/auth';
import { setAuthRedux } from '../../../redux/Reducers/userData';
import CustomBtn from '../../../components/CustomBtn';
import { updateAppVersion } from '../../../api/Services/services';
import AppUtils from '../../../Utils/appUtils';

export function Profile({ navigation }: BottomTabScreenProps<LoggedInBettingTabsParamsList, 'betting/profile'>) {
  const { user } = useSelector(state => state?.userData);
  const setAuth = useSetAuthValue();
  const dispatch = useDispatch()
  const data = [
    { title: "Edit profile", route: 'EditProfile' },
    { title: "Help Center", route: '' },
    // { title: "Goals & Tasks", route: '' },
    { title: "Track Order", route: 'TrackOrder' },
    // { title: "Active Plans", route: '' },
    // { title: "Progress Report", route: '' },
    { title: "App & Devices", route: 'AppDevice' },
    { title: "Settings", route: 'Setting' }
  ];


  const RenderItem = ({ item, index, onPress }) => {
    return (
      <Pressable onPress={onPress} style={style.listMain}>
        <View style={style.seperator} />

        <Pressable onPress={onPress} style={style.listinner}>
          <Text style={style.listTitle}>{item?.title}</Text>
          <Image source={AppImages.arrow_right} style={style.arrow} />
        </Pressable>
      </Pressable>
    );
  };

  const HandlePress_connect = () => {
    setAuth(prev => ({ ...prev, isAuthenticated: false }));
    dispatch(setAuthRedux(false));
    // @ts-ignore
    setTimeout(() => {
      navigation.navigate('AddDevice');
    }, 100);
  };


  //Get app version
  async function UpdateAppVersion() {
    try {
      const body = {
        version: 8,
        is_mandatory: 'false'
      }
      const res = await updateAppVersion(body);
      console.log('res update version-=-=-', res?.data,)

      if (res?.status == 201) {
        AppUtils.showToast('version update successfully')


      } else {
        AppUtils.showToast_error(res?.data?.message ?? 'something went wrong')
      }
    } catch (err: any) {
      console.log('error while update app version', err);
    }
  }


  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar title="Profile" noBackBtn noIcons />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: hp(7) }} showsVerticalScrollIndicator={false}>
        <View style={style.main}>
          <Pressable style={style.imgOuter}>
            <Image source={AppImages.user} style={style.img} />
          </Pressable>
          <Text style={style.name}>{user?.name ?? ''}</Text>
          <Text style={style.email}>{user?.email ?? ''}</Text>

          <Gamesview lost={user?.total_losses} wins={user?.total_wins} total={user?.total_games} />

          {/* <View style={style.upgrademain}>
            <Text style={style.checkout}>Check out our new plans </Text>
            <Text style={style.desc}>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum.</Text>
            <Text style={style.upgradeplan}>Upgrade Plan</Text>
          </View> */}

          <View style={{ width: '100%', marginTop: hp(4) }}>
            <FlatList
              scrollEnabled={false}
              keyExtractor={(item, index) => index}
              data={data}

              renderItem={({ item, index }) => <RenderItem item={item} index={index}
                onPress={() => {
                  if ((item?.title == 'App & Devices') && (user.hasOwnProperty('device_id') && (user?.device_id == null))) {
                    HandlePress_connect()
                    return
                  }
                  else if (item?.route?.trim()?.length > 0) {
                    navigation.navigate(item?.route)
                  }
                  else if (item?.title == 'Help Center') {
                    navigation.navigate('HelpCenter')
                    return
                    Linking.openURL('https://tychee.in')
                  }

                }}
              />}
            />
          </View>
          {false && <CustomBtn
            btnName={'Update version '}
            textStyle={{ color: baseColors.white, fontFamily: AppFonts.bold, fontWeight: '600' }}
            btnStyle={{ marginVertical: hp(3), width: wp(80) }}
            onPress={() => {
              UpdateAppVersion()
            }}
          />}
        </View>
      </ScrollView>
    </Div>
  );
}

const style = StyleSheet.create({
  imgOuter: {
    borderWidth: 8,
    borderColor: baseColors.primaryLight,
    alignSelf: 'center',
    borderRadius: wp(25),
    marginTop: hp(4),
  },
  img: {
    height: wp(25),
    width: wp(25),
    borderRadius: wp(25),
  },
  main: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: wp(5),
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: AppFonts.semibold,
    color: baseColors.theme,
    marginTop: hp(1),
  },
  email: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: AppFonts.medium,
    color: baseColors.theme,
    marginTop: hp(0.4),
  },
  seperator: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(69,43,80,0.1)',
  },
  renderMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgrademain: {
    paddingVertical: hp(1.8),
    width: '100%',
    backgroundColor: baseColors.theme,
    borderRadius: 4,
    paddingHorizontal: '3%',
    marginTop: hp(4),
  },
  checkout: {
    fontSize: 12,
    fontFamily: AppFonts.medium,
    fontWeight: '400',
    color: baseColors.white,
  },
  desc: {
    fontSize: 10,
    fontFamily: AppFonts.medium,
    fontWeight: '400',
    color: baseColors.white,
    marginTop: hp(0.3),
  },
  upgradeplan: {
    fontSize: 13,
    fontFamily: AppFonts.bold,
    color: baseColors.white,
    marginTop: hp(0.5),
    textDecorationLine: 'underline',
  },
  listMain: {},
  listTitle: {
    fontSize: 15,
    fontFamily: AppFonts.medium,
    fontWeight: '400',
    color: baseColors.theme,
  },
  arrow: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
  },
  listinner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(1.5),
    paddingHorizontal: '1%',
    paddingRight: '4%',
  },
});
