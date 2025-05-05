import AppUtils from '../../../Utils/appUtils';
import { hp, wp } from '../../../Utils/dimension';
import { useProfileDataState } from '../../../atoms/profileData';
import CustomBtn from '../../../components/CustomBtn';
import { IndexTop } from '../../../components/questionaire/indexTop';
import AppImages from '../../../constants/AppImages';
import { baseColors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import Question1 from './components/Question1';
import Question2 from './components/Question222';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Animated, FlatList, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Div } from 'react-native-magnus';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { matrixTransform } from 'react-native-svg/lib/typescript/elements/Shape';

const singleItemWidth = 44;
const ageOneToHundred = Array?.from({ length: 100 }).map((_, idx) => idx);

export default function Questions2({ navigation }) {
  const flatListRef: RefObject<FlatList<any>> | null = useRef(null);
  const [profile, setProfile] = useProfileDataState();
  console.log('profile===question 2===',profile)
  const [tempAge, setTempAge] = useState(profile.age || 4);

  const data = [
    'What’s your Biological Gender?',
    'How old are you?',
    'How Tall are you?',
    'What is your Current Weight?',
    'Do you have any health issues?',
    'How active you are?',
  ];

  // Ensure the list scrolls to the correct index on mount
  useEffect(() => {
    if (flatListRef.current && profile.age) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: parseInt(profile.age??tempAge) - 4,
      });
      setTempAge(profile.age);
    }
  }, [profile.age]);

  const onScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newValue = Math.floor((event.nativeEvent.contentOffset.x + 4 * singleItemWidth) / singleItemWidth);
    setTempAge(parseInt(newValue));
  };

  const handleSelect = () => {
    setProfile(prev => ({
      ...prev,
      age: tempAge, // Update profile with selected age
    }));

    console.log('Profile Data Updated After Age Selected:', { ...profile, age: parseInt(tempAge) });

    // Delay navigation to ensure state is updated
    setTimeout(() => {
      navigation.navigate('Question3');
    }, 0);
  };

  const handleSkip = () => {
    setProfile(prevProfile => ({
      ...prevProfile,
      age: '', // Reset age on skip
    }));

    console.log('Skipped Question, Reset Profile Data', profile);

    // Delay navigation to ensure state is updated
    setTimeout(() => {
      navigation.navigate('Question3');
    }, 0);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: baseColors.theme }}>
      <View style={styles.main}>
        <IndexTop index={2} max={6} />

        {/* Question Title */}
        <Text style={styles.title}>{'How old are you?'}</Text>
        <View style={{ flex: 1, width: '100%', marginTop: hp(7) }}>
          <View style={styles.viewText}>
            <FlatList
              horizontal={true}
              scrollEnabled
              ref={flatListRef}
              style={{
                backgroundColor: baseColors.white,
                borderColor: baseColors.btn_disable,
                borderWidth: 1,
                borderRadius: 10,
              }}
              data={ageOneToHundred}
              onScroll={onScrollEndDrag}
              legacyImplementation={false}
              keyboardShouldPersistTaps="always"
              onMomentumScrollEnd={onScrollEndDrag}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.toString()}
              getItemLayout={(_, index) => ({
                index: index,
                length: singleItemWidth,
                offset: index * singleItemWidth,
              })}
              renderItem={data => (
                <View
                  style={{
                    width: singleItemWidth,
                    alignSelf: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontWeight: '500',
                      fontFamily: AppFonts.medium,
                      fontSize: RFValue(13),
                      color: baseColors.theme,
                    }}>
                    {parseInt(data.item)}
                  </Text>
                </View>
              )}
            />
          </View>

          {/* Select Button */}
          <Pressable style={styles.nextbtnOuter} onPress={handleSelect}>
            <Text style={styles.select_Txt}>
              Select
              <Image source={AppImages.right} style={styles.arrow} />
            </Text>
          </Pressable>

          <Div rounded={31} h={62} w={62} position="absolute" alignItems="center" justifyContent="center" alignSelf="center" mt={-10}>
            <Div
              rounded={27}
              h={55}
              w={55}
              bg={baseColors.age_InnerCir}
              borderColor={baseColors.btn_disable + 78}
              borderWidth={5}
              alignItems="center"
              justifyContent="center">
              <Text
                style={{
                  fontWeight: '500',
                  fontFamily: AppFonts.bold,
                  fontSize: RFValue(16),
                  color: baseColors.white,
                }}>
                {parseInt (tempAge)}
              </Text>
            </Div>
          </Div>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={{ flex: 0.15, paddingHorizontal: wp(4), backgroundColor: baseColors.white }}>
        <View style={styles.bottomInner}>
          <View style={styles.pagination}>
            {data.map((_, index) => (
              <></>
            ))}
          </View>

          {/* Skip Button */}
          <Pressable style={styles.nextbtnOuters} onPress={handleSkip}>
            <Text style={styles.skipTxt}>
              Skip for now
              <Image source={AppImages.right} style={styles.arrow} />
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingTop: Platform.OS == 'android' ? hp(12) : hp(7),
    backgroundColor: baseColors.white,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: baseColors.white,
    marginHorizontal: 5,
  },

  bottomInner: {
    width: '100%',
    // flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    backgroundColor: baseColors.white,
  },
  nextbtnOuter: {
    height: wp(9),
    width: wp(20),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: baseColors.theme,
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    marginTop: hp(2),
  },
  select_Txt: {
    fontSize: wp(3.5),
    color: baseColors.theme,
    fontWeight: '500',
    fontFamily: AppFonts.bold,
  },
  arrow: {
    height: wp(3),
    width: wp(3),
    maxHeight: 20,
    maxWidth: 20,
    tintColor: baseColors.themeLight,
    resizeMode: 'contain',
    marginTop: -5,
  },
  title: {
    fontSize: RFValue(20),
    textAlign: 'center',
    color: baseColors.black,
    // fontWeight: '700',
    fontFamily: AppFonts.extraBold,
    marginTop: hp(3),
  },
  viewText: {
    width: '100%',
    // marginTop:hp(2),
    // backgroundColor: 'red',
    height: 40,
    overflow: 'hidden',
  },
  skipTxt: {
    fontSize: RFValue(12.5),
    textAlign: 'center',
    fontFamily: AppFonts.bold,
    color: baseColors.theme,
    fontWeight: '600',
  },
});
