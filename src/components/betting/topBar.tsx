import { hp, wp } from '../../Utils/dimension';
import { wallet } from '../../api/Services/services';
import { useSetAuthValue } from '../../atoms/auth';
import { baseColors } from '../../constants/colors';
import AppFonts from '../../constants/fonts';
import { Get_wallet, setAuthRedux, setIsConnected, setToken } from '../../redux/Reducers/userData';
import { useNavigation } from '@react-navigation/native';
import { retry } from '@reduxjs/toolkit/query';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { Div, Text } from 'react-native-magnus';
import { RFValue } from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import AppImages from '../../constants/AppImages';
import { connectBT, disconnectDevice, enableStepAutoUpdate, listenToDeviceScans, selectBleDevice, watchSdkEmitter } from '../native';
import { setConnection_status } from '../../redux/Reducers/tempData';

type BettingTopBarProps = PropsWithChildren<
  {
    title: string;
    subTitle?: ReactNode;
    noIcons?: boolean;
    onPressConnectionText: () => void;
  } & ({ noBackBtn: true } | { noBackBtn: false; backAction: () => void })
>;

export function BettingTopBar(props: BettingTopBarProps) {
  const { isSkipped, userId, token, user, wallet } = useSelector(state => state?.userData);
  const { connection_status, myBets } = useSelector(state => state?.tempData);
  const [points, setPoints] = useState(0);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const setAuth = useSetAuthValue();
  const HandlePress = () => {
    setAuth(prev => ({ ...prev, isAuthenticated: false }));
    dispatch(setToken(''));
    dispatch(setAuthRedux(false));
    setTimeout(() => {
      navigation.navigate('mobileInput');
    }, 100);
  };

  const HandlePress_connect = () => {
    setAuth(prev => ({ ...prev, isAuthenticated: false }));
    dispatch(setAuthRedux(false));
    setTimeout(() => {
      navigation.navigate('AddDevice');
    }, 100);
  };

  // Points API

  const fetchPoints = async () => {
    if (!user.id || !token) {
      // console.error('Invalid userId or token:', { user.id, token });
      setPoints(0); // Default value
      return;
    }
    try {
      const response = await wallet(user.id, token); // Call the wallet API

      if (response?.data?.wallet?.total_balance !== undefined && response?.data?.wallet?.total_balance !== null) {
        setPoints(response?.data?.wallet.encashable_balance); // Set points with total_balance
      } else {
        console.warn('total_balance is missing in API response');
        setPoints(0); // Default to 0 if missing
      }
    } catch (error) {
      console.error('Error fetching wallet points:', error);
      setPoints(0); // Default to 0 in case of errors
    }
  };

  useEffect(() => {
    // fetchPoints();
    dispatch(Get_wallet(user?.id, token))

  }, []);

  // const ConnectWatch = async () => {
  //   console.log('before i am here')
  //   if (user?.device_id != null) {
  //     console.log('i am here=====')
  //     listenToDeviceScans();
  //     setTimeout(async () => {
  //       // watchSdkEmitter.addListener('connectionStatus', connection => {
  //       //   console.log('connection-=-=', connection);
  //       //   dispatch(setConnection_status(connection));
  //       // });
  //       if ((user?.device_id != null) && (connection_status?.isConnected==false)) {
  //         await selectBleDevice(user?.device_id)
  //           .then(() => {
  //             enableStepAutoUpdate(true).then(i => console.log(i));
  //             console.log('watch connected successfully');
  //             dispatch(setIsConnected(true));
  //           })
  //           .catch((err: any) => {
  //             dispatch(setConnection_status({ isConnected: false, isConnecting: false }));
  //             console.log('--****************** Error unable to connect to watch ******************--', err);
  //           });
  //       }
  //     }, 4000);
  //   }
  // }

  const DisconnectDevice = async () => {
    await disconnectDevice();
  }
  return (
    <LinearGradient colors={['rgba(69, 43, 80, 1)', 'rgba(94, 56, 112, 0.9)']} style={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
      <Div px={20} pb={16} pt={40} py="md" w="100%">
        <Div flexDir="row" justifyContent="space-between">
          <Div flexDir="row" justifyContent="space-between" alignItems="center">
            {props.noBackBtn ? null : (
              <Text p={8} pl={0} onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" color={baseColors.white} size={22} />
              </Text>
            )}

            <Div>
              <Text color={baseColors.white} fontSize={20} fontWeight="400" fontFamily={AppFonts.bold}>
                {props.title}
              </Text>
              {props.subTitle ? <Text color={baseColors.white}>{props.subTitle}</Text> : null}
            </Div>
          </Div>

          {props.noIcons ? null : (
            <Div flexDir="row" justifyContent="center" alignItems="center">
              {/* <Ionicons name="search" size={24} style={{ marginRight: 8 }} color={baseColors.white} /> */}
              {/* <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: baseColors.walletBg,
                  width: wp(10),
                  borderRadius: 30,
                  paddingVertical: hp(1),
                  marginRight: wp(2.5),
                }}>
                <Ionicons name="notifications-outline" size={24} style={{}} color={baseColors.white} />
              </View> */}

              {user?.device_id != null ? <Pressable onPress={() => {
                // if (connection_status?.isConnected) {
                //   DisconnectDevice()
                // } else {
                // ConnectWatch()
                // }
                connectBT().then((i) => console.log('cnnnectBt====>', i))
              }} hitSlop={20} style={styles.watchMain} >
                {/* <FastImage source={AppImages.watch} style={styles.watch} tintColor={connection_status?.isConnected ? 'green' : 'white'} resizeMode='contain' /> */}
                <Text style={{
                  fontSize: RFValue(12),
                  fontWeight: '700',
                  fontFamily: AppFonts.semibold,
                  color: connection_status?.isConnected ? 'green' : 'white'
                }} >{connection_status?.isConnected == true ? 'Connected' : 'Disconnected'}</Text>
              </Pressable>:
              <Pressable onPress={()=>{
                if (isSkipped) {
                  HandlePress()
                  return
                }
                HandlePress_connect()
                }} >
                <Text style={{
                  fontSize: RFValue(12),
                  fontWeight: '700',
                  fontFamily: AppFonts.semibold,
                  color:baseColors.white,
                  marginRight:wp(1)
                }} >{'Add device'}</Text>
              </Pressable>
              }

              {/* {
                user?.device_id !=null && !connection_status?.isConnected &&
                <FastImage source={AppImages.loading} style={[styles.watch,{height:25,width:25,borderRadius:wp(50),marginRight:wp(4)}]}  resizeMode='contain'  />

              } */}


              <Pressable
                onPress={() => {
                  if (isSkipped) {
                    console.log('i am heree is skipped')
                    HandlePress();
                  }
                  else if (user && user.hasOwnProperty('device_id') && user?.device_id != null) {
                    console.log('i am heree  navigation wallet')
                    navigation.navigate('wallet');
                  }
                  else {
                    console.log('i am heree HandlePress_connect')
                    HandlePress_connect()
                  }
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    backgroundColor: baseColors.walletBg,
                    width: wp(30),
                    borderRadius: 20,
                    paddingVertical: hp(0.9),
                  }}>
                  <Ionicons name="wallet" size={20} color={baseColors.white} style={{}} />
                  <Text
                    style={{ color: baseColors.white, fontWeight: '500', fontSize: RFValue(11), fontFamily: AppFonts.bold, marginRight: wp(1.5) }}>
                    {wallet?.total_balance ?? 0} points
                  </Text>
                </View>
              </Pressable>
            </Div>
          )}
        </Div>
        {props.children}
      </Div>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  watchMain: {
    paddingHorizontal: wp(2)
  },
  watch: {
    height: wp(7),
    width: wp(7),
    maxHeight: 35,
    maxWidth: 35
  },
  connectionText: {
    fontSize: RFValue(12),
    fontWeight: '700',
    fontFamily: AppFonts.semibold,

  }
})