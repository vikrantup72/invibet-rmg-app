import { hp, wp } from '../Utils/dimension';
import { baseColors } from '../constants/colors';
import AppFonts from '../constants/fonts';
import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  Pressable,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import DateTimePicker from '@react-native-community/datetimepicker';


const CommanTextInput= ({
  value,
  marginTop,
  source,
  height,
  width,
  secureTextEntry,
  title,
  titleTxt,
  marginTopTitle,
  containerStyle,
  multiline,
  titleTxyStyle,
  inputViewStyle,
  titleInner,
  onPressInput,
  onPressSecure,
  icon,
  searchCustom,
  
}) => {
  const { colors } = useTheme();
  const [isSecure, setIsSecure] = useState(secureTextEntry || false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Pressable
      onPress={onPressInput}
      style={{
        marginTop: hp(2),
        ...containerStyle,
      }}>
      {(title || titleTxt) && (
        <Text
          maxFontSizeMultiplier={2}
          style={{
            fontFamily: AppFonts.semibold,
            fontSize: RFValue(12),
            color: baseColors.theme,
            width: '100%',
            marginBottom: 5,
            marginTop: marginTopTitle,
            // fontWeight: '700',
            ...titleTxyStyle,
          }}>
          {titleTxt}
        </Text>
      )}
      <Pressable
      onPress={onPressSecure}
        style={{
          width: '100%',
          height: multiline ? undefined : hp(6),
          minHeight: 45,
          maxHeight: multiline ? undefined : 47,
          fontFamily: AppFonts.regular,
          backgroundColor: baseColors.white,
          alignSelf: 'center',
          marginTop: marginTop,
          flexDirection: titleInner ? 'column' : 'row',
          alignItems: 'center',
          paddingHorizontal: wp(3),
          justifyContent: 'space-between',
          borderRadius: 8,
          backgroundColor: baseColors.white,
          borderWidth: 1,
          borderColor: baseColors.borderColor,
          ...inputViewStyle,
        }}>
        {source && (
          <Image
            style={{
              height: height ?? 16,
              width: width ?? 16,
              alignSelf: 'center',
              resizeMode: 'contain',
              marginLeft: 10,
            }}
            source={source}
          />
        )}


{value?
        <Text style={styles.value} >{value??''}</Text>
       : <Text style={[styles.value,{color:baseColors.placeholder}]} >{'DD/MM/YYYY'}</Text>}

        <Pressable hitSlop={40} onPress={onPressSecure}>
          <Image source={icon} style={{ height: wp(4), width: wp(4), ...searchCustom }} resizeMode="contain" />
        </Pressable>
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
    value:{
        fontSize: 14,
        fontFamily: AppFonts.regular,
        color: baseColors.theme,
        marginTop: 2,
        fontWeight: '400',

    }
});

export default CommanTextInput;
