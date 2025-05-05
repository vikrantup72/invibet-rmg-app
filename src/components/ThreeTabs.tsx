
import { baseColors } from '../constants/colors';
import AppFonts from '../constants/fonts';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { hp, wp } from '../Utils/dimension';

interface ThreeTabsParams {
    slectedTab: string
    onPress: (i:string) => void
    title1: string
    title2: string
    title3: string
}

export const ThreeTabs: React.FC<ThreeTabsParams> = ({ slectedTab='Active', onPress, title1, title2, title3 }) => {
    return (
        <View style={styles.main}>
            <Pressable hitSlop={20} onPress={() => onPress(title1)} style={[styles.btn, { backgroundColor: slectedTab == title1?.trim() ? baseColors.theme : 'transparent', }]}>
                <Text style={[styles.btnname, { color: slectedTab === title1?.trim() ? baseColors.white : baseColors.theme }]}>{title1}</Text>
            </Pressable>
            <Pressable hitSlop={20} onPress={() => onPress(title2)} style={[styles.btn, { backgroundColor: slectedTab == title2?.trim() ? baseColors.theme : 'transparent', }]}>
                <Text style={[styles.btnname, { color: slectedTab === title2?.trim() ? baseColors.white : baseColors.theme }]}>{title2}</Text>
            </Pressable>
            <Pressable hitSlop={20} onPress={() => onPress(title3)} style={[styles.btn, { backgroundColor: slectedTab == title3?.trim() ? baseColors.theme : 'transparent', }]}>
                <Text style={[styles.btnname, { color: slectedTab === title3?.trim() ? baseColors.white : baseColors.theme }]}>{title3}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        padding: 3,
        backgroundColor: baseColors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        marginTop: hp(2),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: baseColors.btn_disable,
        width:'90%',
        alignSelf:'center'

    },
    btn: {
        height: 32,
        // paddingHorizontal: wp(4.5),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width:'32%',
    },
    btnname: {
        fontSize: RFValue(11),
        fontWeight: '500',
        fontFamily: AppFonts.bold,
    },
});
