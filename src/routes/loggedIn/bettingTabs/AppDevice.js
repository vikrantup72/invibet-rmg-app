import AppUtils from '../../../Utils/appUtils';
import { hp, wp } from '../../../Utils/dimension';
import { getSavedDevices } from '../../../api/Services/services';
import { useSetAuthValue } from '../../../atoms/auth';
import Gamesview from '../../../components/Gamesview';
import { BettingTopBar } from '../../../components/betting/topBar';
import { disconnectDevice } from '../../../components/native';
import AppImages from '../../../constants/AppImages';
import { baseColors, colors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import { setLoader } from '../../../redux/Reducers/tempData';
import { setAuthRedux, setToken, setDeviceAddress, Get_user_detail } from '../../../redux/Reducers/userData';
import { LoggedInBettingTabsParamsList } from '../../types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Div, isValidColor } from 'react-native-magnus';
import { useDispatch, useSelector } from 'react-redux';

const RenderItem = ({ item, index, onPress, token, savedDevices, isConnected, onDisconnectBtn }) => {
  const [visible, setVisible] = useState(false);
  onPress = () => {
    setVisible(!visible);
  };
  return (
    <Pressable onPress={onPress} style={style.listMain}>
      <Pressable onPress={onPress} style={style.listinner}>
        <Text style={style.listTitle}>{item?.title}</Text>
        <Image source={AppImages.arrow_right} style={[style.arrow, { transform: [{ rotate: visible ? '90deg' : '0deg' }] }]} />
      </Pressable>

      {index == 0 && visible && (
        <View style={[style.listinner, { marginTop: hp(-1) }]}>
          <Text style={style.device}>{'Mobile'}</Text>
          <Text style={[style.device, { textDecorationLine: 'underline' }]}>{'Connected'}</Text>
        </View>
      )}

      {index == 1 && visible && (
        <FlatList
          // data={savedDevices}
          // data={savedDevices?.length > 0 ? savedDevices : [{ device_id: deviceAddress }]}
          data={savedDevices}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => <Block item={item} token={token} onDisconnectPress={(id) => onDisconnectBtn(id)} isConnected={isConnected} />}
          ListEmptyComponent={() => {
            return (
              <View>
                <Text style={style.noDataFound}>No data found.</Text>
              </View>
            );
          }}
        />
      )}
    </Pressable>
  );
};

const Block = ({ item, index, token, onDisconnectPress, isConnected = true }) => {

  return (
    <Pressable style={[style.listinner, { paddingVertical: hp(1), opacity: isConnected ? 1 : 0.0 }]} onPress={() => onDisconnectPress(item?.device_id)}>
      <Text style={[style.listTitle, { fontFamily: AppFonts.semibold }]}>
        {/* {isConnected ? item?.device_id : null }
         */}
        {item?.device_id}
      </Text>
      <Text style={[style.connected, { color: isConnected ? baseColors.theme : 'red' }]}>
        {/* {isConnected ? 'Disconnect' : ''} */}
        Disconnect
      </Text>
    </Pressable>
  );
};

export function AppDevice({ navigation }) {
  const { deviceAddress, auth, token, user } = useSelector(state => state?.userData);
  const [isConnected, setIsConnected] = useState(false);

  const setAuth = useSetAuthValue();
  const dispatch = useDispatch();
  const data = [
    { title: 'Connect with Application', status: '' },
    { title: 'Connect with Device', route: '' },
  ];
  const [savedDevices, setSavedDevices] = useState([]);

  const DisconnectDevice = async () => {
    await disconnectDevice();
  }

  const disconnect = async deviceId => {
    if (!token) {
      console.error('Token is not available');
      AppUtils.showToast_error('Token is missing');
      return;
    }

    // Show the confirmation alert before proceeding with the disconnection
    Alert.alert(
      'Disconnect Device', // Title of the alert
      'Would you like to disconnect the device?', // Message in the alert
      [
        {
          text: 'Cancel', // Cancel button
          onPress: () => console.log('Disconnect cancelled'),
          style: 'cancel', // Style to make it appear like a cancel button
        },
        {
          text: 'OK', // OK button
          onPress: async () => {
            // Proceed with the disconnection if user confirms
            try {
              console.log('Disconnecting device with token:', token);
              const response = await fetch('https://invibet-backend-280569053519.asia-south1.run.app/profile/disconnect/device', {
                method: 'PUT',
                headers: {
                  Authorization: ` ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ device_id: deviceId }),
              });

              const responseData = await response.json();
              console.log('Full API Response disconnect: ', responseData);
              if (response.status === 200) {
                DisconnectDevice()
                AppUtils.showToast('Device disconnected successfully');
                setIsConnected(false);
                dispatch(setDeviceAddress(''));
                GetSavedDevice();
                dispatch(Get_user_detail(token))
              } else {
                AppUtils.showToast_error('Device Already DisConnected');
              }
            } catch (error) {
              console.error('Error disconnecting device:', error);
              AppUtils.showToast_error('Error disconnecting device');
            }
          },
        },
      ],
      { cancelable: false }, // Make the alert non-cancelable by clicking outside
    );
  };






  async function GetSavedDevice() {
    if (!token) {
      setAuth(prev => ({ ...prev, isAuthenticated: false }));
      dispatch(setToken(''));
      dispatch(setAuthRedux(false));
      // @ts-ignore
      navigation.navigate({ key: 'welcome', name: 'welcome' });
      return;
    }
    const body = {};
    dispatch(setLoader(true));
    try {
      const res = await getSavedDevices(user?.id, token);
      console.log('saved device res==', JSON.stringify(res?.data));
      dispatch(setLoader(false));
      if (res?.status == 200) {
        setSavedDevices(res?.data ?? []);
      } else {
        setSavedDevices([]);
      }
    } catch (err) {
      dispatch(setLoader(false));
      setSavedDevices([]);
      AppUtils.showToast_error('Something went wrong, try again');
      console.log('error while updating profile', err);
    }
  }

  useFocusEffect(
    useCallback(() => {
      GetSavedDevice();
    }, []),
  );




  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar title="Apps & Device" noIcons />

      <View style={style.main}>
        <View style={{ width: '100%', marginTop: hp(2) }}>
          <FlatList
            scrollEnabled={false}
            keyExtractor={(item, index) => index}
            data={data}
            ItemSeparatorComponent={() => {
              return <View style={style.seperator} />;
            }}
            renderItem={({ item, index }) => <RenderItem item={item} index={index} token={token} savedDevices={savedDevices}
              onDisconnectBtn={(deviceAddress) => disconnect(deviceAddress)}
            />}
          />
        </View>

        {/* <View style={style.upgrademain}>
          <Text style={style.checkout}>Didn’t able to connect </Text>
          <Text style={style.desc}>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum.</Text>
          <Text onPress={() => navigation.navigate('NeedHelp')} style={style.upgradeplan}>
            Need Help
          </Text>
        </View> */}
      </View>
    </Div>
  );
}

const style = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: wp(5),
  },
  seperator: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(69,43,80,0.1)',
  },
  listMain: {},
  listTitle: {
    fontSize: 15,
    fontFamily: AppFonts.medium,
    fontWeight: '400',
    color: baseColors.theme,
  },
  device: {
    fontSize: 14,
    fontFamily: AppFonts.bold,
    fontWeight: '700',
    color: baseColors.theme,
  },
  connected: {
    fontSize: 14,
    fontFamily: AppFonts.semibold,
    textDecorationLine: 'underline',
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
  noDataFound: {
    fontSize: 12,
    fontWeight: '500',
    color: baseColors.black,
    alignSelf: 'center',
  },
});
