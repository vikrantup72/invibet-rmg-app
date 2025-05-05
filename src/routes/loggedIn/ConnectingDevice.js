import AppUtils from '../../Utils/appUtils';
import {hp, wp} from '../../Utils/dimension';
import {addDevice} from '../../api/Services/services';
import {useSetAuthValue} from '../../atoms/auth';
import CustomBtn from '../../components/CustomBtn';
import {
  disconnectDevice,
  enableStepAutoUpdate,
  getBluetoothStatusOnOff,
  listenToDeviceScans,
  selectBleDevice,
} from '../../components/native';
import AppImages from '../../constants/AppImages';
import {baseColors} from '../../constants/colors';
import AppFonts from '../../constants/fonts';
import {setLoader} from '../../redux/Reducers/tempData';
import {
  setAuthRedux,
  setDeviceAddress,
  setToken,
} from '../../redux/Reducers/userData';
import {createRef, useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Linking,
  Platform,
  Modal,
} from 'react-native';
import {Div} from 'react-native-magnus';
import * as Progress from 'react-native-progress';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';
import DeviceSetup from './DeviceSetup';

export default function ConnectingDevice({navigation, route}) {
  const {deviceInfo} = route?.params ?? {};
  const {deviceAddress, auth, token, user} = useSelector(
    state => state?.userData,
  );
  const {connection_status} = useSelector(state => state?.tempData);
  const setAuth = useSetAuthValue();
  const product = route?.params?.product || {
    image: null,
    name: 'No Device Found',
    title: 'Nope Desc',
  };

  const [bluetoothStatus, setBluetoothStatus] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const snackbarRef = createRef();

  useEffect(() => {
    if (connection_status?.isConnected) {
      //  setIsConnected(true)
      //  setProgress(1)`
      enableStepAutoUpdate(true);
      navigation.navigate('bettingTabs');
      SaveDevice(deviceInfo);
    }

    // setTimeout(() => {
    //   console.log('=======', connection_status?.isConnected, connection_status?.isConnecting, deviceAddress)
    //   if (!connection_status?.isConnected && !connection_status?.isConnecting && deviceAddress?.length > 0) {
    //     setProgress(0)
    //     AppUtils.showToast_error('Unable to connect, please try again')
    //     navigation.goBack()
    //     dispatch(setDeviceAddress(''))
    //   }

    // }, 10000);
  }, [connection_status]);

  useEffect(() => {
    const interval = setInterval(() => {
      getBluetoothStatusOnOff()
        .then(status => {
          setBluetoothStatus(status);
          if (!status) {
            setModalVisible(true);
          }
        })
        .catch(console.log);
    }, 300); // 300ms

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (bluetoothStatus) {
      setModalVisible(false);
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 1) {
            clearInterval(progressInterval);
            // setIsConnected(true); // Set connection state to true
            return 1;
          }
          return prev + 0.3;
        });
      }, 2000);

      return () => clearInterval(progressInterval); // Clean up interval
    }
  }, [bluetoothStatus]);

  const goToBluetoothSettings = async () => {
    if (Platform.OS === 'ios') {
      // await Linking.openURL('App-Prefs:Bluetooth');
    } else {
      await Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS');
    }
  };

  useEffect(() => {
    if (bluetoothStatus) {
      onSelectDevice(deviceInfo?.[0]);
    }
  }, [bluetoothStatus]);

  const onSelectDevice = async deviceAddress => {
    dispatch(setDeviceAddress(deviceAddress));
    await disconnectDevice();
    try {
      await selectBleDevice(deviceAddress)
        .then(() => {
          // dispatch(setDeviceAddress(deviceAddress));
          // enableStepAutoUpdate(true).then((i) => console.log('connnecteddddd-=d-=d-=d-=d-=--=', i));
        })
        .catch(err => {
          console.log('error while selecting device', err, deviceAddress);
          AppUtils.showToast_error('Unable to connect watch.Try again.');
          setTimeout(() => {
            navigation.replace('DeviceSetup');
          }, 500);
          // dispatch(setDeviceAddress(''));
        });
    } catch (err) {
      console.log('error while selecting device111', err);
      AppUtils.showToast_error('Unable to connect watch.Try again.');
      // dispatch(setDeviceAddress(''));
    }
  };

  //save device to database
  async function SaveDevice(deviceinfo) {
    if (!token) {
      setAuth(prev => ({...prev, isAuthenticated: false}));
      dispatch(setToken(''));
      dispatch(setAuthRedux(false));
      // @ts-ignore
      navigation.navigate({key: 'welcome', name: 'welcome'});
      return;
    }
    // dispatch(setLoader(true));
    const body = {
      user_id: user?.id,
      device_id: deviceinfo?.[0],
      watch_name: deviceinfo?.[1] ?? '',
    };
    console.log('body save device-=-', body);
    try {
      const res = await addDevice(body, token);
      console.log('watch connect response-=-==new', res);
      dispatch(setLoader(false));
      // dispatch(setAuthRedux(true));
      // setProgress(1)
      // setIsConnected(true)
      // setTimeout(() => {
      //   dispatch(setAuthRedux(true))

      //   navigation.navigate('bettingTabs')
      // }, 1000)
      // return
      if (res?.status == 201) {
        setProgress(1);
        // setIsConnected(true);
        setTimeout(() => {
          dispatch(setAuthRedux(true));
          // navigation.navigate('bettingTabs')
        }, 1000);

        console.log('watch connected successfully');
        dispatch(setIsConnected(true));
        // navigation.navigate({ key: 'bettingTabs', name: 'bettingTabs' });
      } else {
        dispatch(setLoader(false));
        AppUtils.showToast_error(res?.data?.error ?? res?.data?.message ?? '');
        await disconnectDevice();
        setTimeout(() => {
          navigation.goBack();
        }, 300);
      }
    } catch (err) {
      dispatch(setLoader(false));
      console.log('error while adding device to user', err);
    }
  }

  return (
    <Div bg={baseColors.white} h="100%">
      <View style={styles.main}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              source={AppImages.back}
              style={styles.decline_img}
              resizeMode="contain"
            />
          </Pressable>
          <Text style={styles.title}>Setup Device</Text>
        </View>

        {/* Product Details */}
        <View style={styles.subCon}>
          <Text style={styles.product_name}>{product.name}</Text>
          <Text style={styles.product_title}>{product.title}</Text>
          {/* Progress Bar */}
          {bluetoothStatus && (
            <View style={styles.progressContainer}>
              <Progress.Bar
                progress={progress}
                width={wp(90)}
                height={hp(0.5)}
                color={baseColors.themeLight}
                borderRadius={5}
              />
              <View style={styles.Connncted_Con}>
                {isConnected ? (
                  <>
                    <View style={styles.checked_img}>
                      <Image
                        source={AppImages.connected}
                        style={styles.check_img}
                        resizeMode="contain"
                      />
                    </View>
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={styles.progressText}>connected</Text>
                    </View>
                  </>
                ) : (
                  <Text style={styles.progressText}>connecting...</Text>
                )}
              </View>
            </View>
          )}
          {/* <Image source={product.image} style={styles.product_img} /> */}
          <Image source={AppImages.GP_watch} style={styles.product_img} />
        </View>

        {/* Bluetooth Modal */}
        <Modal visible={isModalVisible} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                Fitplay would like to use Bluetooth for new connections.
              </Text>
              <Text style={styles.modalDescription}>
                You can allow new connections in settings.
              </Text>

              <View style={styles.modalButtons}>
                <Pressable
                  style={styles.closeButton}
                  onPress={() => navigation.goBack()}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
                <Pressable
                  style={styles.settingsButton}
                  onPress={goToBluetoothSettings}>
                  <Text style={styles.settingsButtonText}>Settings</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Div>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: baseColors.white,
    paddingHorizontal: wp(4),
  },
  subCon: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1),
  },
  decline_img: {
    width: wp(6),
    height: hp(6),
    tintColor: baseColors.theme,
  },
  title: {
    fontSize: RFValue(16),
    color: baseColors.black,
    fontFamily: AppFonts.medium,
    fontWeight: '600',
    marginLeft: wp(3),
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: hp(2.5),
    width: wp(90),
  },
  product_name: {
    fontSize: RFValue(16),
    fontFamily: AppFonts.bold,
    color: baseColors.black,
    marginTop: hp(3),
  },
  progressText: {
    marginTop: hp(1),
    fontSize: RFValue(12),
    color: baseColors.black,
    fontWeight: '600',
    fontFamily: AppFonts.medium,
    // textAlign: 'center',
    marginBottom: hp(1.1),
  },
  Connncted_Con: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: wp(25),
    paddingVertical: hp(1),
  },
  checked_img: {
    paddingHorizontal: wp(1),
  },
  check_img: {
    width: wp(6),
    height: hp(6),
  },
  product_title: {
    fontSize: RFValue(12),
    color: baseColors.black,
    fontFamily: AppFonts.regular,
    marginTop: hp(1),
  },
  product_img: {
    marginTop: hp(10),
    height: hp(50),
    width: wp(90),
    alignSelf: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: baseColors.white,
    borderRadius: 28,
    paddingHorizontal: wp(5),
    width: wp(85),
    paddingVertical: hp(2.5),
  },
  modalTitle: {
    fontSize: RFValue(14),
    fontFamily: AppFonts.medium,
    marginBottom: hp(1),
    color: baseColors.black,
    fontWeight: '600',
  },
  modalDescription: {
    fontSize: RFValue(13),
    fontFamily: AppFonts.regular,
    color: baseColors.gray,
    marginBottom: hp(3),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    paddingHorizontal: wp(5),
  },
  closeButtonText: {
    color: baseColors.black,
    fontSize: RFValue(13),
    fontFamily: AppFonts.medium,
  },
  settingsButton: {},
  settingsButtonText: {
    color: baseColors.theme,
    fontSize: RFValue(13),
    fontFamily: AppFonts.medium,
  },
});
