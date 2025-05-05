import AppUtils from '../../../Utils/appUtils';
import { hp, wp } from '../../../Utils/dimension';
import { update_profile } from '../../../api/Services/services';
import { useSetAuthValue } from '../../../atoms/auth';
import CommanTextInput from '../../../components/CommanTextInput';
import CustomBtn from '../../../components/CustomBtn';
import { BettingTopBar } from '../../../components/betting/topBar';
import { baseColors } from '../../../constants/colors';
import { useAsyncStorage } from '../../../hooks/useAsyncStorage';
import { setLoader } from '../../../redux/Reducers/tempData';
import { Get_user_detail, setAuthRedux, setToken } from '../../../redux/Reducers/userData';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, styleheet, StyleSheet, Text, View } from 'react-native';
import { Div } from 'react-native-magnus';
import { useDispatch, useSelector } from 'react-redux';
import AppFonts from '../../../constants/fonts';
import { RFValue } from 'react-native-responsive-fontsize';
import { parse } from 'react-native-svg';

const singleItemWidth = 44;
const ageOneToHundred = Array?.from({ length: 100 }).map((_, idx) => idx);
const heightTwoHundered = Array?.from({ length: 300 }).map((_, idx) => idx);

export function EditProfile({ navigation }) {
  const { deviceAddress, auth, token, user } = useSelector(state => state?.userData);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const { getString } = useAsyncStorage();
  const setAuth = useSetAuthValue();
  const dispatch = useDispatch();


  //**********************************  age section start ******************
  const flatListRef = useRef(null);
  useEffect(() => {
    if (flatListRef.current && user.age) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: user.age - 4,
      });
      setAge(user.age);
    }
  }, [user.age]);

  const onScrollEndDrag = (event) => {
    const newValue = Math.floor((event.nativeEvent.contentOffset.x + 4 * singleItemWidth) / singleItemWidth);
    setAge(parseInt(newValue));
  };
  //****************************************age selection end **********************

  //**********************************  height section start ******************
  const flatListRefHeight = useRef(null);
  useEffect(() => {
    if (flatListRefHeight.current && user.height) {
      flatListRefHeight.current.scrollToIndex({
        animated: true,
        index: parseInt(user.height) - 4,
      });
      setAge(parseInt(user.height));
    }
  }, [user.height]);

  const onScrollEndDragHeight = (event) => {
    const newValue = Math.floor((event.nativeEvent.contentOffset.x + 4 * singleItemWidth) / singleItemWidth);
    setHeight(parseInt(newValue));
  };
  //****************************************height selection end **********************

  //********************************** weight section start ******************
  const flatListRefWeight = useRef(null);
  useEffect(() => {
    if (flatListRefWeight.current && user.weight) {
      flatListRefWeight.current.scrollToIndex({
        animated: true,
        index: parseInt(user.weight) - 4,
      });
      setAge(parseInt(user.weight));
    }
  }, [user.weight]);

  const onScrollEndDragWeight = (event) => {
    const newValue = Math.floor((event.nativeEvent.contentOffset.x + 4 * singleItemWidth) / singleItemWidth);
    setWeight(parseInt(newValue));
  };
  //**************************************** weight selection end **********************

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setGender(user?.gender ?? '');
    setAge(JSON.stringify(user?.age) ?? '');
    setHeight(parseInt(user?.height) ?? '');
    setWeight(parseInt(user?.weight) ?? '');
  }, [user]);

  const verify = () => {
    if (name?.trim()?.length == 0) {
      AppUtils.showToast_error('Please enter name');
    } else if (email?.trim()?.length == 0) {
      AppUtils.showToast_error('Please enter email');
    } else if (!AppUtils.validateEmail(email)) {
      AppUtils.showToast_error('Please enter valid email');
    } else if (gender?.trim()?.length == 0) {
      AppUtils.showToast_error('Please enter gender');
    } else if (age?.length == 0) {
      AppUtils.showToast_error('Please enter age');
    } else if (height?.length == 0) {
      AppUtils.showToast_error('Please enter height');
    } else if (weight?.length == 0) {
      AppUtils.showToast_error('Please enter weight');
    } else {
      UpdateProfile();
    }
  };

  //update profile
  async function UpdateProfile() {
    // if (!token) {
    //   setAuth(prev => ({ ...prev, isAuthenticated: false }));
    //   dispatch(setToken(''));
    //   dispatch(setAuthRedux(false));
    //   // @ts-ignore
    //   navigation.navigate({ key: 'welcome', name: 'welcome' });
    //   return;
    // }
    const body = {
      gender: gender,
      age: parseInt(age),
      height: parseInt(height),
      weight: parseInt(weight),
      name: name,
      email: email,
    };
    dispatch(setLoader(true));
    try {
      const res = await update_profile(body, token);
      console.log('update profile res==',res)
      dispatch(setLoader(false));
      if (res?.status == 200) {
        dispatch(Get_user_detail(token));
        AppUtils.showToast('Profile updated successfully');
        navigation.goBack();
      } else {
      }
    } catch (err) {
      dispatch(setLoader(false));
      AppUtils.showToast_error('Something went wrong, try again');
      console.log('error while updating profile', err);
    }
  }

  const GenderSelection = () => {
    console.log('selected gender is ==',gender)
    return (
      <View style={style.genderMain} >

        {/* Male */}
        <View style={style.blockOuter} >
          <Pressable hitSlop={20} onPress={() => setGender('male')} style={style.radioOuter} >
            {(gender?.toLowerCase() == 'male') && <View style={style.radioInner} ></View>}
          </Pressable>
          <Text onPress={() => setGender('male')} style={style.genderTitle} >Male</Text>
        </View>

        {/* Female */}
        <View style={style.blockOuter} >
          <Pressable hitSlop={20} onPress={() => setGender('female')} style={style.radioOuter} >
            {(gender?.toLowerCase() == 'female') && <View style={style.radioInner} ></View>}
          </Pressable>
          <Text onPress={() => setGender('female')} style={style.genderTitle} >Female</Text>
        </View>

      </View>
    )
  }

  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar title="Edit Profile" noIcons />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: hp(7) }} showsVerticalScrollIndicator={false}>
        <View style={style.main}>
          <CommanTextInput titleTxt={'Name'} onChangeText={t => setName(t)} placeholder={'Enter Name'} value={name} />
          <CommanTextInput titleTxt={'Email Address'} onChangeText={t => setEmail(t)} placeholder={'Enter Email Address'} value={email} keyboardType='email-address' />

          <View>
            <Text maxFontSizeMultiplier={2} style={style.title}>{'Gender'}</Text>
            <GenderSelection />
          </View>

          {/* <CommanTextInput
            titleTxt={'How Old are you?'}
            onChangeText={t => setAge(t)}
            placeholder={'Enter Age'}
            value={age}
            keyboardType="number-pad"
          /> */}

          {/* 88**************************** Age start **************************** */}
          <View >
            <Text maxFontSizeMultiplier={2} style={style.title}>{'How Old are you?'}</Text>
            {/* Question Title */}
            <View style={{ flex: 1, width: '100%', marginTop: hp(1) }}>
              <View style={style.viewText}>
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
                      fontSize: RFValue(13),
                      color: baseColors.white,
                    }}>
                    {parseInt(age)}
                  </Text>
                </Div>
              </Div>
            </View>
            {/* 88**************************** Age end **************************** */}

            {/* 88**************************** Height start **************************** */}
            <View >
              <Text maxFontSizeMultiplier={1} style={style.title}>{'How Tall are you? (cm)'}</Text>
              {/* Question Title */}
              <View style={{ flex: 1, width: '100%', marginTop: hp(1) }}>
                <View style={style.viewText}>
                  <FlatList
                    horizontal={true}
                    scrollEnabled
                    ref={flatListRefHeight}
                    style={{
                      backgroundColor: baseColors.white,
                      borderColor: baseColors.btn_disable,
                      borderWidth: 1,
                      borderRadius: 10,
                    }}
                    data={heightTwoHundered}
                    onScroll={onScrollEndDragHeight}
                    legacyImplementation={false}
                    keyboardShouldPersistTaps="always"
                    onMomentumScrollEnd={onScrollEndDragHeight}
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
                        fontSize: RFValue(13),
                        color: baseColors.white,
                      }}>
                      {parseInt(height)}
                    </Text>
                  </Div>
                </Div>
              </View>
            </View>
            {/* 88**************************** Height end **************************** */}

            {/* 88**************************** Weight start **************************** */}
            <View >
              <Text maxFontSizeMultiplier={1} style={style.title}>{'Current Weight (kg)'}</Text>
              {/* Question Title */}
              <View style={{ flex: 1, width: '100%', marginTop: hp(1) }}>
                <View style={style.viewText}>
                  <FlatList
                    horizontal={true}
                    scrollEnabled
                    ref={flatListRefWeight}
                    style={{
                      backgroundColor: baseColors.white,
                      borderColor: baseColors.btn_disable,
                      borderWidth: 1,
                      borderRadius: 10,
                    }}
                    data={heightTwoHundered}
                    onScroll={onScrollEndDragWeight}
                    legacyImplementation={false}
                    keyboardShouldPersistTaps="always"
                    onMomentumScrollEnd={onScrollEndDragWeight}
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
                        fontSize: RFValue(13),
                        color: baseColors.white,
                      }}>
                      {parseInt(weight)}
                    </Text>
                  </Div>
                </Div>
              </View>
            </View>
            {/* 88**************************** Weight end **************************** */}



          </View>
          {/* <CommanTextInput
            titleTxt={'Current Weight'}
            onChangeText={t => setWeight(t)}
            placeholder={'Enter Weight'}
            value={weight}
            keyboardType="number-pad"
          /> */}
          <View style={style.btnOuter}>
            <CustomBtn
              onPress={() => {
                verify();
              }}
              btnName={'Submit'}
              textStyle={{ color: baseColors.white }}
              btnStyle={{ marginTop: hp(2) }}
            />
          </View>


        </View>
      </ScrollView>
    </Div>
  );
}

const style = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
  },
  btnOuter: {
    marginTop: hp(6),
  },
  genderMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(0.5)
  },
  radioInner: {
    height: '100%',
    width: '100%',
    backgroundColor: baseColors.theme,
    borderRadius: wp(6),
  },
  radioOuter: {
    height: wp(6),
    width: wp(6),
    borderRadius: wp(6),
    maxHeight: 17,
    maxWidth: 17,
    borderWidth: 2,
    borderColor: baseColors.theme,
    padding: 1
  },
  genderTitle: {
    fontFamily: AppFonts.medium,
    fontWeight: '400',
    fontSize: RFValue(12),
    color: baseColors.black,
    marginLeft: wp(2)
  },
  blockOuter: {
    flexDirection: "row",
    alignItems: 'center',
    marginRight: wp(8)
  },
  title: {
    fontFamily: AppFonts.semibold,
    fontSize: RFValue(12),
    color: baseColors.theme,
    width: '100%',
    marginBottom: 5,
    marginTop: hp(3),
  },
  viewText: {
    width: '100%',
    // marginTop:hp(2),
    // backgroundColor: 'red',
    height: 40,
    overflow: 'hidden',
  },
  ///////////////////
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


  // viewText: {
  //   width: '100%',
  //   // marginTop:hp(2),
  //   // backgroundColor: 'red',
  //   height: 40,
  //   overflow: 'hidden',
  // },

});
