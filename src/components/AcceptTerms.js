import { hp, wp } from '../Utils/dimension';
import AppImages from '../constants/AppImages';
import { baseColors } from '../constants/colors';
import AppFonts from '../constants/fonts';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export default function AcceptTerms({ onPress, isChecked }) {
  return (
    <View style={styles.main} >
      <Pressable onPress={onPress} style={styles.checkBoxouter}>
 {isChecked &&       <Image source={AppImages.check} tintColor={baseColors.theme} style={styles.tick} />}
      </Pressable>
      <Text style={styles.iaccept}> I accept all Terms & Conditions*</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iaccept: {
    fontSize: RFValue(11),
    color: baseColors.theme,
    fontFamily: AppFonts.medium,
    fontWeight: '400',
    marginLeft:wp(2)
  },
  checkBoxouter: {
    height: wp(5),
    width: wp(5),
    maxHeight: 25,
    maxWidth: 25,
    borderWidth: 1,
    borderColor: baseColors.theme,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: {
    height: '80%',
    width: '80%',
    resizeMode: 'contain',
    tintColor: baseColors.theme,
  },
  main:{
    flexDirection:'row',
    alignItems:'center',
    marginLeft:wp(3),
    margin:hp(1)
  }
});
