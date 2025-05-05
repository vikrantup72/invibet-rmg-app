import AppUtils from '../../../Utils/appUtils';
import { hp, wp } from '../../../Utils/dimension';
import { update_profile } from '../../../api/Services/services';
import { useSetAuthValue } from '../../../atoms/auth';
import CommonAlertModal from '../../../components/CommonAlertModal';
import Gamesview from '../../../components/Gamesview';
import { BettingTopBar } from '../../../components/betting/topBar';
import { disconnectDevice } from '../../../components/native';
import AppImages from '../../../constants/AppImages';
import { baseColors, colors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import { setConnection_status, setLoader } from '../../../redux/Reducers/tempData';
import { setAuthRedux, setDeviceAddress, setIsSkipped, setToken, setUser } from '../../../redux/Reducers/userData';
import { LoggedInBettingTabsParamsList } from '../../types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import { Alert, FlatList, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Div } from 'react-native-magnus';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncStorage } from '../../../hooks/useAsyncStorage';
import CustomBtn from '../../../components/CustomBtn';

export function Setting({ navigation }) {
  const { deviceAddress, auth, token, user } = useSelector(state => state?.userData);
  const [modalType, setModalType] = useState('logout');
  const [modalVis, setModalVis] = useState(false);
  const asyncStorage = useAsyncStorage();
  const setAuth = useSetAuthValue();
  const dispatch = useDispatch();
  const data = [
    { title: 'About Us', status: '' },
    { title: 'Terms & Conditions', route: '' },
    { title: 'Delete Account', route: '' },
    { title: 'Logout', route: '' },
  ];

  const RenderItem = ({ item, index, onPress }) => {
    return (
      <Pressable onPress={onPress} style={style.listMain}>
        <Pressable onPress={onPress} style={style.listinner}>
          <Text style={style.listTitle}>{item?.title}</Text>
          {index != 3 && <Image source={index == 2 ? AppImages.deteleLogo : AppImages.arrow_right} style={style.arrow} />}
        </Pressable>
      </Pressable>
    );
  };

  const onLogout = async () => {
    setAuth(prev => ({ ...prev, isAuthenticated: false }));
    dispatch(setToken(''));
    dispatch(setAuthRedux(false));
    dispatch(setUser({}))
    dispatch(setDeviceAddress(''))
    dispatch(setIsSkipped(false))
    dispatch(setConnection_status({ isConnected: false, isConnecting: false }))
    await disconnectDevice();
    await asyncStorage.setString('token', '');

    // @ts-ignore
    navigation.navigate({ key: 'splash', name: 'splash' });
  };

  const onDelete = async () => {
    if (!token) {
      setAuth(prev => ({ ...prev, isAuthenticated: false }));
      dispatch(setToken(''));
      dispatch(setAuthRedux(false));
      // @ts-ignore
      navigation.navigate({ key: 'splash', name: 'splash' });
      return;
    }
    const body = {
      active: false,
    };
    dispatch(setLoader(true));
    try {
      const res = await update_profile(body, token);
      console.log('update res-= -', res);
      dispatch(setLoader(false));
      if (res?.status == 200) {
        AppUtils.showToast('Account deleted successfully');
        onLogout()
      } else {
      }
    } catch (err) {
      dispatch(setLoader(false));
      AppUtils.showToast_error('Something went wrong, try again');
      console.log('error while updating profile', err);
    }
  };

  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar title="Settings" noIcons />

      <View style={style.main}>
        <View style={{ width: '100%', marginTop: hp(2) }}>
          <FlatList
            scrollEnabled={false}
            keyExtractor={(item, index) => index}
            data={data}
            ItemSeparatorComponent={() => {
              return <View style={style.seperator} />;
            }}
            renderItem={({ item, index }) => (
              <RenderItem
                item={item}
                index={index}
                onPress={() => {
                  if (index == 0) {
                    navigation.navigate('HelpCenter')
                    return
                    Linking.openURL('https://tychee.in');
                  } else if (index == 1) {
                    navigation.navigate('TermsCondition')
                    return
                    Linking.openURL('https://tychee.in/terms-and-condition');
                  } else if (index == 2) {
                    setModalType('delete');
                    setTimeout(() => {
                      setModalVis(true);
                    }, 300);
                  } else {
                    setModalType('logout');
                    setTimeout(() => {
                      setModalVis(true);
                    }, 300);
                  }
                }}
              />
            )}
          />
        </View>
   


      </View>
      <CommonAlertModal
        visible={modalVis}
        title={modalType == 'delete' ? 'Delete Account' : 'Logout'}
        subTitle={modalType == 'delete' ? 'Are you sure you want to delete the account?' : 'Are you sure you want to Logout the account?'}
        onCanclePress={() => setModalVis(false)}
        onOkPerss={() => {
          setModalVis(false);
          setTimeout(() => {
            if (modalType == 'delete') {
              onDelete();
            } else {
              onLogout();
            }
          }, 300);
        }}
      />
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
    color: baseColors.theme,
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
});
