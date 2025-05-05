import { hp, wp } from '../../Utils/dimension';
import { BettingTopBar } from '../../components/betting/topBar';
import { RoundedTopBar } from '../../components/loginFlow/roundedTopBar';
import { Item } from '../../components/verticalScrolls';
import { baseColors } from '../../constants/colors';
import AppFonts from '../../constants/fonts';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Div } from 'react-native-magnus';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { LoggedInStackParamsList } from '../types';
import CustomBtn from '../../components/CustomBtn';
import { useDispatch } from 'react-redux';
import { setConnection_status } from '../../redux/Reducers/tempData';
import { setAuthRedux, setIsSkipped } from '../../redux/Reducers/userData';

const Methods = [
  {
    id: 1,
    title: 'Set up a Device',
  },
  {
    id: 2,
    title: 'Continue Using the App',
  },
];
const Setup = () => {
  const navigation = useNavigation();
  const [selectMethods, setSelectedMethods] = useState(null);
  const dispatch = useDispatch()
  console.log('selectMethods-==-', selectMethods)
  const renderItem = ({ item }) => (
    <>
      <Pressable style={styles.cardsMain} onPress={() => setSelectedMethods(item.id)}>
        <View style={styles.tittle}>
          <Text style={styles.tittletxt}>{item.title}</Text>
        </View>
        <View style={styles.radioBtn}>
          <View style={[styles.RadioCircle, selectMethods === item.id && styles.selectedRadioCircle]} />
        </View>
      </Pressable>
      {item.id === 1 && (
        <View style={styles.cashbackContainer}>
          <Text style={styles.cashbackText}>
            Don’t Have a device?{' '}
            <Text
              style={styles.linkText}
              onPress={() => {
                // Add your link navigation logic here
                console.log('Navigate to the device page');
              }}>
              Get a device
            </Text>{' '}
            with 100% Cashback
          </Text>
        </View>
      )}
    </>
  );
  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar title="Set up" noIcons />
      <View style={styles.main}>
        <View style={styles.Heading}>
          <Text style={styles.HeadingTxt}>What would you like to do? </Text>
          <Text style={styles.subHeadingTxt}>Lorem Ipsum is simply dummy text of
          </Text>
          <Text style={styles.subHeadingTxt2} >
            the printing and typesetting industry.
          </Text>

        </View>
        <FlatList
          data={Methods}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginTop: hp(1), paddingBottom: hp(15) }}
        />
        <CustomBtn
          btnName={'Submit'}
          textStyle={{ color: baseColors.white }}
          btnStyle={[
            { marginVertical: hp(2) },
            !selectMethods && { opacity: 0.8 }
          ]}
          disabled={!selectMethods}
          onPress={() => {
            console.log('Selected Method:', selectMethods);
            if (selectMethods === 1) {
              navigation.navigate('DeviceSetup');
              dispatch(setIsSkipped(false))
            } else if (selectMethods === 2) {
              // navigation.navigate('bettingTabs');
              dispatch(setAuthRedux(true))
              dispatch(setConnection_status({ isConnected: false, isConnecting: false }))
              dispatch(setIsSkipped(false))
            } else {
              console.error('Invalid Method Selected');
            }
          }}
        />
      </View>
    </Div>
  );
};

export default Setup;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingTop: hp(3),
  },
  Heading: {
    paddingVertical: hp(1),
  },
  HeadingTxt: {
    fontFamily: AppFonts.bold,
    fontSize: RFValue(23),
    color: baseColors.theme,
    textAlign: 'center',
    marginTop: hp(1),
  },
  subHeadingTxt: {
    fontFamily: AppFonts.regular,
    fontSize: RFValue(12),
    color: baseColors.theme,
    textAlign: 'center',
    marginTop: hp(1),
  },
  subHeadingTxt2: {
    fontFamily: AppFonts.regular,
    fontSize: RFValue(11),
    color: baseColors.theme,
    textAlign: 'center',
    marginTop: hp(1),
  },
  cardsMain: {
    borderWidth: 1,
    width: wp(90),
    flexDirection: 'row',
    borderColor: baseColors.borderColor,
    borderRadius: wp(2.5),
    marginTop: hp(1),
    paddingVertical: hp(1.5),

  },
  tittle: {
    width: '85%',
    paddingHorizontal: wp(5),
    justifyContent: 'center',
  },
  radioBtn: {
    paddingVertical: hp(1),
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tittletxt: {
    fontFamily: AppFonts.medium,
    color: baseColors.theme,
    fontWeight: '700',
    fontSize: RFValue(14),
  },
  subTittleTxt: {
    fontFamily: AppFonts.medium,
    fontWeight: '400',
    color: baseColors.theme,
    fontSize: RFValue(10),
  },
  RadioCircle: {
    width: wp(6),
    height: wp(6),
    borderWidth: 2,
    borderRadius: 100,
    borderColor: baseColors.yellowPrimary,
  },
  selectedRadioCircle: {
    backgroundColor: baseColors.yellowPrimary,
    width: wp(6),
    height: wp(6),
    borderRadius: wp(6),
    borderColor: baseColors.yellowPrimary,
  },
  cashbackContainer: {
    marginTop: hp(0.5),
    alignItems: 'center',
  },
  cashbackText: {
    fontFamily: AppFonts.medium,
    fontSize: RFValue(12),
    color: baseColors.theme,
    textAlign: 'center',
  },
  linkText: {
    color: baseColors.theme || baseColors.theme,
    fontFamily: AppFonts.medium,
    textDecorationLine: 'underline',
  },
});
