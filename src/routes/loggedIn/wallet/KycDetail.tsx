import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { BettingTopBar } from '../../../components/betting/topBar'
import { baseColors } from '../../../constants/colors'
import { hp, wp } from '../../../Utils/dimension'
import AppFonts from '../../../constants/fonts'
import { RFValue } from 'react-native-responsive-fontsize'
import FastImage from 'react-native-fast-image'
import AppImages from '../../../constants/AppImages'
import { KycBlocks } from '../../../components/kyc/KycBlocks'
import { useSelector } from 'react-redux'
import { maskNumber } from '../../../constants/CommonFunctions'
import { useNavigation } from '@react-navigation/native'


export default function KycDetail() {
    const navigation = useNavigation()
    const { user } = useSelector(state => state.userData)
    console.log('user',user)
    const Banner = () => {
        return (
            <View style={styles.cardmain} >
                <View style={styles.leftView} >
                    <Text style={styles.getVerified} >Get Verified</Text>
                    <Text style={styles.bannerDesc} >Withdraw winnings to your{'\n'}bank{'\n'}account instantly!</Text>
                </View>
                <FastImage source={AppImages.money_Won} resizeMode='contain' style={styles.user} />
            </View>
        )
    }



    return (
        <View style={styles.main} >
            <BettingTopBar title={'Verify Account'} noIcons />
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}  >
                {/* ******top card*** */}
                <Banner />

                <KycBlocks title={'Mobile Number'} isVerified={true} value={user?.phone_number} showVerifyBtn={false} icon={AppImages.mobile_phone}
                    onPress={() => { navigation.navigate('Kyc') }}
                />

                <KycBlocks title={'Aadhaar Card'} isVerified={user?.is_aadhaar_verified} value={maskNumber(user?.aadhaar_number) ?? ''} showVerifyBtn={!user?.is_aadhaar_verified} icon={AppImages.id_card}
                    onPress={() => { navigation.navigate('AaddharKyc') }}
                />

                <KycBlocks title={'PAN Card'} isVerified={user?.is_pan_verified} value={maskNumber(user?.pan_number) ?? ''} showVerifyBtn={(user?.is_aadhaar_verified && !user?.is_pan_verified) ? true : false} icon={AppImages.id_card}
                    onPress={() => { navigation.navigate('PanKyc') }}
                />

                <KycBlocks title={'Account'} isVerified={false} value={maskNumber(user?.bank_account_number) ?? ''} showVerifyBtn={(user?.is_aadhaar_verified && user?.is_pan_verified && !user?.s_bank_verified) ? true : false} icon={AppImages.id_card}
                    onPress={() => { navigation.navigate('AccountVerification')}}
                />


            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1, backgroundColor: baseColors.white
    },
    contentContainer: {
        flex: 1,
        // paddingHorizontal:wp(5)
    },
    cardmain: {
        backgroundColor: baseColors.kyCard_bg,
        paddingVertical: hp(2),
        paddingHorizontal: wp(5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    leftView: {
        width: '70%',
        paddingVertical: hp(1),
    },
    getVerified: {
        fontFamily: AppFonts.bold,
        fontSize: RFValue(16),
        fontWeight: "800",
        color: baseColors.brawnDark,
        // marginTop:hp(2)
    },
    bannerDesc: {
        fontFamily: AppFonts.semibold,
        fontSize: RFValue(12),
        color: baseColors.black,
        marginTop: hp(1)
    },
    user: {
        height: wp(28),
        width: wp(28),
    }
})