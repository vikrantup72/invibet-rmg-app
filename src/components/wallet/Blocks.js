import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { baseColors } from '../../constants/colors'
import { hp, wp } from '../../Utils/dimension'
import FastImage from 'react-native-fast-image'
import AppImages from '../../constants/AppImages'
import AppFonts from '../../constants/fonts'
import { RFValue } from 'react-native-responsive-fontsize'
import { useSelector } from 'react-redux'

export default function Blocks(props) {
    const { user } = useSelector(state => state?.userData)
    return (
        <Pressable onPress={props?.onPress} style={styles.main} >
            <View style={styles.leftcontainer} >
                <FastImage source={props?.detail?.icon} style={styles.icon} resizeMode='contain' />
                <View style={styles.textBlock} >
                    <View style={styles.titleMain} >
                        <Text style={styles.kycVerification} >{props?.detail?.title ?? ''}</Text>
                        {/* {props?.verficationStatus && <View style={styles.verificationMain} >
                            <Text style={styles.verificationStatus} >Not Verified</Text>
                        </View>} */}

                        {props?.verficationStatus && <View>
                            {user?.is_kyc_verified ? <View style={styles.verifyView} >
                                <Text style={styles.verified} >Verified</Text>
                            </View>
                                :
                                <View style={[styles.verifyView, { backgroundColor: baseColors.dangerBg }]} >
                                    <Text style={[styles.verified, { color: baseColors.dangerDark }]} >Unverified</Text>
                                </View>}
                        </View>}
                    </View>
                    <Text style={styles.description} >{props?.detail?.description ?? ''}</Text>
                </View>
            </View>
            <View style={styles.rightContainer} >
                <FastImage source={AppImages.arrow_forward1} style={styles.arrow} resizeMode='contain' />
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    main: {
        borderWidth: 1,
        borderColor: baseColors.separatorClr,
        borderRadius: 8,
        marginTop: hp(2),
        padding: wp(3),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    icon: {
        height: wp(9),
        width: wp(9),
        maxHeight: 36,
        maxWidth: 36,
        marginRight: wp(2)
    },
    leftcontainer: {
        width: '94%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    kycVerification: {
        fontFamily: AppFonts.semibold,
        fontSize: RFValue(12),
        fontWeight: '700',
        color: baseColors.black
    },
    titleMain: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    verificationMain: {
        backgroundColor: baseColors.kycbgRed,
        paddingVertical: 3,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: wp(2),
        marginLeft: wp(2)
    },
    verificationStatus: {
        fontFamily: AppFonts.medium,
        fontSize: RFValue(10),
        fontWeight: '400',
        color: baseColors.danger
    },
    description: {
        fontFamily: AppFonts.medium,
        fontSize: RFValue(10),
        fontWeight: '400',
        color: baseColors.gray,
        marginTop: 3
    },
    arrow: {
        height: wp(3.2),
        width: wp(3),
        maxWidth: 8,
        maxHeight: 12
    },
    rightContainer: {
        alignItems: 'flex-end'
    },
    verifyView: {
        backgroundColor: baseColors.greenLight,
        paddingHorizontal: wp(2),
        paddingVertical: 3,
        marginLeft: wp(2)
    },
    verified: {
        fontFamily: AppFonts.semibold,
        color: baseColors.greenDark,
        fontSize: RFValue(10),
        fontWeight: '800'
    },

})