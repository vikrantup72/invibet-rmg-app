import FastImage from 'react-native-fast-image';
import {hp, wp} from '../../Utils/dimension';
import CustomBtn from '../../components/CustomBtn';
import {
  getBluetoothStatusOnOff,
  listenToDeviceScans,
  watchSdkEmitter,
} from '../../components/native';
import AppImages from '../../constants/AppImages';
import {baseColors} from '../../constants/colors';
import AppFonts from '../../constants/fonts';
import {setConnection_status} from '../../redux/Reducers/tempData';
import userData from '../../redux/Reducers/userData';
import {setIsSkipped, setAuthRedux} from '../../redux/Reducers/userData';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Alert,
  Modal,
  Linking,
  Platform,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';

const DeviceSetup = ({navigation}) => {
  //Redux
  const {deviceAddress, auth, token, user} = useSelector(
    state => state?.userData,
  );
  console.log('-=-', user);
  const dispatch = useDispatch();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [bluetoothStatus, setBluetoothStatus] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [bluetoothOn, setBluetoothOn] = useState(false);
  const [bleDevices, setBleDevices] = useState([]);
  const isFocused = useIsFocused();
  const [scanStatus, setScanStatus] = useState({
    isScanned: false,
    isScanning: false,
  });

  const filters = ['All', 'Smart Watch', 'Tracker'];

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
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const goToBluetoothSettings = async () => {
    if (Platform.OS === 'ios') {
      // await Linking.openURL('App-Prefs:Bluetooth');
    } else {
      await Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS');
    }
  };

  useEffect(() => {
    listenToDeviceScans();

    const interval = setInterval(() => {
      getBluetoothStatusOnOff()
        .then(bleStatus => {
          setBluetoothOn(bleStatus);
        })
        .catch(console.log);
    }, 300);

    watchSdkEmitter.addListener('scanStatus', scanStatus => {
      setScanStatus(scanStatus);
      // console.log('scanStatus-=-=', scanStatus);
    });
    watchSdkEmitter.addListener('bleDevices', setBleDevices);
    watchSdkEmitter.addListener('connectionStatus', connection => {
      // console.log('connection-=-=', connection);
      dispatch(setConnection_status(connection));
    });
    return () => {
      watchSdkEmitter.removeAllListeners('bleDevices');
      watchSdkEmitter.removeAllListeners('connectionStatus');
      if (interval) clearInterval(interval);
    };
  }, [isFocused]);

  const onScan = async () => {
    listenToDeviceScans();
  };

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      key={index}
      onPress={() =>
        navigation.navigate('DeviceOverview', {
          product: {
            image: item.image,
            name: item.name,
            title: item.title,
          },
          deviceInfo: item,
        })
      }
      style={styles.card}>
      <Image source={AppImages.logo} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.productName}>{item?.[1] ?? ''}</Text>
        <Text style={styles.category}>{item?.[0]}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.main}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Select Device</Text>
        <Pressable hitSlop={20} onPress={() => navigation.goBack()}>
          <Image
            source={AppImages.decline}
            style={styles.decline_img}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        {filters.map(filter => (
          <Pressable
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.selectedButton,
            ]}
            onPress={() => setSelectedFilter(filter)}>
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.selectedText,
              ]}>
              {filter}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Product List */}
      <FlatList
        data={bleDevices}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
        ListEmptyComponent={() => {
          return (
            <View>
              <Text style={styles.noDataFound}>No data found.</Text>
            </View>
          );
        }}
        ListFooterComponent={() => {
          return (
            !(
              scanStatus?.isScanned == false && scanStatus?.isScanning == false
            ) &&
            scanStatus?.isScanning && (
              <FastImage
                source={AppImages.loading}
                style={styles.loading}
                resizeMode="contain"
              />
            )
          );
        }}
      />

      {scanStatus?.isScanned && (
        <CustomBtn
          btnName={'Scan again'}
          textStyle={{
            color: baseColors.white,
            fontFamily: AppFonts.bold,
            fontWeight: '600',
          }}
          btnStyle={{
            marginVertical: hp(1),
            backgroundColor: baseColors.theme,
            borderColor: baseColors.theme,
            borderWidth: 1,
            marginBottom: hp(0.5),
          }}
          onPress={() => {
            onScan();
          }}
        />
      )}

      <CustomBtn
        btnName={'Buy a New Device'}
        textStyle={{
          color: baseColors.white,
          fontFamily: AppFonts.bold,
          fontWeight: '600',
        }}
        btnStyle={{
          marginVertical: hp(1),
          backgroundColor: baseColors.theme,
          borderColor: baseColors.theme,
          borderWidth: 1,
          marginBottom: hp(2),
        }}
        onPress={() => {
          dispatch(setAuthRedux(true));
          dispatch(setIsSkipped(false));
          console.log('Redux Update===>===>===>', userData);
          setTimeout(() => {
            navigation.navigate('bettingTabs', {screen: 'betting/shop'});
          }, 100);
        }}
      />
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
  );
};

export default DeviceSetup;

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    paddingVertical: hp(1),
  },
  decline_img: {
    width: wp(3),
    height: hp(2),
    resizeMode: 'contain',
    tintColor: baseColors.theme,
    marginTop: hp(1.2),
  },
  main: {
    flex: 1,
    backgroundColor: baseColors.white,
    paddingHorizontal: wp(5),
    paddingTop: hp(3),
  },
  title: {
    fontSize: RFValue(16),
    color: baseColors.black,
    fontFamily: AppFonts.medium,
    fontWeight: '600',
    marginBottom: hp(2),
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(3),
    paddingHorizontal: wp(1),
  },
  filterButton: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(1),
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: baseColors.btn_disable,
    backgroundColor: baseColors.white,
    marginRight: wp(2),
  },
  selectedButton: {
    backgroundColor: baseColors.theme,
  },
  filterText: {
    color: baseColors.theme,
    fontSize: RFValue(12),
    fontWeight: '600',
    fontFamily: AppFonts.medium,
  },
  selectedText: {
    color: baseColors.white,
  },
  productList: {
    paddingBottom: hp(3),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: baseColors.white,
    paddingVertical: wp(4),
    borderBottomColor: baseColors.btm_prd_border,
    borderBottomWidth: 1,
    marginBottom: hp(1),
  },
  image: {
    width: wp(13),
    height: wp(13),
    marginRight: wp(4),
    resizeMode: 'contain',
    borderRadius: wp(13),
  },
  textContainer: {
    flex: 1,
  },
  productName: {
    fontSize: RFValue(13),
    fontWeight: '400',
    color: baseColors.black,
    fontFamily: AppFonts.regular,
  },
  category: {
    fontSize: RFValue(11),
    color: baseColors.gray,
    fontFamily: AppFonts.regular,
    marginTop: hp(0.5),
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
  loading: {
    height: 40,
    width: 40,
    alignSelf: 'center',
  },
  noDataFound: {
    fontSize: 12,
    fontWeight: '500',
    color: baseColors.black,
    alignSelf: 'center',
    marginBottom: hp(2),
  },
});
