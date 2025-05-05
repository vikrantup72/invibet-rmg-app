// DO NOT MODIFY THIS FILE
// This file contains the native-bindings from java to react-native.
// It is used to communicate with the native android code.
import {NativeEventEmitter, NativeModules} from 'react-native';

export const watchSdk = NativeModules.SmartWatchModule;
export const watchSdkEmitter = new NativeEventEmitter(watchSdk);

export const initWatchSdk = watchSdk.init;
export const selectBleDevice = watchSdk.onSelectDevice;
export const listenToDeviceScans = watchSdk.scanListener;
export const onStartConnect = watchSdk.onStartConnect;
export const enableStepAutoUpdate = watchSdk.enableStepAutoUpdate;
export const getBluetoothStatusOnOff = watchSdk.getBluetoothStatusOnOff;
export const disconnectDevice = watchSdk.disconnect;
export const syncDeviceTime = watchSdk.syncTime;
export const isDeviceConnected = watchSdk.isDeviceConnected;
export const connectBT = watchSdk.connectBT;
