import { Platform } from 'react-native';
import AppUtils from '../../../Utils/appUtils';
import { hp, wp } from '../../../Utils/dimension';
import { useSetAuthValue } from '../../../atoms/auth';
import { useProfileDataState } from '../../../atoms/profileData';
import { IndexTop } from '../../../components/questionaire/indexTop';
import { AppConstant } from '../../../constants/AppConstants';
import AppImages from '../../../constants/AppImages';
import { baseColors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import axios from 'axios';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { setLoader } from '../../../redux/Reducers/tempData';
import { setToken, setAuthRedux, Get_user_detail } from '../../../redux/Reducers/userData';

export default function Question6({ navigation }) {
  const { token, user } = useSelector((state) => state?.userData);
  const [profile, setProfile] = useProfileDataState();
  const dispatch = useDispatch();

  const [tempHowActive, setTempHowActive] = useState(profile.howActive || '');

  const dataBtn = ['active', 'slightly-active', 'not-active'];
  const setAuth = useSetAuthValue();

  const HandlePress_connect = () => {
    setAuth(prev => ({ ...prev, isAuthenticated: false }));
    dispatch(setAuthRedux(false));
    // @ts-ignore
    setTimeout(() => {
      navigation.navigate('AddDevice');
    }, 100);
  };


  // selection Function 
  const handleSelection = async (item) => {
    setTempHowActive(item);

    // Update profile state
    setProfile((prev) => ({
      ...prev,
      howActive: item,
    }));

    // Check token
    if (!token) {
      dispatch(setToken(''));
      dispatch(setAuthRedux(false));
      navigation.navigate('welcome');
      return;
    }

    // API update profile
    const body = {
      age: profile.age,
      gender: profile.gender,
      // height: profile.height,
      height: profile?.weight,
      weight: isNaN(Number(profile.weight)) ? 70 : Number(profile.weight),
      health_issues: profile.health_issues.join(','),
      active: profile.howActive === 'active',
      name: profile?.name,
      user_activity: profile?.howActive,
      email: '',
    }

    console.log('Submitting_data:asfiusfgfgsiyfgdsfgsygsdfluygvfl++++++=============>', JSON.stringify(body));

    dispatch(setLoader(true));
    try {
      const res = await axios.post(`${AppConstant.baseurl}login/user-profile`, body, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });
      dispatch(setLoader(false));
      if (res?.status === 200) {
        dispatch(Get_user_detail(token));
        if (user.hasOwnProperty('device_id') && user?.device_id!=null) {
          dispatch(setAuthRedux(true))
          return
        }
        else {
          HandlePress_connect()
        }
      }
    } catch (err) {
      console.error('API Error **** =================================>', err?.response?.data || err?.message);
      dispatch(setLoader(false));
      AppUtils.showToast_error('Failed to update activity level');
    }
  };

  //skip
  const handleSkip = async () => {
    setProfile((prev) => ({
      ...prev,
      howActive: '',
    }));

    if (!token) {
      dispatch(setToken(''));
      dispatch(setAuthRedux(false));
      navigation.navigate('welcome');
      return;
    }

    // Ques skipped
    console.log('User skipped activity level selection.', ((user && user.hasOwnProperty('device_id') && ((user?.device_id != undefined) || (user?.device_id != null) || (user?.device_id != '')))));
    return
    if ((user && user.hasOwnProperty('device_id') && ((user?.device_id != undefined) || (user?.device_id != null) || (user?.device_id != '')))) {
      dispatch(setAuthRedux(true));
      return
    }
    else {
      navigation.navigate('AddDevice');
    }

    // navigation.navigate('AddDevice');
  };

  const SingleTab = ({ item }) => {
    return (
      <Pressable
        onPress={() => handleSelection(item)}
        style={[
          styles.btnMain,
          {
            backgroundColor: tempHowActive === item ? baseColors.theme : baseColors.white,
            borderRadius: 8,
            width: wp(90),
            borderColor: baseColors.btn_disable,
            borderWidth: 1,
          },
        ]}
      >
        <Text
          style={[
            styles.btntitle,
            {
              color: tempHowActive === item ? baseColors.white : baseColors.theme,
              textTransform: 'capitalize',
            },
          ]}
        >
          {item}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: baseColors.theme }}>
      <View style={styles.main}>
        <IndexTop index={6} max={6} />

        {/* Question Title */}
        <Text style={styles.title}>{'How active you are?'}</Text>
        <View style={{ flex: 1, overflow: 'hidden', width: '100%', alignItems: 'center' }}>
          <View style={styles.mainBtn}>
            {dataBtn.map((item, index) => {
              return <SingleTab key={index} item={item} />;
            })}
          </View>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={{ flex: 0.15, paddingHorizontal: wp(4), backgroundColor: baseColors.white }}>
        <View style={styles.bottomInner}>
          {/* Skip Button */}
          <Pressable
            hitSlop={20}
            onPress={handleSkip} // Skip n  navigate
            style={styles.nextbtnOuters}
          >
            <Text style={styles.skipTxt}>
              Skip for now
              <Image source={AppImages.right} style={styles.arrow} />
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingTop: Platform.OS === 'android' ? hp(12) : hp(7),
    backgroundColor: baseColors.white,
  },
  bottomInner: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: baseColors.white,
  },
  nextbtnOuter: {
    height: wp(9),
    width: wp(30),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: baseColors.themeLight,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    height: wp(4),
    width: wp(4),
    tintColor: baseColors.themeLight,
    resizeMode: 'contain',
  },
  title: {
    fontSize: RFValue(20),
    textAlign: 'center',
    color: baseColors.black,
    // fontWeight: '700',
    fontFamily: AppFonts.extraBold,
    marginTop: hp(3),
  },
  mainBtn: {
    flex: 1,
    marginTop: hp(3),
  },
  btnMain: {
    height: 52,
    marginTop: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btntitle: {
    fontFamily: AppFonts.bold,
    fontWeight: '500',
    fontSize: RFValue(12),
  },
  skipTxt: {
    fontSize: RFValue(12.5),
    textAlign: 'center',
    fontFamily: AppFonts.bold,
    color: baseColors.theme,
    fontWeight: '600',
  }
});
