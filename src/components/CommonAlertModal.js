import { useDispatch, useSelector } from 'react-redux';
import { hp, wp } from '../Utils/dimension';
import AppImages from '../constants/AppImages';
import { baseColors } from '../constants/colors';
import AppFonts from '../constants/fonts';
import React from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export default function CommonAlertModal({ title, subTitle, onCanclePress, onOkPerss, visible }) {
 
  return (
    <Modal transparent={true} visible={visible}>
      <View style={styles.darkview}>
        <View style={styles.whiteView}>
          <Pressable onPress={onCanclePress} style={styles.crossOuter}>
            <Image style={styles.cross} source={AppImages.cross} />
          </Pressable>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subTitle}</Text>

          <View style={styles.btnOuter}>
            <Pressable onPress={onCanclePress} style={styles.btn}>
              <Text style={styles.btnText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={onOkPerss} style={[styles.btn, { backgroundColor: baseColors.theme }]}>
              <Text style={[styles.btnText, { color: baseColors.white }]}>Okay</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  darkview: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(5),
  },
  whiteView: {
    backgroundColor: baseColors.white,
    width: '90%',
    paddingTop: hp(2),
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
  },
  cross: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
  },
  crossOuter: {
    alignSelf: 'flex-end',
    marginRight: wp(4),
  },
  title: {
    fontSize: 20,
    fontFamily: AppFonts.bold,
    color: baseColors.theme,
    fontWeight: '700',
    width: '80%',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: AppFonts.medium,
    color: baseColors.theme,
    fontWeight: '400',
    width: '50%',
    textAlign: 'center',
    marginTop: hp(0.5),
  },
  btnOuter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(2),
    borderTopWidth: 1,
    borderTopColor: baseColors.borderColor,
    width: '100%',
  },
  btn: {
    height: 55,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 14,
    fontFamily: AppFonts.bold,
    color: baseColors.theme,
    fontWeight: '400',
  },
});
