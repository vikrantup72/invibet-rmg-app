import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import AppImages from '../../constants/AppImages'
import { hp, wp } from '../../Utils/dimension'
import { baseColors } from '../../constants/colors'
import AppFonts from '../../constants/fonts'
import { RFValue } from 'react-native-responsive-fontsize'

interface KycBlocks {
    title: string
    value: string
    icon: number
    showVerifyBtn: boolean
    isVerified: boolean
    onPress: () => void
}

export const KycBlocks: React.FC<KycBlocks> = ({ title, icon, value, isVerified, showVerifyBtn, onPress }) => {
    return (
        <View style={styles.main} >
            <View style={styles.iconOuter} >
                <FastImage source={icon} style={styles.icon} tintColor={'black'} />
            </View>
            <View style={styles.centerView} >
                <View style={styles.titleTopView} >
                    <Text style={styles.title} >{title ?? ''}</Text>
                    {/* Verified */}
                    {isVerified ?
                     <View style={styles.verifyView} >
                        <Text style={styles.verified} >Verified</Text>
                    </View>
                        :
                        <View style={[styles.verifyView, { backgroundColor: baseColors.dangerBg }]} >
                            <Text style={[styles.verified, { color: baseColors.dangerDark }]} >Unverified</Text>
                        </View>}
                </View>
                <Text style={styles.phonenum} >{value ?? ''}</Text>
            </View>
            <View style={{ width: wp(11), alignItems: 'flex-end' }} >
                {showVerifyBtn && <Pressable hitSlop={30} onPress={onPress} style={styles.verifyBtnOuter} >
                    <Text style={styles.btntitle} >Verify</Text>
                </Pressable>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        marginTop: hp(4),
        paddingHorizontal: wp(5),
        justifyContent: 'space-between'
    },
    iconOuter: {
        borderWidth: 1,
        borderColor: baseColors.borderColor,
        borderRadius: 8,
        padding: wp(2)
    },
    icon: {
        height: wp(5),
        width: wp(5)
    },
    centerView: {
        width: '70%',
        // backgroundColor: 'red',
        // marginLeft: wp(3)
    },
    titleTopView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        fontFamily: AppFonts.medium,
        color: baseColors.grey1,
        fontSize: RFValue(12)
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
    phonenum: {
        fontFamily: AppFonts.semibold,
        color: baseColors.black,
        fontSize: RFValue(12),
        fontWeight: 'bold',
        marginTop: -2
    },
    verifyBtnOuter: {
        borderWidth: 1,
        borderRadius: 4,
        width: wp(10),
        paddingVertical: wp(1),
        alignItems: 'center',
        justifyContent: 'center'
    },
    btntitle: {
        fontFamily: AppFonts.semibold,
        fontSize: RFValue(8),
        color: baseColors.black
    }
})