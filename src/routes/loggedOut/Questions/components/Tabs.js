import { hp, wp } from '../../../../Utils/dimension';
import { baseColors } from '../../../../constants/colors';
import AppFonts from '../../../../constants/fonts';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export default function Tabs({slectedTab,onPress,title1,title2}) {
  return (
    <View style={styles.main}>
      <Pressable onPress={()=>onPress(title1)} style={[styles.btn, { backgroundColor:slectedTab==title1?.trim() ?baseColors.theme:'transparent', }]}>
        <Text style={[styles.btnname, {color:slectedTab===title1?.trim()? baseColors.white:baseColors.theme}]}>{title1}</Text>
      </Pressable>
      <Pressable onPress={()=>onPress(title2)} style={[styles.btn, { backgroundColor:slectedTab==title2?.trim()? baseColors.theme:'transparent', }]}>
        <Text style={[styles.btnname, {color:slectedTab===title2?.trim()? baseColors.white:baseColors.theme}]}>{title2}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    padding: 3,
    backgroundColor: baseColors.white,
    borderRadius:3,
    flexDirection:'row',
    alignItems:'center',
    marginTop:hp(2),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: baseColors.btn_disable,
    width: wp(17)
  },
  btn: {
    height: 32,
    paddingHorizontal: wp(4.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  btnname: {
    fontSize: RFValue(11),
    fontWeight: '500',
    fontFamily: AppFonts.bold,
  },
});
