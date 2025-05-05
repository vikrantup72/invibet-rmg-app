import { hp, wp } from '../../../Utils/dimension';
import { useProfileDataState } from '../../../atoms/profileData';
import { IndexTop } from '../../../components/questionaire/indexTop';
import AppImages from '../../../constants/AppImages';
import { baseColors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import Question1 from './components/Question1';
import React, { useRef, useState } from 'react';
import { Animated, FlatList, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Questions({ navigation }) {

  const data = [
    'What is your gender?',
    'How old are you?',
    'How Tall are you?',
    'What is your current Weight?',
    'Do you have any health issues?',
    'How active you are?',
  ];
  const flatRef = useRef(null);
  const [profile, setProfile] = useProfileDataState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: baseColors.theme }}>
      <View style={styles.main}>
        <IndexTop index={+currentIndex + 1} max={data?.length} />

        {/*********** product image *************/}
        <View style={{ flex: 1, justifyContent: 'center', width: '100%' }}>
          <FlatList
            ref={flatRef}
            nestedScrollEnabled={true}
            data={data}
            horizontal
            scrollEnabled={false}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <View style={[styles.productImgOuter]}>
                  <Text style={styles.title}>{item}</Text>

                  <Question1  navigation={navigation}  />
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
          />
        </View>
      </View>

      <View style={{ flex: 0.1, paddingHorizontal: wp(4), backgroundColor: baseColors.white }}>
        <View style={styles.bottomInner}>
          <View style={styles.pagination}>
            {data.map((_, index) => (
              <View
                key={index}
                // style={[
                //   styles.dot,
                //   { backgroundColor: currentIndex == index ? baseColors.yellowPrimary : baseColors.white, opacity: currentIndex === index ? 1 : 0.3 },
                // ]}
              />
            ))}
          </View>

          {/* nex button */}
          <Pressable
            // onPress={() => {
            //     navigation.navigate('Questions2')
            //     console.log('skippedQuestion, & Navigate to the Next Screen')
            //     console.log('Skip Profile Data log===>===>', profile)
            //   let index = currentIndex + 1;
            //   // if (index == 0 && profile?.gender?.trim()?.length == 0) {
            //   //   AppUtils.showToast_error('Please select gender');
            //   // }
            //   // if (index == data?.length) {
            //   //   console.log('You are on last index');
            //   // } else {
            //   //   flatRef.current?.scrollToIndex({ animated: true, index });
            //   // }
            // }}
            onPress={() => {
              console.log('skippedQuestion, & Navigate to the Next Screen');

              setProfile((prevProfile) => {
                const resetProfile = {
                  ...prevProfile,
                  gender: '', 
                };
                console.log('Reset Profile Data log:', resetProfile);
                return resetProfile;
              });
          
              navigation.navigate('Questions2'); 
            }}
            style={styles.nextbtnOuters}>
              <Text style={styles.skipTxt}>Skip for now
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
    paddingTop:Platform.OS=='android'? hp(12):hp(7),
    backgroundColor: baseColors.white,
  },
  productImgOuter: {
    width: wp(92),
    alignItems: 'center',
  },
  productImg: {
    height: wp(60),
    width: wp(90),
    resizeMode: 'contain',
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
  varient: {
    height: wp(13),
    width: wp(13),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    borderWidth: 1,
    marginRight: wp(2),
  },
  bottomInner: {
    width: '100%',
    // flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: baseColors.white
  },
  nextbtnOuter: {
    height: wp(9),
    width: wp(12),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: baseColors.themeLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    height: wp(4),
    width: wp(8),
    tintColor: baseColors.themeLight,
    resizeMode: 'contain',
  },
  title: {
    fontSize: RFValue(20),
    textAlign: 'center',
    color: baseColors.black,
    // fontWeight: '700',
    fontFamily: AppFonts.extraBold,
    marginTop: hp(3),
  },
  skipTxt:{
    fontSize: RFValue(12),
    textAlign: 'center',
    fontFamily: AppFonts.bold,
    color: baseColors.theme,
    fontWeight: '600'
  }
});
