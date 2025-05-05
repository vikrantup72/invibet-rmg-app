import { Div } from 'react-native-magnus';
import { hp, wp } from '../../../Utils/dimension';
import { heightValues, heightValuesInCm, useProfileDataState, weightValues } from '../../../atoms/profileData';
import { IndexTop } from '../../../components/questionaire/indexTop';
import AppImages from '../../../constants/AppImages';
import { baseColors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import Tabs from './components/Tabs';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';

const singleItemWidth = 50;
const HeightData = Array.from({ length: 200 }, (_, i) => i + 1);
export default function Question3({ navigation }) {
  const flatListRef: RefObject<FlatList<any>> | null = useRef(null);
  const [profile, setProfile] = useProfileDataState();
  const [tempHeight, setTempHeight] = useState(profile.height || 10);
  const [tempHeightIndex, setTempHeightIndex] = useState(120);

  const [tempWeight, setTempWeight] = useState(1);
  const [tempWeightIndex, setTempWeightIndex] = useState(120);

  useEffect(() => {
    setProfile(prev => ({
      ...prev,
      height: '',
      heightIndex: '',
      heightMeasure: 'Cm',
    }));
  }, []);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: 115,
      });
    }
  }, [tempHeight]);



  const onScrollEndDrag = (event) => {

    const newIndex = Math.floor((event.nativeEvent.contentOffset.x + 4 * singleItemWidth) / singleItemWidth);
    setTempHeight(HeightData[newIndex])
    setTempHeightIndex(newIndex)
  };

  // const onScrollEndDrag = event => {
  //   const newIndex = Math.floor((event.nativeEvent.contentOffset.x + 4 * singleItemWidth) / singleItemWidth);

  //   setTempHeight(heightValuesInCm[newIndex]);

  //   setTempHeightIndex(newIndex);
  //   // if (newIndex >= 0 && newIndex < heightValuesInCm.length) {
  //   // }
  // };

  const handleSelect = () => {
    setProfile(prev => ({
      ...prev,
      height: parseInt(tempWeight),
      heightIndex: tempWeightIndex,
    }));
    console.log('Height Selected:', tempHeight, tempHeightIndex);

    setTimeout(() => {
      navigation.navigate('Question4');
    }, 0);
  };

  const handleSkip = () => {
    setProfile(prevProfile => ({
      ...prevProfile,
      height: '',
      heightIndex: '',
    }));
    console.log('Skipped Question, resetting height data');

    setTimeout(() => {
      navigation.navigate('Question4');
    }, 0);
  };


  const onScrollEndDragWeight = (event) => {
    const newIndex = Math.floor((event.nativeEvent.contentOffset.x + 4 * singleItemWidth) / singleItemWidth);
    setTempWeight(HeightData[newIndex])
    setTempWeightIndex(newIndex)
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: baseColors.theme }}>
      <View style={styles.main}>
        <IndexTop index={3} max={6} />

        {/* Question Title */}
        <Text style={styles.title}>{'How Tall are you?'}</Text>
        <View style={{ flex: 1, width: '100%', marginTop: hp(7) }}>
          <View style={styles.viewText}>
            {/* original code */}
            {/* <FlatList
              horizontal={true}
              scrollEnabled
              ref={flatListRef}
              style={{
                backgroundColor: baseColors.white,
                borderColor: baseColors.btn_disable,
                borderWidth: 1,
                borderRadius: 10,
              }}
              data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 101]}
              onScroll={onScrollEndDrag}
              onMomentumScrollEnd={onScrollEndDrag}
              legacyImplementation={false}
              keyboardShouldPersistTaps="always"
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.toString()}
              getItemLayout={(_, index) => ({
                index: index,
                length: singleItemWidth,
                offset: index * singleItemWidth,
              })}
              renderItem={({ item }) => (
                <View style={{ width: singleItemWidth, alignSelf: 'center', flexDirection: 'row' }}>
                  <Text
                    style={{
                      fontWeight: '500',
                      fontFamily: AppFonts.medium,
                      fontSize: RFValue(13),
                      color: baseColors.theme,
                    }}>
                    {item != '' ? parseInt(item ?? '') : ''}
                  </Text>
                </View>
              )}
            /> */}


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
              data={HeightData}
              onScroll={onScrollEndDragWeight}
              onMomentumScrollEnd={onScrollEndDragWeight}
              legacyImplementation={false}
              keyboardShouldPersistTaps="always"
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              getItemLayout={(_, index) => ({
                index: index,
                length: singleItemWidth,
                offset: index * singleItemWidth,
              })}
              renderItem={({ item }) => (
                <View style={{ width: singleItemWidth, alignSelf: 'center', flexDirection: 'row' }}>
                  <Text
                    style={{
                      fontWeight: '500',
                      fontFamily: AppFonts.medium,
                      fontSize: RFValue(13),
                      color: baseColors.theme,
                    }}
                  >
                    {parseInt(item) ?? ''}
                  </Text>
                </View>
              )}
            />
          </View>

          {/* Circular Indicator */}
          {/* <Div rounded={31} h={62} w={62} position="absolute" alignItems="center" justifyContent="center" alignSelf="center" mt={-10}>
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
                {parseInt(tempWeight)}
              </Text>
            </Div>
          </Div> */}
          {/*******************  weight section end ***************** */}



          {/* Select Button */}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Pressable onPress={(i) => {
              setProfile((prev) => ({ ...prev, weightMeasure: 'Cm' }));
            }} style={styles.measurmentmain} >
              <View style={styles.innerTab}>
                <Text style={[styles.btnname, { color: baseColors.white }]}>{'Cm'}</Text>
              </View>
            </Pressable>

            <Pressable style={styles.nextbtnOuter} onPress={handleSelect}>
              <Text style={styles.select_Txt}>
                Select
                <Image source={AppImages.right} style={styles.arrow} />
              </Text>
            </Pressable>
          </View>

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
                {parseInt(tempWeight)}
              </Text>
            </Div>
          </Div>

        </View>




      </View>

      {/* Bottom Section */}
      <View style={{ flex: 0.15, paddingHorizontal: wp(4), backgroundColor: baseColors.white }}>
        <View style={styles.bottomInner}>
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
  title: {
    fontSize: RFValue(20),
    textAlign: 'center',
    color: baseColors.black,
    fontFamily: AppFonts.extraBold,
    marginTop: hp(3),
  },
  viewText: {
    width: wp(90),
    height: 40,
    overflow: 'hidden',
  },
  nextbtnOuter: {
    height: wp(9),
    width: wp(20),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: baseColors.theme,
    alignItems: 'center',
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
    tintColor: baseColors.themeLight,
    resizeMode: 'contain',
    marginTop: -5,
  },
  bottomInner: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: baseColors.white,
  },
  skipTxt: {
    fontSize: RFValue(12.5),
    textAlign: 'center',
    fontFamily: AppFonts.bold,
    color: baseColors.theme,
    fontWeight: '600',
  },
  circleContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: -10,
    borderRadius: 31,
    backgroundColor: baseColors.age_InnerCir,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: baseColors.btn_disable + 78,
    borderWidth: 5,
  },
  circleInner: {
    borderRadius: 27,
    height: 55,
    width: 55,
    backgroundColor: baseColors.age_InnerCir,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: {
    fontWeight: '500',
    fontFamily: AppFonts.bold,
    fontSize: RFValue(16),
    color: baseColors.white,
  },
  //tab
  measurmentmain: {
    padding: 3,
    backgroundColor: baseColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(2),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: baseColors.btn_disable,
    width: wp(15),
    height: 40
  },
  innerTab: {
    height: '100%',
    width: '100%',
    backgroundColor: baseColors.theme,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnname: {
    fontSize: RFValue(11),
    fontWeight: '500',
    fontFamily: AppFonts.bold,
  },
});