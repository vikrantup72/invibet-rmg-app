package com.invibetLatest.smartwatch;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothProfile;
import android.content.Context;
import android.os.Build;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.invibetLatest.MainApplication;

import android.content.pm.PackageManager;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.lhzl.blelib.BleManager;
import com.lhzl.blelib.WriteCommandToBle;
import com.lhzl.blelib.bean.AlarmClockBean;
import com.lhzl.blelib.bean.BloodOxygenBean;
import com.lhzl.blelib.bean.BloodPressureBean;
import com.lhzl.blelib.bean.DayStepBean;
import com.lhzl.blelib.bean.HeartRateBean;
import com.lhzl.blelib.bean.SleepInfoBean;
import com.lhzl.blelib.bean.TemperatureBean;
import com.lhzl.blelib.bledata.BleDataProcessing;
import com.lhzl.blelib.data.BleDevice;
import com.lhzl.blelib.exception.BleException;
import com.lhzl.blelib.listener.BleScanListener;
import com.lhzl.blelib.listener.ConnectStateListener;
//import com.lhzl.blelib.listener.DialSizeChangeListener;
import com.lhzl.blelib.listener.OnAlarmClockChangeListener;
import com.lhzl.blelib.listener.OnBindDeviceListener;
import com.lhzl.blelib.listener.OnDataChangeListener;
import com.lhzl.blelib.listener.OnFindPhoneListener;
import com.lhzl.blelib.listener.OnMeasureExitListener;
import com.lhzl.blelib.listener.OnMusicControlListener;
import com.lhzl.blelib.listener.OnReadBatteryListener;
import com.lhzl.blelib.listener.OnRemoteCameraListener;
// import com.lhzl.blelib.listener.OnSettingInfoChangeListener;
import com.lhzl.blelib.listener.OnSettingResultListener;
import com.lhzl.blelib.listener.SyncStateListener;
import com.lhzl.blelib.scan.BleScanConfig;
import com.lhzl.blelib.service.NPNotificationService;
import com.lhzl.blelib.util.NotificationMsgUtil;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;

public class SmartWatchModule
		extends ReactContextBaseJavaModule
		implements OnDataChangeListener, OnReadBatteryListener, OnBindDeviceListener,
		OnRemoteCameraListener, OnSettingResultListener, OnMusicControlListener, OnMeasureExitListener,
		OnFindPhoneListener, OnAlarmClockChangeListener, SyncStateListener, ConnectStateListener {
	private static final String TAG = "SmartWatchModule";
	MainApplication instance = MainApplication.getApplication();
	Map<String, BleDevice> bleMap = new HashMap<>();
	ReactApplicationContext reactContext;
	private int listenerCount = 0;
	private String connectedBleDeviceAddress;
	AsyncStorage asyncStorage;

	boolean isConnecting = false;
	boolean isConnected = false;

	boolean isScanning = false;
	boolean isScanned = false;

	public SmartWatchModule(ReactApplicationContext reactContext) {
		super(reactContext);
		this.bleMap = new HashMap<>();
		this.reactContext = reactContext;
		this.asyncStorage = new AsyncStorage(reactContext);
	}

	@ReactMethod
	public void addListener(String eventName) {
		if (listenerCount == 0) {
			// Set up any upstream listeners or background tasks as necessary
		}

		listenerCount += 1;
	}

	public void sendBluetoothStatusToJs() {
		BluetoothAdapter bta = BluetoothAdapter.getDefaultAdapter();
		WritableMap map = new WritableNativeMap();
		map.putBoolean("status", bta.isEnabled());
		reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("bluetoothStatus", map);
	}

	@ReactMethod
	public void getBluetoothStatusOnOff(Promise promise) {
		BluetoothAdapter bta = BluetoothAdapter.getDefaultAdapter();
		promise.resolve(bta.isEnabled());
	}

	@ReactMethod
	public void removeListeners(Integer count) {
		listenerCount -= count;
		if (listenerCount == 0) {
			// Remove upstream listeners, stop unnecessary background tasks
		}
	}

	public static boolean isEnabled(Context context) {
		Set<String> packageNames = NotificationManagerCompat.getEnabledListenerPackages(context);
		return packageNames.contains(context.getPackageName());
	}

	@NonNull
	public String getName() {
		return "SmartWatchModule";
	}

	@ReactMethod
	public void findBand(Promise promise) {
		WriteCommandToBle.findBand();
		promise.resolve("Finding band");
	}

	@ReactMethod
	public void enableStepAutoUpdate(boolean enable, Promise promise) {
		WriteCommandToBle.setStepAutoUpdate(enable);
		promise.resolve("Step auto update " + (enable ? "enabled" : "disabled"));
	}

	@Override
	public void onDayStepChange(DayStepBean day) {
		Log.d(TAG, "onDayStepChange: " + day.getDate() + " " + day.getHourDataList());
	}

	@ReactMethod
	public void onTargetStepChange(int step, Promise promise) {
		WriteCommandToBle.setTargetStep(step);
		promise.resolve("Target step set to " + step);
	}

	@ReactMethod
	public void syncTime(Promise promise) {
		WriteCommandToBle.setDeviceTime();
		promise.resolve("Time has updated");
	}

	@Override
	public void onHRChange(List<HeartRateBean> hearRates) {
		Log.d(TAG, "onHRChange: " + hearRates);
		WritableArray array = new WritableNativeArray();
		hearRates.forEach(hr -> {
			WritableMap map = new WritableNativeMap();
			map.putInt("heartRate", hr.getValue());
			map.putString("time", hr.getTime());
			array.pushMap(map);
		});
		reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("heartRate", array);
	}

	@Override
	public void onBPChange(List<BloodPressureBean> bloodPressures) {
		Log.d(TAG, "onBPChange: " + bloodPressures);
		WritableArray array = new WritableNativeArray();
		bloodPressures.forEach(bp -> {
			WritableMap map = new WritableNativeMap();
			map.putInt("systolic", bp.getBpSystolic());
			map.putInt("diastolic", bp.getBpDiastolic());
			map.putString("time", bp.getTime());
			array.pushMap(map);
		});
		reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("bloodPressure", array);
	}

	@Override
	public void onSleepChange(SleepInfoBean sleepInfo) {
		Log.d(TAG, "onSleepChange: " + sleepInfo);
		WritableMap map = new WritableNativeMap();
		map.putString("date", sleepInfo.getDate());
		map.putInt("startTime", sleepInfo.getStartTime());
		map.putInt("endTime", sleepInfo.getEndTime());
		map.putInt("deepTime", sleepInfo.getDeepTime());
		map.putInt("lightTime", sleepInfo.getLightTime());
		map.putInt("remTime", sleepInfo.getRemTime());

		reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("sleepInfo", map);
	}

	@Override
	public void onRealTimeStepChange(int step, int distance, int calorie) {
		Log.d(TAG, "onRealTimeStepChange: " + step + " " + distance + " " + calorie);
		WritableMap map = new WritableNativeMap();
		map.putInt("step", step);
		map.putInt("distance", distance);
		map.putInt("calories", calorie);
		map.putString("time", Instant.now().toString());
		if (this.connectedBleDeviceAddress != null) {
			map.putString("device_id", this.connectedBleDeviceAddress);
		} else {
			map.putString("device_id", "unknown");
		}

		String day = Instant.now().toString().split("T")[0];
		asyncStorage.setItem("steps-" + day, map.toString());
		reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("stepChanged", map);
	}

	@Override
	public void onReadBattery(final int battery) {
		Log.d(TAG, "onReadBattery: " + battery);
		reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("battery", battery);
	}

	@Override
	public void onTemperatureChange(List<TemperatureBean> temperatures) {
		Log.d(TAG, "onTemperatureChange: " + temperatures);
		WritableArray array = new WritableNativeArray();
		temperatures.forEach(temp -> {
			WritableMap map = new WritableNativeMap();
			map.putDouble("temperature", temp.getValue());
			map.putString("time", temp.getTime());
			array.pushMap(map);
		});
		reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("temperature", array);
	}

	@Override
	public void onBOChange(BloodOxygenBean bloodOxygen) {
		Log.d(TAG, "onBOChange: " + bloodOxygen);
		WritableMap map = new WritableNativeMap();
		map.putInt("bloodOxygen", bloodOxygen.getValue());
		map.putString("time", bloodOxygen.getTime());
		reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("bloodOxygen", map);
	}

	private void sendConnectionStatusToJs() {
		WritableMap map = new WritableNativeMap();
		map.putBoolean("isConnecting", isConnecting);
		map.putBoolean("isConnected", isConnected);
		if (isConnected && (connectedBleDeviceAddress == null || connectedBleDeviceAddress.isEmpty())) {
			this.connectedBleDeviceAddress = asyncStorage.getItem("connectedBleDeviceAddress");
		}
		reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("connectionStatus", map);
	}

	private void sendScanStatusToJs() {
		WritableMap map = new WritableNativeMap();
		map.putBoolean("isScanning", isScanning);
		map.putBoolean("isScanned", isScanned);
		reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("scanStatus", map);
	}

	private void sendBleMapToJs() {
		WritableArray array = new WritableNativeArray();
		bleMap.forEach((key, value) -> {
			WritableArray item = new WritableNativeArray();
			item.pushString(key);
			item.pushString(value.getName());
			array.pushArray(item);
		});
		reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("bleDevices", array);
	}

	@ReactMethod
	public void getScannedDevices(Promise promise) {
		promise.resolve(bleMap);
	}

	@ReactMethod
	public void init(Promise promise) {
		try {
			BleManager.init(instance);
			Log.d(TAG, "Notification: " + isEnabled(instance)
					+ NotificationMsgUtil.isServiceExisted(instance, NPNotificationService.class));
			if (!isEnabled(instance)) {
				NotificationMsgUtil.goToSettingNotificationAccess(instance);
			}

			List<String> list = new ArrayList<>();
			list.add(Manifest.permission.ACCESS_FINE_LOCATION);
			if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
				list.add(Manifest.permission.BLUETOOTH_SCAN);
				list.add(Manifest.permission.BLUETOOTH_CONNECT);
			}

			String[] permissions = new String[list.size()];
			list.toArray(permissions);
			for (String permission : permissions) {
				if (ContextCompat.checkSelfPermission(instance, permission) != PackageManager.PERMISSION_GRANTED) {
					ActivityCompat.requestPermissions(Objects.requireNonNull(getCurrentActivity()), permissions, 1);
					break;
				}
			}

			BleManager.getInstance().autoStart();
			BleManager.getInstance().setAutoReconnect(true);
			BleManager.getInstance().setAppPush(true);
			if (BleManager.getInstance().isConnect()) {
				onConnectSuccess();
			}

			BleManager.setLog(true);
			promise.resolve("SmartWatchModule initialized");

			BleDataProcessing.getInstance().setOnDataChangeListener(this);
			BleDataProcessing.getInstance().setOnReadBatteryListener(this);
			BleDataProcessing.getInstance().setOnBindDeviceListener(this);
			BleDataProcessing.getInstance().setOnRemoteCameraListener(this);
			BleDataProcessing.getInstance().setOnSettingResultListener(this);
			BleDataProcessing.getInstance().setOnMusicControlListener(this);
			BleDataProcessing.getInstance().setOnMeasureExitListener(this);
			// BleDataProcessing.getInstance().setDialSizeChangeListener(this);
			BleDataProcessing.getInstance().setOnFindPhoneListener(this);
			BleDataProcessing.getInstance().setOnAlarmClockChangeListener(this);
			// BleDataProcessing.getInstance().setOnSettingInfoChangeListener(this);
			BleDataProcessing.getInstance().setSyncStateListener(this);
		} catch (Exception e) {
			promise.reject("INIT_ERROR", e.getMessage());
		}
	}

	@Override
	public void onFindPhone() {
	}

	@Override
	public void onFindPhoneEnd() {
	}

	private void scanDevices() {
		BleManager.getInstance().scan(new BleScanListener() {
			public void onScanStarted(boolean success) {
				isScanning = true;
				isScanned = false;
				Log.w(TAG, "onScanStarted");
				WritableMap map = new WritableNativeMap();
				map.putBoolean("isScanning", isScanning);
				map.putBoolean("isScanned", isScanned);
				reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("scanStatus", map);
			}

			public void onScanning(BleDevice bleDevice) {
				isScanning = true;
				isScanned = false;
				Log.w(TAG, "onScanning");
			}

			public void onScanFinished() {
				isScanning = false;
				isScanned = true;
				Log.w(TAG, "onScanFinished");
				WritableMap map = new WritableNativeMap();
				map.putBoolean("isScanning", isScanning);
				map.putBoolean("isScanned", isScanned);
				reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("scanStatus", map);
			}

			public void onLeScan(BleDevice bleDevice) {
				String deviceAddress = bleDevice.getDevice().getAddress();
				if (!TextUtils.isEmpty(bleDevice.getName()) && !bleMap.containsKey(deviceAddress)) {
					bleMap.put(deviceAddress, bleDevice);
					sendBleMapToJs();
					Log.w(TAG, "onLeScan: " + bleDevice.getName());
				}
			}
		});
	}



	@ReactMethod
	public void scanListener(Promise promise) {
		bleMap.clear();
		sendBleMapToJs();
		scanDevices();
		sendBluetoothStatusToJs();
	}

	@Override
	public void onRefuse() {
	}

	@Override
	public void onUnbindSuccess() {
	}

	@Override
	public void onBind(boolean isFirst) {
	}

	@ReactMethod
	public void onSelectDevice(String deviceAddress, Promise promise) {
		isConnecting = true;
		sendConnectionStatusToJs();
		if (BleManager.getInstance().isScanning()) {
			BleManager.getInstance().stopScan();
			Log.w(TAG, "onItemClick: STOPPED_SCAN");
		}

		BleDevice connectedDevice = bleMap.get(deviceAddress);
		if (connectedDevice == null) {
			promise.reject("DEVICE_NOT_FOUND", "Device not found");
			return;
		}

		BleManager.getInstance().connect(connectedDevice);
		asyncStorage.setItem("connectedBleDeviceAddress", connectedDevice.getDevice().getAddress());

		Timer timer = new Timer();
		TimerTask stopTask = new TimerTask() {
			@Override
			public void run() {
				timer.cancel();
				BleManager.getInstance().stopScan();
				onConnectFail(BleException.ERROR_CODE_TIMEOUT, "Connection timed out");
			}
		};

		TimerTask repeatedTask = new TimerTask() {
			@Override
			public void run() {
				Log.w(TAG, "run: Checking connection status");
				if (BleManager.getInstance().isConnect()) {
					timer.cancel();
					BleManager.getInstance().stopScan();
					onConnectSuccess();
				}
			}
		};

		timer.schedule(repeatedTask, 0, 300);
		timer.schedule(stopTask, 10000);
		promise.resolve("Connecting to " + deviceAddress);
	}

	@ReactMethod
	public void onStartConnect() {
		sendConnectionStatusToJs();
	}

	@ReactMethod
	public void onConnectSuccess() {
		isConnecting = false;
		isConnected = true;
		sendConnectionStatusToJs();
		Log.w(TAG, "onConnectSuccess");
	}

	@Override
	public void onConnectFail(BleException e) {
	}

	@ReactMethod
	public void onConnectFail(int code, String description) {
		isConnecting = false;
		isConnected = false;
		sendConnectionStatusToJs();
		Log.w(TAG, "onConnectFail: " + description);
	}

	@ReactMethod
	public void disconnect() {
		BleManager.getInstance().disconnectDevice();
		isConnected = false;
		isConnecting = false;
		sendConnectionStatusToJs();
	}

	@ReactMethod
	public void isDeviceConnected(Promise promise) {
		try {
			boolean isConnected = BleManager.getInstance().isConnect();
			promise.resolve(isConnected);
		} catch (Exception e) {
			promise.reject("BLE_ERROR", "Failed to check device connection", e);
		}
	}

	@ReactMethod
	public void onDisConnected() {

		isConnecting = false;
		isConnected = false;
		sendConnectionStatusToJs();
		Log.w(TAG, "onDisConnected");
	}

	@ReactMethod
	public void connectBT(Promise promise) {
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
			if (ActivityCompat.checkSelfPermission(getReactApplicationContext(),
					Manifest.permission.BLUETOOTH_CONNECT) == PackageManager.PERMISSION_GRANTED) {
				try {
					BleManager.getInstance().createBond();
					BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
					int a2dpState = adapter.getProfileConnectionState(BluetoothProfile.A2DP);
					a2dpState = BluetoothProfile.STATE_CONNECTED;
					promise.resolve(a2dpState);
				} catch (Exception e) {
					promise.reject("BONDING_ERROR", "Failed to create bond: " + e.getMessage());
				}
			} else {
				promise.reject("PERMISSION_DENIED", "BLUETOOTH_CONNECT permission not granted.");
			}
		} else {
			try {
				BleManager.getInstance().createBond();
				promise.resolve("Bonding started successfully!");
			} catch (Exception e) {
				promise.reject("BONDING_ERROR", "Failed to create bond: " + e.getMessage());
			}
		}
	}

	@Override
	public void onOpenCamera() {
	}

	@Override
	public void onTakePicture() {
	}

	@Override
	public void onCloseCamera() {
	}

	@Override
	public void onSettingResult(final int key, final boolean isSuccess) {
		// switch (key) {
		// case SetCallbackStatus.SET_SYSTEM_TIME:
		// showToast(isSuccess ? "Time set successfully" : "Time setting failed");
		// break;
		//
		// case SetCallbackStatus.SET_ALARM_CLOCK:
		// showToast(isSuccess ? "Alarm clock set successfully" : "Alarm setting
		// failed");
		// break;
		//
		// case SetCallbackStatus.SET_TARGET_STEP:
		// showToast(isSuccess ? "Goal set successfully" : "Target setup failed");
		// break;
		//
		// case SetCallbackStatus.SET_PROFILE:
		// showToast(isSuccess ? "User information set successfully" : "User information
		// setting failed");
		// break;
		//
		// case SetCallbackStatus.SET_SEDENTARY_REMIND:
		// showToast(isSuccess ? "Sedentary setting successful" : "Sedentary setup
		// failed");
		// break;
		//
		// case SetCallbackStatus.SET_WEAR_HAND:
		// showToast(isSuccess ? "Wearing mode set successfully" : "Wearing mode set
		// failed");
		// break;
		//
		// case SetCallbackStatus.SET_NOTIFY:
		// showToast(isSuccess ? "Notification set up successfully" : "Notification set
		// up failed");
		// break;
		//
		// case SetCallbackStatus.SET_VIBRATION:
		// showToast(isSuccess ? "Vibration setting successful" : "Vibration setting
		// failed");
		// break;
		//
		// case SetCallbackStatus.SET_RAISE_BRIGHTEN:
		// showToast(isSuccess ? "Raise your hand to brighten the screen and the setting
		// is successful" : "Raise your hand to brighten the screen and the setting
		// failed");
		// break;
		//
		// case SetCallbackStatus.SET_FIND_BAND:
		// showToast(isSuccess ? "Find the bracelet and set it up successfully" : "Find
		// the bracelet and set failed");
		// break;
		//
		// case SetCallbackStatus.SET_PHOTO_OPEN:
		// showToast(isSuccess ? "Photo settings successful" : "Photo settings failed");
		// break;
		//
		// case SetCallbackStatus.SET_SLEEP_MONITOR:
		// showToast(isSuccess ? "Sleep monitoring set up successfully" : "Sleep
		// monitoring set up failed");
		// break;
		//
		// case SetCallbackStatus.SET_DND_MODE:
		// showToast(isSuccess ? "Do not disturb mode set successfully" : "Do not
		// disturb mode set failed");
		// break;
		//
		// case SetCallbackStatus.SET_LANGUAGE:
		// showToast(isSuccess ? "Language set successfully" : "Language set failed");
		// break;
		//
		// case SetCallbackStatus.SET_HR_AUTO_TEST:
		// showToast(isSuccess ? "Heart rate automatic measurement set up successfully"
		// : "Heart rate automatic measurement set up failed");
		// break;
		//
		// case SetCallbackStatus.SET_TEMPERATURE_AUTO_TEST:
		// showToast(isSuccess ? "Automatic body temperature measurement set up
		// successfully" : "Body temperature measurement set up failed");
		// break;
		//
		// case SetCallbackStatus.SET_HOUR_UNIT:
		// showToast(isSuccess ? "Time display set successfully" : "Time display set
		// failed");
		// break;
		//
		// case SetCallbackStatus.SET_UNIT_SYSTEM:
		// showToast(isSuccess ? "Unit display set successfully" : "Unit display set
		// failed");
		// break;
		//
		// case SetCallbackStatus.SET_TODAY_WEATHER:
		// showToast(isSuccess ? "Weather set successfully" : "Weather set failed");
		// break;
		// }
	}

	@Override
	public void onMusicPlay() {
	}

	@Override
	public void onMusicPause() {
	}

	@Override
	public void onMusicLast() {
	}

	@Override
	public void onMusicNext() {
	}

	@Override
	public void onHRExit() {
	}

	@Override
	public void onBPExit() {
	}

	@Override
	public void onTemperatureExit() {
	}

	@Override
	public void onBOExit() {
	}

	// @Override
	// public void onDialSizeChange(int size) {}

	@Override
	public void onChange(List<AlarmClockBean> list) {
	}

	// @Override
	// public void onSedentaryInfoChange(boolean enable, boolean isLunchBreakEnable,
	// int step, int sedentaryTime, int startTime, int endTime, int repeat) {}
	//
	// @Override
	// public void onNotifySettingChange(boolean isTelNotify, boolean isSmsNotify,
	// boolean isWechatNotify, boolean isQQNotify, boolean isFacebookNotify, boolean
	// isTwitterNotify, boolean isSkypeNotify, boolean isLineNotify, boolean
	// isWhatsappNotify, boolean isKakaoTalkNotify, boolean isInstagramNotify) {}
	//
	// @Override
	// public void onSleepMonitorChange(boolean enable, int startHour, int startMin,
	// int endHour, int endMin) {}
	//
	// @Override
	// public void onWearHandChange(boolean isLeft) {}
	//
	// @Override
	// public void onLanguageChange(int languageCode) {}
	//
	// @Override
	// public void onVibrationChange(boolean enable) {}
	//
	// @Override
	// public void onRaiseBrighten(boolean enable, int startHour, int startMin, int
	// endHour, int endMin) {}
	//
	// @Override
	// public void onHrAutoTestChange(boolean enable, boolean enableSleepAssist, int
	// startHour, int startMin, int endHour, int endMin, int cycle) {}
	//
	// @Override
	// public void onDNDSettingChange(boolean enable, int startHour, int startMin,
	// int endHour, int endMin) {}
	//
	// @Override
	// public void onTemperatureAutoTestChange(boolean enable, int startHour, int
	// startMin, int endHour, int endMin, int cycle) {}

	@Override
	public void onSyncStart() {
	}

	@Override
	public void onSyncEnd() {
	}
}
