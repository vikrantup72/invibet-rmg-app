import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { baseColors } from '../../../constants/colors'
import SimpleHeader from '../../../components/SimpleHeader'
import { SafeAreaView } from 'react-native-safe-area-context'
import { hp, wp } from '../../../Utils/dimension'
import { RFValue } from 'react-native-responsive-fontsize'
import AppFonts from '../../../constants/fonts'
import CommanTextInput from '../../../components/CommanTextInput'
import CommanDateInput from '../../../components/CommanDateInput'
import AppImages from '../../../constants/AppImages'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-crop-picker';
import AppUtils from '../../../Utils/appUtils'
import { useFocusEffect } from '@react-navigation/native'
import { constSelector } from 'recoil'
import CustomBtn from '../../../components/CustomBtn'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const Tabs = ({ onLeftPress, onRightPress }) => {
    return (
        <View style={styles.tabmain} >
            <Pressable onPress={onLeftPress} style={[styles.laftTab, styles.commonStyleTab]} >
                <Text style={styles.tabtext} >Upload</Text>
                <FastImage source={AppImages.upload} style={styles.tabIcon} resizeMode='contain' />
            </Pressable>
            <Pressable onPress={onRightPress} style={[styles.rightTab, styles.commonStyleTab]} >
                <Text style={styles.tabtext} >Take a photo</Text>
                <FastImage source={AppImages.camera} style={styles.tabIcon} resizeMode='contain' />
            </Pressable>
        </View>
    )
}

export default function Kyc({ navigation }) {
 
    const [kycDetail, setkycDetail] = useState({})
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [media, setMedia] = useState({})
    const [validation, setValidation] = useState(false)

    // useFocusEffect(
    //     useCallback(() => {
    //         setMedia({})
    //     }, []),
    // );

    const openCamera = () => {
        console.log('i am here')
        ImagePicker.openCamera({
            maxFiles: 1
        }).then(image => {
            setMedia(image)
            console.log("camera===", image)
        });
    };

    const openGallery = () => {
        try {
            ImagePicker.openPicker({
                mediaType: 'photo',
                maxFiles: 1
            }).then(image => {
                setMedia(image)
                console.log('gallary====', image)
            });
        } catch (error) {
            AppUtils.showToast(error?.message ?? "Error")
        }
    };

    useEffect(() => {
        verify()
    }, [media, kycDetail])


    const verify = () => {
        if (kycDetail?.name?.trim()?.length == 0) {
            // AppUtils.showToast_error('Please enter full name')
            setValidation(false)
        }
        else if (kycDetail?.pan?.trim()?.length == 0) {
            // AppUtils.showToast_error('Please enter PAN number')
            setValidation(false)
        }
        else if (kycDetail?.dob?.trim()?.length == 0) {
            // AppUtils.showToast_error('Please enter DOB')
            setValidation(false)
        }
        else if (!media?.hasOwnProperty('filename')) {
            // AppUtils.showToast_error('Please upload image of document')
            setValidation(false)
        }
        else {
            setValidation(true)
        }

    }




    return (
        <SafeAreaView edges={['top']} style={styles.main} >
            <SimpleHeader title={'Complete KYC'} />
            <KeyboardAwareScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={'handled'} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: wp(5) }} >

                <Text style={styles.title} >KYC Verification </Text>
                <Text style={styles.desc} >Complete your KYC to enable Withdrawls</Text>

                <View style={{ marginTop: hp(2) }} >
                    <CommanTextInput titleTxt={'Your Full Name'}
                        onChangeText={t => setkycDetail({ ...kycDetail, name: t })}
                        placeholder={'Enter your name as per Aadhaar'}
                        value={kycDetail?.name ?? ''} />

                    <CommanTextInput titleTxt={'PAN Number'}
                        onChangeText={t => setkycDetail({ ...kycDetail, pan: t })}
                        placeholder={'Enter your permanent account number'}
                        value={kycDetail?.pan ?? ''} />

                    {/* <CommanTextInput titleTxt={'Date of Birth on the PAN Card'}
                        onChangeText={t => setkycDetail({ ...kycDetail, pan: t })}
                        placeholder={'Enter your permanent account number'}
                        value={kycDetail?.pan ?? ''} /> */}
                    <CommanDateInput titleTxt={'Date of Birth on the PAN Card'}
                        placeholder={'Enter your permanent account number'}
                        value={kycDetail?.dob ?? ''}
                        icon={AppImages.calender}
                        onPressSecure={() => {
                            setShow(true)
                            console.log('pressed')
                        }}
                    />


                    <Text style={styles.uploadPan} >Upload PAN Proof</Text>
                    <Text style={styles.uplocadDesc} >Ensure the image is clear, with visible Full Name, PAN, Signature, and Photo</Text>
                    <Tabs
                        onLeftPress={() => openGallery()}
                        onRightPress={() => openCamera()}
                    />

                    {media?.hasOwnProperty('filename') && <View style={styles.fileMain} >
                        <FastImage source={AppImages.checkGreen} resizeMode='contain' style={styles.check} />
                        <Text style={styles.filename} >{media?.filename ?? ''}</Text>
                    </View>}
                    {show && <DateTimePicker
                        value={date}
                        mode="date"
                        is24Hour={true}
                        maximumDate={new Date()}
                        display="default"
                        onChange={(i) => {
                            console.log('date===f>', moment(i?.nativeEvent?.timestamp).format('YYYY-MM-DD'))
                            setkycDetail({ ...kycDetail, dob: moment(i?.nativeEvent?.timestamp).format('DD/MM/YYYY') })
                            setShow(false)
                        }}
                    />}
                </View>


                <View style={styles.btnOuter}>
                    <CustomBtn
                        onPress={() => {
                            // if (!validation) {
                            //     return
                            // }

                            navigation.navigate('KycOtp')
                            // verify();
                        }}
                        btnName={'Submit Details'}
                        textStyle={{ color: baseColors.white }}
                        btnStyle={{ marginTop: hp(2), backgroundColor: validation ? baseColors.theme : baseColors.btn_disable }}
                    />
                </View>

            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: baseColors.white
    },
    title: {
        fontSize: RFValue(16),
        fontFamily: AppFonts.medium,
        color: baseColors.black,
        fontWeight: '700',
        marginTop: hp(2)
    },
    desc: {
        fontSize: RFValue(12),
        fontFamily: AppFonts.medium,
        color: baseColors.black,
        fontWeight: '400',
        marginTop: hp(1)
    },
    inputOuter: {
        width: '100%',
        height: hp(6),
        minHeight: 45,
        maxHeight: 47,
        fontFamily: AppFonts.regular,
        backgroundColor: baseColors.white,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(3),
        justifyContent: 'space-between',
        borderRadius: 8,
        backgroundColor: baseColors.white,
        borderWidth: 1,
        borderColor: baseColors.borderColor,
    },
    uploadPan: {
        fontFamily: AppFonts.medium,
        fontWeight: '700',
        fontSize: RFValue(12),
        color: baseColors.black,
        marginTop: hp(2)
    },
    uplocadDesc: {
        fontFamily: AppFonts.medium,
        fontWeight: '400',
        fontSize: RFValue(12),
        color: baseColors.black,
        marginTop: hp(1)
    },
    tabmain: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: hp(2)
    },
    commonStyleTab: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: baseColors.theme,
        borderRadius: 8,
        width: wp(43),
        height: 45
    },
    tabtext: {
        fontSize: RFValue(12),
        fontFamily: AppFonts.medium,
        fontWeight: '700',
        color: baseColors.theme
    },
    tabIcon: {
        height: 15,
        width: 15,
        marginLeft: wp(2)
    },
    filename: {
        fontSize: RFValue(12),
        fontFamily: AppFonts.medium,
        fontWeight: '500',
        color: baseColors.green_Light
    },
    fileMain: {
        marginTop: hp(2),
        flexDirection: 'row',
        // alignItems: 'center',
        width: wp(90),
    },
    check: {
        height: wp(3),
        width: wp(3),
        marginRight: wp(1),
        marginTop: 4
    },
    btnOuter: {
        marginTop: hp(2),
    },
})