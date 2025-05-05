import AppUtils from '../../Utils/appUtils';
import { hp, wp } from '../../Utils/dimension';
import { get_user_detail, sendOTP } from '../../api/Services/services';
import { useAuthDataState } from '../../atoms/authData';
import CustomBtn from '../../components/CustomBtn';
import { BrandLogo, Description } from '../../components/loginFlow/helpers';
import { OTPTextInput } from '../../components/otpInput';
import { Spinner } from '../../components/spinner';
import AppImages from '../../constants/AppImages';
import { baseColors } from '../../constants/colors';
import AppFonts from '../../constants/fonts';
import { useAsyncStorage } from '../../hooks/useAsyncStorage';
import { setLoader } from '../../redux/Reducers/tempData';
import { Get_user_detail, SaveFcm, setAuthRedux, setIsSkipped, setToken } from '../../redux/Reducers/userData';
import { LoggedOutStackParamsList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import axios from 'axios';
import { createRef, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, TouchableWithoutFeedbackComponent, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Div, Snackbar, Text } from 'react-native-magnus';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import messaging, { AuthorizationStatus } from "@react-native-firebase/messaging";
import notifee, { AndroidImportance, EventType } from "@notifee/react-native";

export function Otp({ navigation }: NativeStackScreenProps<LoggedOutStackParamsList, 'otp'>) {
  const snackbarRef = createRef<Snackbar>();
  const [loading, setLoading] = useState(false);
  const [authData, setAuthData] = useAuthDataState();
  const asyncStorage = useAsyncStorage();
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false)
  const [fcm_token, setFcm_token] = useState('')

  const GetFcmToken = async () => {
    const authorizationStatus = await messaging().requestPermission();
    console.log('authoriztion ====', authorizationStatus)
    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      const token = await messaging().getToken();
      console.log("fcmmm token-=-", token);
      if (token && token) {
        // AsyncStorage.setItem("fcmToken", token);
        // setDeviceToken(token);
        setFcm_token(token)
        dispatch(SaveFcm(token))
      }
    } else {
      return "";
    }
  };

  useEffect(() => {
    if (!authData.mobileNumber) navigation.navigate({ key: 'mobileInput', name: 'mobileInput' });
  }, []);

  useEffect(() => {
    startTimer();
  }, []);

  const startTimer = () => {
    setCanResend(false);
    setTimer(30);
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  async function onPressSubmit() {
    try {
      if (!authData.otp) {
        // TODO: Show error message
        return;
      }
      console.log('hereeee');

      dispatch(setLoader(true));
      const res = await axios.post(`https://invibet-backend-280569053519.asia-south1.run.app//login/verify-otp`, {
        phone_number: authData.mobileNumber.includes('+') ? authData.mobileNumber : `+91${authData.mobileNumber}`,
        otp: authData.otp,
        fcm_token: fcm_token
      });
      // console.log('verify otp res===>', res);
      dispatch(setLoader(false));
      if (res.status == 200) {
        await asyncStorage.setString('token', res.data.token);

        dispatch(setToken(res.data.token));
        GetProfilData(res.data.token);
        setAuthData(prev => ({ ...prev, otp: '' }));
        dispatch(setIsSkipped(false))
      }
    } catch (err: any) {
      dispatch(setLoader(false));
      // console.log('error:', err);
      AppUtils.showToast_error('Invalid otp');
    } finally {
      setLoading(false);
    }
  }

  const GetProfilData = token => {
    try {
      get_user_detail(token).then(res => {
        if (res?.status == 200) {
          const data = res?.data?.data;
          if (!res?.data?.data?.active) {
            AppUtils.showToast_error('Your account is inactive.');
            return;
          }
          // navigation.navigate('product/tnc')
          // navigation.navigate({ key: 'nameInput', name: 'nameInput' });
          // return
          if (data?.name == null && data?.health_issues == null) {
            navigation.navigate({ key: 'nameInput', name: 'nameInput' });
          } else {
            dispatch(Get_user_detail(token));
            if (data.hasOwnProperty('device_id') && data?.device_id != null) {
              setTimeout(() => {
                dispatch(setAuthRedux(true));
                GetFcmToken()
              }, 500);
            }
            else {
              navigation.navigate('AddDevice');
            }

          }
        }
      });
    } catch (error) {
      console.log('error while gettting user input-=-==', error);
      // navigation.navigate({ key: 'nameInput', name: 'nameInput' });
    } finally {
    }
  };

  const resendOTP = async () => {
    try {
      dispatch(setLoader(true));
      const phoneNumber = authData.mobileNumber.includes('+') ? authData.mobileNumber : `+91${authData.mobileNumber}`;
      await sendOTP({ phone_number: phoneNumber });
      AppUtils.showToast('OTP sent successfully');
      startTimer();
    } catch (error) {
      console.error('Error sending OTP:', error);
      AppUtils.showToast_error('Failed to send OTP');
    } finally {
      dispatch(setLoader(false));
    }
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: baseColors.white }}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: wp(5), paddingTop: hp(2) }}>
          <Pressable hitSlop={0.5} onPress={() => navigation.goBack()}>
            <Image style={styles.BackIcon} source={AppImages.back_icon} resizeMode="contain" />
          </Pressable>
          {/* <Div bg={baseColors.white} h="100%">
      <Div alignItems="center" p="lg" pt={124} px={20}>
        <Div my={5} />
        <Description
          title="Enter OTP"
          description={`A 6-digit code has been sent to your number ${
            authData.mobileNumber.includes('+') ? authData.mobileNumber : `+91${authData.mobileNumber}`
          }`}
          textProps={{ color: baseColors.theme }}
        />
      </Div>

      <Div px={20}>
        <Text color={baseColors.theme} fontWeight="600" mb={10}>
          Enter OTP
        </Text>

        <OTPTextInput handleTextChange={text => setAuthData(prev => ({ ...prev, otp: text }))} containerStyle={{ marginBottom: 16 }} />

        <Button bg={baseColors.theme} w="100%" px={36} py={12} onPress={onPressSubmit} disabled={loading}>
          <Text fontSize="lg" fontWeight="500" color={baseColors.white} pr={10}>
            Submit
          </Text>
          {loading ? <Spinner /> : null}
        </Button>
      </Div>

      <Snackbar mb={80} duration={5000} ref={snackbarRef} color={baseColors.white} bg={baseColors.themeLight} />
    </Div> */}

          <Text style={styles.brandName}>Enter confirmation code</Text>
          {/* {`An SMS with a verification code has been sent to ${authData.mobileNumber.includes('+') ? authData.mobileNumber : `+91${authData.mobileNumber}` */}
          <Text style={styles.desc}>
            {`A verification code has been sent to your WhatsApp`}{' '}
            {''}
            <Text style={styles.desc_highlight} onPress={() => navigation.goBack()}>
              Edit
            </Text>
          </Text>

          <View style={styles.otpview}>
            <OTPInputView
              code={authData?.otp}
              onCodeChanged={text => setAuthData(prev => ({ ...prev, otp: text }))}
              pinCount={6}
              autoFocusOnLoad={false}
              codeInputFieldStyle={styles.underlineStyleBase}
              placeholderCharacter={'*'}
              placeholderTextColor={baseColors.placeholder}
            />
          </View>

          <View style={styles.btnOuter}>
            <CustomBtn
              onPress={() => {
                if (authData?.otp?.trim()?.length == 0) {
                  AppUtils.showToast_error('Please enter otp');
                  return;
                } else if (authData?.otp?.trim()?.length > 0 && authData?.otp?.trim()?.length < 6) {
                  AppUtils.showToast_error('Please enter valid otp');
                  return;
                } else {
                  onPressSubmit();
                }
              }}
              btnName={'Verify Number'}
              textStyle={{ color: baseColors.white, fontWeight: '600', fontFamily: AppFonts.bold }}
              btnStyle={{
                marginTop: hp(2.5),
                width: '100%',
                backgroundColor: authData?.otp?.trim()?.length === 6 ? baseColors.btn_active : baseColors.btn_disable,
              }}
            />

            <Pressable onPress={canResend ? resendOTP : undefined}>
              <Text style={styles.noCodeText}>
                {timer > 0 ? `Send code again ${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}` : ''}
                {timer == 0 && (
                  <Text style={styles.noCodeText}>
                    I didn't receive a code{' '}
                    <Text onPress={resendOTP} style={styles.resendHighlight}>
                      Resend
                    </Text>
                  </Text>
                )}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
  },
  BackIcon: {
    width: wp(5),
    height: hp(5),
  },
  brandName: {
    fontSize: RFValue(16),
    fontFamily: AppFonts.extraBold,
    color: baseColors.black,
    marginTop: hp(5),
    // fontWeight: '700',
  },
  desc: {
    fontSize: RFValue(12),
    fontFamily: AppFonts.medium,
    color: baseColors.black,
    marginTop: hp(1),
    lineHeight: hp(2.5),
  },
  desc_highlight: {
    fontSize: RFValue(12),
    fontFamily: AppFonts.semibold,
    color: baseColors.link,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  otpview: {
    width: wp(90),
    height: wp(19),
    alignSelf: 'center',
    marginTop: hp(6),
  },
  underlineStyleBase: {
    fontSize: RFValue(23),
    width: wp(13),
    height: wp(15),
    maxHeight: 65,
    maxWidth: 60,
    backgroundColor: baseColors.otpBackground,
    borderRadius: 5,
    color: baseColors.theme,
  },
  enterOtp: {
    fontSize: RFValue(12),
    fontFamily: AppFonts.semibold,
    color: baseColors.theme,
    fontWeight: '500',
    textAlign: 'left',
  },
  btnOuter: {
    width: '100%',
    marginTop: hp(1.5),
  },
  resendHighlight: {
    color: baseColors.link,
    fontSize: RFValue(12),
    fontFamily: AppFonts.bold,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  noCodeText: {
    fontSize: RFValue(11),
    fontFamily: AppFonts.medium,
    color: baseColors.gray,
    textAlign: 'center',
    marginTop: hp(2.5),
  },
});
