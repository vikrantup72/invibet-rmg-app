import AppUtils from '../../../Utils/appUtils';
import { hp, wp } from '../../../Utils/dimension';
import { submitAadharOtp } from '../../../api/Services/services';
import { useSetAuthValue } from '../../../atoms/auth';
import { useAuthDataState } from '../../../atoms/authData';
import CustomBtn from '../../../components/CustomBtn';
import AppImages from '../../../constants/AppImages';
import { baseColors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import { useAsyncStorage } from '../../../hooks/useAsyncStorage';
import { setLoader } from '../../../redux/Reducers/tempData';
import { Get_user_detail, setIsSkipped, setToken } from '../../../redux/Reducers/userData';
import { LoggedOutStackParamsList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import axios from 'axios';
import { createRef, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Snackbar, Text } from 'react-native-magnus';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

export function KycOtp({ navigation, route }: NativeStackScreenProps<LoggedOutStackParamsList, 'otp'>) {
    const { client_id } = route?.params ?? {}
    const { user, token } = useSelector(state => state?.userData)
    const [kycDetail, setkycDetail] = useState({})
    const setAuth = useSetAuthValue();
    const { getString } = useAsyncStorage();
    const snackbarRef = createRef<Snackbar>();
    const [loading, setLoading] = useState(false);
    const [authData, setAuthData] = useAuthDataState();
    const asyncStorage = useAsyncStorage();
    const dispatch = useDispatch();
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [otp, setOtp] = useState('')



    const verifyOtp = async () => {
        if (!token) {
            setAuth(prev => ({ ...prev, isAuthenticated: false }));
            dispatch(setToken(''));
            dispatch(setAuthRedux(false));
            // @ts-ignore
            // navigation.navigate({ key: 'welcome', name: 'welcome' });
            console.log('Navgation $$$$$$$ ====>')
            return;
            console.log('No Navigation ===> ***********')
        }
        dispatch(setLoader(true));
        try {
            const body = {
                client_id: client_id,
                otp: otp
            }
            const res = await submitAadharOtp(body, token);
            dispatch(setLoader(false));
            if (res?.status == 200) {
                dispatch(Get_user_detail())
                navigation.goBack()
                setTimeout(() => {
                    navigation.goBack()
                }, 300);
            }
            else {
                AppUtils.showToast_error(res?.data?.error?.message??'Something went wrong.Please try again.')
            }
        } catch (err) {
            dispatch(setLoader(false));
            console.log('error while generationg aadhar otp', err);
        }
    }
    return (
        <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: baseColors.white }}>
            <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flex: 1 }}>
                <View style={{ flex: 1, paddingHorizontal: wp(5), paddingTop: hp(2) }}>
                    <Pressable hitSlop={0.5} onPress={() => navigation.goBack()}>
                        <Image style={styles.BackIcon} source={AppImages.back_icon} resizeMode="contain" />
                    </Pressable>


                    <Text style={styles.brandName}>Enter confirmation code</Text>
                    {/* {`An SMS with a verification code has been sent to ${authData.mobileNumber.includes('+') ? authData.mobileNumber : `+91${authData.mobileNumber}` */}
                    <Text style={styles.desc}>
                        {`A verification code has been sent to your registered mobile number`}
                    </Text>

                    <View style={styles.otpview}>
                        <OTPInputView
                            code={otp}
                            onCodeChanged={text => setOtp(text)}
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
                                if (otp?.trim()?.length == 0) {
                                    AppUtils.showToast_error('Please enter otp');
                                    return;
                                } else if (otp?.trim()?.length > 0 && otp?.trim()?.length < 6) {
                                    AppUtils.showToast_error('Please enter valid otp');
                                    return;
                                } else {
                                    verifyOtp();
                                }
                            }}
                            btnName={'Verify Otp'}
                            textStyle={{ color: baseColors.white, fontWeight: '600', fontFamily: AppFonts.bold }}
                            btnStyle={{
                                marginTop: hp(2.5),
                                width: '100%',
                                backgroundColor: otp?.trim()?.length === 6 ? baseColors.btn_active : baseColors.btn_disable,
                            }}
                        />


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
        marginTop: hp(4),
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
