import {useEffect} from 'react';
import {useAuthValue} from '../atoms/auth';
import Loader from '../components/Loader';
import {LoggedInStackRoutes} from './loggedIn';
import {LoggedOutStackRoutes} from './loggedOut';
import {NavigationContainer} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {listenToDeviceScans} from '../components/native';
import messaging, {AuthorizationStatus} from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {SaveFcm} from '../redux/Reducers/userData';
import {Platform} from 'react-native';

export function Router(): React.JSX.Element {
  const {auth, user, token} = useSelector(state => state?.userData);
  const {isAuthenticated} = useAuthValue();
  const {loader} = useSelector(state => state?.tempData);
  const dispatch = useDispatch();
  useEffect(() => {
    if (Platform.OS === 'android') {
      listenToDeviceScans();
    }
  }, []);

  async function requestPermission() {
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
      console.log('Notification permissions denied');
    } else if (
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED
    ) {
      console.log('Notification permissions already granted');
      GetFcmToken();
    }
  }

  useEffect(() => {
    requestPermission();
  }, []);

  const GetFcmToken = async () => {
    const authorizationStatus = await messaging().requestPermission();
    console.log('authoriztion ====', authorizationStatus);
    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      const token = await messaging().getToken();
      console.log('fcmmm token-=-', token);
      if (token && auth && token) {
        // AsyncStorage.setItem("fcmToken", token);
        // setDeviceToken(token);
        dispatch(SaveFcm(token));
      }
    } else {
      return '';
    }
  };
  return (
    <NavigationContainer>
      {auth ? <LoggedInStackRoutes /> : <LoggedOutStackRoutes />}
      {loader && <Loader />}
      <Toast />
    </NavigationContainer>
  );
}
