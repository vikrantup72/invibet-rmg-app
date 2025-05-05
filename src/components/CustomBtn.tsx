import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
  GestureResponderEvent,
  Image,
} from "react-native";


import AppFonts from "../constants/fonts";
import { baseColors } from "../constants/colors";
import { hp, wp } from "../Utils/dimension";

interface CustomBtnProps {
  btnStyle?: StyleProp<ViewStyle>;
  btnName?: string;
  onPress?: (event: GestureResponderEvent) => void;
  icon?: Source;
  imgStyle?: StyleProp<ImageStyle>;
  disabled?: boolean;
  textStyle?: StyleProp<TextStyle>;
  tintColor?: string;
  activeOpacity?: number;
  btnAddStyle?: StyleProp<ViewStyle>;
  imgStyle_right?: StyleProp<ViewStyle>;
  maxFontSizeMultiplier?: number;
  icon_right:string,
  tintColor_right:String
}

function CustomBtn({
  btnStyle,
  btnName,
  onPress,
  icon,
  imgStyle,
  disabled = false,
  textStyle,
  tintColor,
  activeOpacity = 0.7,
  btnAddStyle,
  maxFontSizeMultiplier = 2,
  icon_right,
tintColor_right,
imgStyle_right
}: CustomBtnProps) {

  let style = styles();

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      disabled={disabled}
      onPress={onPress}
      style={[
        {
          width: "100%",
          height: hp(6),
          backgroundColor: baseColors.theme,
          minHeight:40,
          maxHeight:55,
          borderRadius:6,
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "center",
          paddingHorizontal: 15,
          ...btnAddStyle,
        },
        btnStyle,
      ]}
    >
      {icon && (
        <Image
          tintColor={tintColor}
          resizeMode="contain"
          style={[
            {
              height: 20,
              width: 20,
            },
            imgStyle,
          ]}
          source={icon}
        />
      )}

      {btnName && (
        <Text
          maxFontSizeMultiplier={maxFontSizeMultiplier}
          style={[style.btnText, textStyle]}
        >
          {btnName}
        </Text>
      )}
      {icon_right && (
        <Image
          tintColor={tintColor_right}
          resizeMode="contain"
          style={[
            {
              height: 20,
              width: 20,
            },
            imgStyle_right,
          ]}
          source={icon_right}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = () =>
  StyleSheet.create({
    btnText: {
      fontFamily: AppFonts.semibold,
      fontSize: 16,
      alignSelf: "center",
      color: baseColors.white,
      fontWeight: "700",
      textAlign: "center",
    },
  });

export default CustomBtn;
