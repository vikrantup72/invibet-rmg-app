import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import AppFonts from '../constants/fonts'
import { baseColors } from '../constants/colors'
import FastImage from 'react-native-fast-image'
import AppImages from '../constants/AppImages'
import { hp, wp } from '../Utils/dimension'
import { useNavigation } from '@react-navigation/native'

export default function SimpleHeader(props) {
    const navigaton = useNavigation()
    return (
        <>
            <View style={styles.main} >
                <Pressable onPress={() => navigaton.goBack()} hitSlop={20} >
                    <FastImage source={AppImages.back_primary} style={styles.backArrow} resizeMode='contain' />
                </Pressable>
                <Text style={styles.title} >{props?.title ?? ""}</Text>
            </View>
            <View style={styles.seperator} />
        </>
    )
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        paddingVertical: hp(2)
    },
    backArrow: {
        height: wp(6),
        width: wp(6),
        maxHeight: 20,
        maxWidth: 20,
        marginRight: wp(2)
    },
    title: {
        fontSize: RFValue(14),
        fontFamily: AppFonts.medium,
        color: baseColors.black,
        fontWeight:'400'
    },
    seperator: {
        height: 1,
        width: '100%',
        backgroundColor: baseColors.separatorClr,
    }
})