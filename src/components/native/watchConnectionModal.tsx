import {
  disconnectDevice,
  getBluetoothStatusOnOff,
  selectBleDevice,
  watchSdkEmitter,
} from '.';
import AppUtils from '../../Utils/appUtils';
import {addDevice} from '../../api/Services/services';
import {useSetAuthValue} from '../../atoms/auth';
import {baseColors} from '../../constants/colors';
import {useAsyncStorage} from '../../hooks/useAsyncStorage';
import {setLoader} from '../../redux/Reducers/tempData';
import {
  setAuthRedux,
  setDeviceAddress,
  setToken,
} from '../../redux/Reducers/userData';
import {upcomingEventsSampleData} from '../../routes/loggedIn/bettingTabs/sampleData';
import {Spinner} from '../spinner';
import {useNavigation} from '@react-navigation/native';
import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Button, Div, Overlay, Text} from 'react-native-magnus';
import {useDispatch, useSelector} from 'react-redux';

export type Connection = {isConnected: boolean; isConnecting: boolean};
type WatchConnectionModalProps = {
  open: boolean;
  connection: Connection;
  setConnection: Dispatch<SetStateAction<Connection>>;
  closeModal: () => void;
  onSuccess: () => void;
};

export function WatchConnectionModal(props: WatchConnectionModalProps) {
  const [loading, setLoading] = useState(true);
  const [bluetoothOn, setBluetoothOn] = useState(false);
  const [bleDevices, setBleDevices] = useState<string[][]>([]);
  const dispatch = useDispatch();
  const {deviceAddress, auth, token, user} = useSelector(
    state => state?.userData,
  );
  const {getString} = useAsyncStorage();
  const setAuth = useSetAuthValue();
  const navigation = useNavigation();

  // useEffect(() => {
  //   watchSdkEmitter.addListener('bleDevices', setBleDevices);
  //   watchSdkEmitter.addListener('connectionStatus', props.setConnection);
  //   const interval = setInterval(() => {
  //     getBluetoothStatusOnOff().then(setBluetoothOn).catch(console.log);
  //   }, 300);
  //   return () => {
  //     watchSdkEmitter.removeAllListeners('bleDevices');
  //     watchSdkEmitter.removeAllListeners('connectionStatus');
  //     if (interval) clearInterval(interval);
  //   };
  // }, []);

  useEffect(() => {
    if (!props.connection?.isConnected) return;
    setLoading(false);
    props.closeModal();
    props.onSuccess();
  }, [props.connection?.isConnected]);

  const onSelectDevice = async (deviceAddress: string) => {
    try {
      await selectBleDevice(deviceAddress)
        .then(() => {
          dispatch(setDeviceAddress(deviceAddress));
          props.closeModal();
          return;
          setTimeout(() => {
            SaveDevice(deviceAddress);
          }, 300);
        })
        .catch(() => {
          dispatch(setDeviceAddress(''));
        });
      setLoading(false);
    } catch (err: any) {
      dispatch(setDeviceAddress(''));
    }
  };

  //save device to database
  async function SaveDevice(deviceAddress) {
    if (!token) {
      setAuth(prev => ({...prev, isAuthenticated: false}));
      dispatch(setToken(''));
      dispatch(setAuthRedux(false));
      // @ts-ignore
      navigation.navigate({key: 'welcome', name: 'welcome'});
      return;
    }
    dispatch(setLoader(true));
    const body = {
      user_id: user?.id,
      device_id: deviceAddress,
    };
    try {
      const res = await addDevice(body, token);
      console.log('watch connect response-=-', res);
      dispatch(setLoader(false));
      // Watch Already Connected to Other Device
      // navigation.navigate({ key: 'bettingTabs', name: 'bettingTabs' })
      dispatch(setAuthRedux(true));
      return;
      if (res?.status == 200) {
        navigation.navigate({key: 'bettingTabs', name: 'bettingTabs'});
      } else {
        AppUtils.showToast_error('Watch is linked with another account');
        await disconnectDevice();
      }
    } catch (err) {
      dispatch(setLoader(false));
      console.log('error while adding device to user==3', err);
    }
  }

  return (
    <Overlay visible={props.open} p={0}>
      <Div pt={20} px={10} justifyContent="center" alignItems="center" mb={60}>
        {bleDevices.map((device, index) => (
          <Button
            key={index}
            h={55}
            w="100%"
            bg={baseColors.white}
            color={baseColors.theme}
            rounded={0}
            roundedBottomRight={6}
            onPress={() => onSelectDevice(device[0])}>
            <Text>
              {device[0]} := {device[1]}
            </Text>
          </Button>
        ))}

        {!bluetoothOn ? (
          <Text>Please turn on the Bluetooth on your phone</Text>
        ) : null}
        {bluetoothOn && loading ? <Spinner color={baseColors.theme} /> : null}
      </Div>

      {bluetoothOn ? (
        <Div
          w="100%"
          flexDir="row"
          borderTopColor={baseColors.themeLight}
          borderTopWidth={1}
          position="absolute"
          bottom={0}>
          <Button
            w="100%"
            bg={baseColors.themeLight}
            color={baseColors.white}
            onPress={props.closeModal}
            rounded={0}
            roundedBottom={6}>
            Cancel
          </Button>
        </Div>
      ) : null}
    </Overlay>
  );
}
