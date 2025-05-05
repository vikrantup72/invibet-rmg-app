import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { hp, wp } from '../../Utils/dimension'
import { RFValue } from 'react-native-responsive-fontsize'
import { baseColors } from '../../constants/colors'
import AppFonts from '../../constants/fonts'
import FastImage from 'react-native-fast-image'
import AppImages from '../../constants/AppImages'

export default function SingleRankBlock(props) {
    return (
        <View style={[styles.main, props?.mainExtraStyle]} >
            {/* ****** first view *********  */}
            <View style={styles.firstView}>
                <Text style={[styles.title, props?.commonTextStyle, props?.firstBlock_extraStyle]} >{props?.title1 ?? ''}</Text>
            </View>

            {/* ****** first view *********  */}
            <View style={[styles.firstView, { alignItems: 'center',flexDirection:'row' }]}>
                <Text style={[styles.title, props?.commonTextStyle, props?.secondBlock_extraStyle]} >{props?.title2 ?? ''}</Text>
               {props?.item?.booster && <FastImage source={AppImages.rocket} style={styles.rocket} />}
            </View>

            {/* ****** first view *********  */}
            <View style={[styles.firstView, { alignItems: 'flex-end' }]}>
                <Text style={[styles.title, props?.commonTextStyle, props?.thirdBlock_extraStyle]} >{props?.title3 ?? ''}</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(3)
    },
    firstView: {
        paddingVertical: hp(0.9),
        flex: 1,
        alignItems: 'flex-start',
    },
    title: {
        fontSize: RFValue(11),
        textAlign: 'center',
        color: baseColors.black,
        fontWeight: '400',
        fontFamily: AppFonts.medium,
        textTransform:'capitalize'
    },
    rocket:{
        height:wp(3),
        width:wp(3),
        marginLeft:wp(1)
    }
})