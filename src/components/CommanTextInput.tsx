import { hp, wp } from '../Utils/dimension';
import { baseColors } from '../constants/colors';
import AppFonts from '../constants/fonts';
import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
  TextInput,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
  KeyboardTypeOptions,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

interface CommanTextInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  marginTop?: number;
  source?: ImageSourcePropType;
  height?: number;
  width?: number;
  secureTextEntry?: boolean;
  title?: string;
  titleTxt?: string;
  marginTopTitle?: number;
  containerStyle?: StyleProp<ViewStyle>;
  textInputStyle?: StyleProp<TextStyle>;
  multiline?: boolean;
  titleTxyStyle?: StyleProp<TextStyle>;
  inputViewStyle?: StyleProp<ViewStyle>;
  titleInnerTxt?: string;
  titleInner?: boolean;
  titleInnerTxtStyle?: StyleProp<TextStyle>;
  editable?: boolean;
  numberOfLines?: number;
  defaultValue?: string;
  keyboardType?: KeyboardTypeOptions;
  onPressInput?: () => void;
  maxLength?: number;
  onPressSecure?: () => void;
  icon?: ImageSourcePropType;
  searchCustom?: StyleProp<ViewStyle>;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const CommanTextInput: React.FC<CommanTextInputProps> = ({
  placeholder,
  value,
  onChangeText,
  marginTop,
  source,
  height,
  width,
  secureTextEntry,
  title,
  titleTxt,
  marginTopTitle,
  containerStyle,
  textInputStyle,
  multiline,
  titleTxyStyle,
  inputViewStyle,
  titleInnerTxt,
  titleInner,
  titleInnerTxtStyle,
  editable,
  numberOfLines,
  defaultValue,
  keyboardType,
  onPressInput,
  maxLength,
  onPressSecure,
  icon,
  searchCustom,
  autoCapitalize,
}) => {
  const { colors } = useTheme();
  const [isSecure, setIsSecure] = useState<boolean>(secureTextEntry || false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

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
      <View
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

        <TextInput
          autoCapitalize={autoCapitalize ?? 'none'}
          maxLength={maxLength}
          keyboardType={keyboardType}
          defaultValue={defaultValue}
          editable={editable}
          placeholder={placeholder}
          autoCorrect={false}
          value={value}
          numberOfLines={numberOfLines}
          multiline={multiline}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={baseColors.placeholder}
          secureTextEntry={secureTextEntry ?? false}
          textAlignVertical={multiline ? 'top' : undefined}
          style={{
            width: '90%',
            height: '100%',
            fontSize: 14,
            fontFamily: AppFonts.regular,
            color: baseColors.theme,
            marginTop: 2,
            fontWeight: '400',
            ...textInputStyle,
          }}
          onChangeText={onChangeText}
        />

        <Pressable onPress={onPressSecure}>
          <Image source={icon} style={{ height: wp(4), width: wp(4), ...searchCustom }} resizeMode="contain" />
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = () => StyleSheet.create({});

export default CommanTextInput;
