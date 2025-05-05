import { useNavigation } from '@react-navigation/native';
import { hp, wp } from '../../../../Utils/dimension';
import { useProfileDataState } from '../../../../atoms/profileData';
import { baseColors } from '../../../../constants/colors';
import AppFonts from '../../../../constants/fonts';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export default function GenderSelection() {
  const [profile, setProfile] = useProfileDataState();
  const navigation = useNavigation();
  const [isNavigating, setIsNavigating] = useState(false); // Prevent duplicate navigation

  const data = [
    { label: 'Female', value: 'female' },
    { label: 'Male', value: 'male' },
    { label: 'Non-binary', value: 'non-binary' },
    { label: 'Prefer not to say', value: 'prefer-not-to-say' },
  ];

  const SingleTab = ({ item, index }) => {
    const HandleSelection = () => {
      if (isNavigating) return; // Prevent duplicate clicks
      setIsNavigating(true);

      setProfile((prev) => {
        const updatedProfile = { ...prev, gender: item.value };
        console.log('Updated Profile:', updatedProfile); // Confirm state update
        return updatedProfile;
      });

      // Delay navigation to ensure state is updated
      setTimeout(() => {
        navigation.navigate('Questions2'); // Navigate after state update
        setIsNavigating(false); // Allow further navigations
      }, 100); // Adjust delay if needed
    };

    return (
      <Pressable
        onPress={HandleSelection}
        style={[
          styles.btnMain,
          {
            backgroundColor:
              profile?.gender === item.value
                ? baseColors.btn_active
                : baseColors.white,
            width: wp(90),
            borderColor: baseColors.btn_disable,
            borderWidth: 1,
            borderRadius: 8,
          },
        ]}
      >
        <Text
          style={[
            styles.btntitle,
            {
              color:
                profile?.gender === item.value
                  ? baseColors.white
                  : baseColors.btn_active,
              textTransform: index === 3 ? 'none' : 'capitalize',
            },
          ]}
        >
          {item.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.main}>
      {data.map((item, index) => (
        <SingleTab key={index} index={index} item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginTop: hp(3),
  },
  btnMain: {
    height: 52,
    marginTop: hp(1),
    marginRight: '1%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(3),
  },
  btntitle: {
    fontFamily: AppFonts.medium,
    fontWeight: '400',
    fontSize: RFValue(12),
  },
});
