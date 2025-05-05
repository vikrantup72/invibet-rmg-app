import {AuthState, authAtom} from './atoms/auth';
import {initWatchSdk, listenToDeviceScans} from './components/native';
import {useAsyncStorage} from './hooks/useAsyncStorage';
import {persistor, store} from './redux/Store/store';
import {Router} from './routes';
import {ThemeProvider, DefaultTheme, DarkTheme} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  LogBox,
  Platform,
  useColorScheme,
} from 'react-native';
import {ThemeProvider as MagnusThemeProvider} from 'react-native-magnus';
import Toast from 'react-native-toast-message';
import {Provider, useDispatch} from 'react-redux';
import {RecoilRoot} from 'recoil';
import {PersistGate} from 'redux-persist/integration/react';
import messaging, {AuthorizationStatus} from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {SaveFcm} from './redux/Reducers/userData';
// import Cashfree from 'react-native-cashfree-pg-sdk';

export function App(): React.JSX.Element {
  const {token, auth} = store.getState().userData;

  const colorScheme = useColorScheme();
  const [initRes, setInitRes] = useState<AuthState | null>(null);
  const asyncStorage = useAsyncStorage();

  const firebaseConfig = {
    apiKey: 'AIzaSyDkNVc3UKadilkdvESIKpgP_6x9x11MEKo',
    authDomain: 'invibet-backend.firebaseapp.com',
    projectId: 'invibet-backend',
    storageBucket: 'invibet-backend.firebasestorage.app',
    messagingSenderId: '317308507674',
    appId: '1:317308507674:web:0b60e2a92744f95a8b23a3',
    measurementId: 'G-1BCVYHC6BP',
  };

  // React.useEffect(() => {
  //   LogBox.ignoreAllLogs();
  //   const unsubscribe = messaging().onMessage(onMessageReceived);
  //   // messaging().setBackgroundMessageHandler(onMessageReceived);
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  const checkSignIn = useCallback(async () => {
    const token = await asyncStorage.getString('token');
    setInitRes({isAuthenticated: !!token});
  }, []);

  useEffect(() => {
    checkSignIn();
    try {
      if (Platform.OS === 'android') {
        initWatchSdk().then(console.log).catch(console.error);
      }
      LogBox.ignoreAllLogs();
    } catch (error) {
      console.log('watch sdk initialize error : ', error);
    }
  }, []);

  if (!initRes) return <ActivityIndicator size="large" />;
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <RecoilRoot initializeState={({set}) => set(authAtom, initRes)}>
            <MagnusThemeProvider
              theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Router />
            </MagnusThemeProvider>
          </RecoilRoot>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
