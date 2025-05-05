import { hp } from '../Utils/dimension';
import { baseColors } from '../constants/colors';
import AppFonts from '../constants/fonts';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export default function ProductDetailTab({selectedTab,onPress}) {
  // const selectedTab="Shop By Brand"
  let isFistSelected = selectedTab == 'Specifications' ? true : false;
  return (
    <View style={styles.tabMain}>
      <Pressable
        onPress={() => onPress('Specifications')}
        style={[
          styles.tabBtn,
          {
            height: isFistSelected ? 45 : 44,
            borderBottomWidth: isFistSelected ? 2 : 1,
            borderBlockColor: isFistSelected ? baseColors.theme : baseColors.themeLight,
          },
        ]}>
        <Text
          style={[styles.tabTitle, { color: isFistSelected ? baseColors.theme : baseColors.themeLight, fontWeight: isFistSelected ? '700' : '400' }]}>
          Specifications
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onPress('Technical Specifications')}
        style={[
          styles.tabBtn,
          {
            height: !isFistSelected ? 45 : 44,
            borderBottomWidth: !isFistSelected ? 2 : 1,
            borderBlockColor: !isFistSelected ? baseColors.theme : baseColors.themeLight,
          },
        ]}>
        <Text
          style={[
            styles.tabTitle,
            {
              color: !isFistSelected ? baseColors.theme : baseColors.themeLight,
              fontWeight: !isFistSelected ? '700' : '400',
            },
          ]}>
          Technical Specifications
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftTab: {
    // flexDirection
  },
  tabMain: {
    width: '100%',
    paddingVertical: hp(1),
    marginTop: hp(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabBtn: {
    height: 45,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: baseColors.white,
    fontFamily: AppFonts.medium,
  },
});
