import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { hp, wp } from '../../Utils/dimension'
import FastImage from 'react-native-fast-image'
import AppImages from '../../constants/AppImages'
import AppFonts from '../../constants/fonts'
import { RFValue } from 'react-native-responsive-fontsize'
import { baseColors } from '../../constants/colors'
import { Pressable } from 'react-native'
import { AppConstant } from '../../constants/AppConstants'

export default function WalletDetail(props) {
    return (
        <View style={styles.main} >
            <View style={styles.leftcontainer} >
                <FastImage source={props.icon} style={styles.img} resizeMode='contain' />
                <View>
                    <Text style={styles.title} >{props?.title ?? ''}</Text>
                    <Text style={styles.value} >{props?.value ?? ''}</Text>
                </View>
            </View>
            <View style={styles.rightcontainer} >
                {props?.showButton && <Pressable onPress={props.onPress} style={styles.button} >
                    {props.btnTitle != 'Withdraw' && <Image source={props.btnIcon} style={styles.btnIcon} resizeMode='contain' tintColor={'white'} />}
                    <Text style={styles.btnText} >{props.btnTitle}</Text>
                </Pressable>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        paddingVertical: hp(2),
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(3),
        borderRadius: 8
    },
    leftcontainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    rightcontainer: {
        flex: 1,
        alignItems: 'flex-end',

    },
    img: {
        height: wp(9),
        width: wp(9),
        maxHeight: 34,
        maxWidth: 34,
        marginRight: wp(2)
    },
    title: {
        fontFamily: AppFonts.medium,
        fontSize: RFValue(10),
        color: baseColors.gray,
        fontWeight: '400'
    },
    value: {
        fontFamily: AppFonts.medium,
        fontSize: RFValue(13),
        color: baseColors.theme,
        fontWeight: '800'
    },
    button: {
        height: 36,
        width: wp(30),
        backgroundColor: baseColors.theme,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    btnText: {
        fontSize: RFValue(12),
        fontFamily: AppFonts.medium,
        fontWeight: '400',
        color: baseColors.white,
    },
    btnIcon: {
        height: wp(3),
        width: wp(2.5),
        tintColor: 'white',
        marginRight: wp(1)
    }

})