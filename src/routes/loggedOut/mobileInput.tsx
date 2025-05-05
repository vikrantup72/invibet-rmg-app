import FastImage from 'react-native-fast-image';
import AppUtils from '../../Utils/appUtils';
import { hp, wp } from '../../Utils/dimension';
import { useAuthDataState } from '../../atoms/authData';
import CommanTextInput from '../../components/CommanTextInput';
import CustomBtn from '../../components/CustomBtn';
import { FacebookIcon, GoogleIcon } from '../../components/GoogleIcon';
import { BrandLogo, Description } from '../../components/loginFlow/helpers';
import { Spinner } from '../../components/spinner';
import AppImages from '../../constants/AppImages';
import { baseColors } from '../../constants/colors';
import AppFonts from '../../constants/fonts';
import { setLoader } from '../../redux/Reducers/tempData';
import { setAuthRedux, setIsSkipped } from '../../redux/Reducers/userData';
import { LoggedOutStackParamsList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import { createRef, useEffect, useState } from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Div, Input, Snackbar, Text } from 'react-native-magnus';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

export function MobileInput({ navigation }: NativeStackScreenProps<LoggedOutStackParamsList, 'mobileInput'>) {
  const snackbarRef = createRef<Snackbar>();
  const [loading, setLoading] = useState(false);
  const [authData, setAuthData] = useAuthDataState();
  const [mobile, setMobile] = useState('');
  const [isValidMobile, setIsValidMobile] = useState(false);
  const [ageAbove18, setAgeAbove18] = useState(false)
  const dispatch = useDispatch();

  useEffect(() => {
    const isValid = authData.mobileNumber.trim().length === 10 && !isNaN(Number(authData.mobileNumber));
    setIsValidMobile(isValid);
  }, [authData.mobileNumber]);

  async function onPressSubmit() {
    dispatch(setLoader(true));
    try {
      setLoading(true);
      if (!authData.mobileNumber) {
        snackbarRef.current?.show('Please enter mobile number');
        return;
      }

      const res = await axios.post(`https://invibet-backend-280569053519.asia-south1.run.app/login/send-otp`, {
        phone_number: authData.mobileNumber.includes('+') ? authData.mobileNumber : `+91${authData.mobileNumber}`,
      });
      console.log('send otp res===', res);
      dispatch(setLoader(false));

      snackbarRef.current?.show(res.data.message || 'OTP Sent to this number');
      navigation.navigate({ key: 'otp', name: 'otp' });
    } catch (err: any) {
      dispatch(setLoader(false));
      console.log(err);
      snackbarRef.current?.show(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const OrBlock = () => {
    return (
      <View style={styles.blockMain}>
        <View style={styles.line} />
        <Text style={styles.or}>Or</Text>
        <View style={styles.line} />
      </View>
    );
  };

  const SocialLoginButton = ({ icon, text, onPress }) => {
    r
    return (
      <Pressable style={styles.socialBtns} onPress={onPress}>
        <Image style={styles.SocialIcon} source={icon} resizeMode="contain" />
        <Text style={styles.Socialtext}>{text}</Text>
      </Pressable>
    );
  };
  const socialButtons = [
    { id: 1, icon: AppImages.facebookLogin, text: 'Facebook', onPress: () => console.log('Facebook Login') },
    { id: 2, icon: AppImages.GoogleLogin, text: ' Google', onPress: () => console.log('Google Login') },
  ];

  const Check = () => {
    return (
      <Pressable onPress={() => setAgeAbove18(!ageAbove18)} hitSlop={20} style={styles.checkOuter} >
        {ageAbove18 && <FastImage source={AppImages.check} style={styles.checkImg} resizeMode='contain' />}
      </Pressable>
    )
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: baseColors.white }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ flex: 1, paddingHorizontal: wp(5) }}>

          <Text style={styles.brandName}>Unlock Rewards with Every Step 🏃‍♂️</Text>
          <Text style={styles.desc}>
            Grab {''}
            <Text style={styles.desc_highlight}>500 Pts </Text>
            instantly when you join
          </Text>

          <View style={styles.inputOuter}>
            <CommanTextInput
              titleTxt={'Sign in with Mobile Number'}
              titleTxyStyle={{
                color: baseColors.black,
                fontWeight: '400',
                fontSize: RFValue(12),
                fontFamily: AppFonts.medium,
                paddingVertical: hp(0.9),
              }}
              placeholder={'Enter your number'}
              value={`+91 ${authData.mobileNumber}`}
              keyboardType="number-pad"
              onChangeText={text => {
                const formattedText = text.replace('+91', '').trim();
                setAuthData(prev => ({ ...prev, mobileNumber: formattedText }));
              }}
            />
          </View>

          <Pressable onPress={() => setAgeAbove18(!ageAbove18)} hitSlop={20} style={styles.decelerationOuter} >
            <Check />
            <Text style={styles.deceleration} >I certify that I am above 18 years.</Text>
          </Pressable>

          <View style={styles.btnOuter}>
            <CustomBtn
              onPress={() => {
                if (authData?.mobileNumber?.trim()?.length == 0) {
                  AppUtils.showToast_error('Please enter mobile number');
                  return;
                }
                else if (authData?.mobileNumber?.trim()?.length < 10) {
                  AppUtils.showToast_error('Please enter valid mobile number');
                  return;
                }
                else if (!ageAbove18) {
                  AppUtils.showToast_error('Please accept the age deceleration');
                  return;
                }
                onPressSubmit();
              }}
              btnName={'Send OTP & Get Started'}
              textStyle={{ color: baseColors.white, fontWeight: '600', fontFamily: AppFonts.bold }}
              btnStyle={{
                marginTop: hp(2.5),
                width: '100%',
                backgroundColor: (isValidMobile && ageAbove18) ? baseColors.btn_active : baseColors.btn_disable,
              }}
            />
          </View>
          <View style={styles.TnC}>
            <Text style={styles.TnC_txt}>By signing up, you agree to our</Text>
            <Text style={styles.TnC_txtHighlight} onPress={() => {
              navigation.navigate('TermsCondition')
              return
              Linking.openURL('https://tychee.in/terms-and-condition')
            }}>
              Terms & Conditions.
            </Text>
          </View>
        </View>

        <View style={{ flex: 0.1 }}>
          <Pressable onPress={() => {
            dispatch(setIsSkipped(true))
            setTimeout(() => {
              dispatch(setAuthRedux(true))
            }, 300);
          }} hitSlop={20} >
            <Text style={styles.skip}>Skip Whole Onboarding process</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  brandName: {
    // fontWeight: '700',
    fontSize: RFValue(16),
    fontFamily: AppFonts.extraBold,
    color: baseColors.black,
    marginTop: hp(5),
  },
  desc: {
    fontSize: RFValue(12.5),
    fontFamily: AppFonts.medium,
    color: baseColors.black,
    marginTop: hp(1),
  },
  desc_highlight: {
    fontSize: RFValue(12.5),
    fontFamily: AppFonts.bold,
    color: baseColors.black,
    fontWeight: '700',
  },
  inputOuter: {
    marginTop: hp(4),
  },
  blockMain: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(7),
  },
  line: {
    height: 2,
    width: '42%',
    backgroundColor: 'rgba(69,43,80,0.1)',
  },

  btnOuter: {
    width: '100%',
  },
  TnC: {
    marginTop: hp(4),
    alignItems: 'center',
  },
  TnC_txt: {
    fontSize: RFValue(11),
    fontFamily: AppFonts.medium,
    fontWeight: '500',
    color: baseColors.gray,
    paddingVertical: hp(0.5),
  },
  TnC_txtHighlight: {
    fontSize: RFValue(12),
    fontFamily: AppFonts.bold,
    fontWeight: '600',
    color: baseColors.black,
    textDecorationLine: 'underline',
  },
  or: {
    fontSize: RFValue(12),
    fontFamily: AppFonts.medium,
    color: baseColors.gray,
    fontWeight: '400',
    textAlign: 'center',
    // marginTop: hp(5),
  },
  socialBlocMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(3),
  },
  socialBtns: {
    flexDirection: 'row',
    paddingVertical: hp(2),
    alignItems: 'center',
    width: wp(40),
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    borderColor: baseColors.socialicon_border,
  },
  SocialIcon: {
    width: hp(6),
    height: wp(6),
  },
  Socialtext: {
    fontSize: RFValue(12.5),
    fontFamily: AppFonts.bold,
    fontWeight: '500',
    color: baseColors.black,
    alignItems: 'center',
    textAlign: 'center',
  },
  skip: {
    fontSize: RFValue(14),
    fontFamily: AppFonts.bold,
    color: baseColors.theme,
    alignSelf: 'center',
    textDecorationLine: 'underline',
  },
  checkOuter: {
    borderWidth: 1,
    height: wp(4),
    width: wp(4),
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp(0.5)
  },
  checkImg: {
    height: '100%',
    width: '100%'
  },
  deceleration: {
    marginLeft: wp(2),
    fontFamily: AppFonts.semiBold,
    color: baseColors.black,
    fontWeight: '400'
  },
  decelerationOuter: {
    flexDirection: 'row',
    marginTop: hp(2),
    alignItems: 'center'
  }
});
