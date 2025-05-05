import { useNavigation } from '@react-navigation/native';
import { hp, wp } from '../../Utils/dimension';
import AppImages from '../../constants/AppImages';
import { baseColors } from '../../constants/colors';
import AppFonts from '../../constants/fonts';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export default function SingleProductWebview(props) {
    const navigation = useNavigation()
    return (
        <Pressable
            onPress={() => {
                navigation.navigate('ProductDetailWebView', { link: props?.item?.link })
            }}
            style={styles.main}>
            <Image source={props?.item?.icon} style={styles.img} resizeMode='contain' />
            {/* <View style={styles.bottomView}>
        <Text style={styles.productName}>{props?.item?.name ?? ''}</Text>
        <Text style={styles.productPrice}>{props?.item?.price ?? ''}</Text>
      </View> */}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    main: {
        width: '47%',
        // paddingVertical: hp(2),
        backgroundColor: 'rgb(234,234,234)',
        borderRadius: 10,
        // borderWidth:1,
        // overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,

        elevation: 1,
        marginTop: hp(2.5),
    },
    img: {
        width: '100%',
        height: hp(16),
        resizeMode: 'cover',
        borderRadius: 10,
    },
    bottomView: {
        width: '100%',
        paddingHorizontal: wp(2),
        paddingVertical: hp(1),
    },
    productName: {
        fontSize: RFValue(10),
        color: baseColors.black,
        fontFamily: AppFonts.semibold,
        fontWeight: '600',
    },
    productPrice: {
        fontSize: RFValue(9.5),
        color: baseColors.theme,
        fontFamily: AppFonts.bold,
        fontWeight: '700',
        marginTop: hp(0.3),
    },
});
