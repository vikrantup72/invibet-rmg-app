import { hp, wp } from '../../../Utils/dimension';
import { BettingTopBar } from '../../../components/betting/topBar';
import { baseColors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { Div } from 'react-native-magnus';
import { RFValue } from 'react-native-responsive-fontsize';

const Methods = [
  {
    id: '1',
    title: 'Credit Card',
    description: 'Pay with your Visa, Master, Rupay & more',
  },
  {
    id: '2',
    title: 'UPI',
    description: 'Pay Instant with UPI App',
  },
  {
    id: '3',
    title: 'NetBanking',
    description: 'Pay with any Indian bank',
  },
  {
    id: '4',
    title: 'Wallet (PTs 240)',
    description: 'Check your Wallet',
  },
];

const PaymentMethods = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const renderItem = ({ item }) => (
    <Pressable style={styles.cardsMain} onPress={() => setSelectedPaymentMethod(item.id)}>
      <View style={styles.tittle}>
        <Text style={styles.tittletxt}>{item.title}</Text>
        <Text style={styles.subTittleTxt}>{item.description}</Text>
      </View>
      <View style={styles.radioBtn}>
        <View style={[styles.RadioCircle, selectedPaymentMethod === item.id && styles.selectedRadioCircle]} />
      </View>
    </Pressable>
  );

  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar title="Payment Method" noIcons />
      <View style={styles.main}>
        <FlatList
          data={Methods}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginTop: hp(1) }}
        />
      </View>
    </Div>
  );
};

export default PaymentMethods;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: baseColors.white,
    paddingHorizontal: wp(4),
    paddingTop: hp(3),
  },
  cardsMain: {
    borderWidth: 1,
    width: '100%',
    flexDirection: 'row',
    borderColor: baseColors.borderColor,
    borderRadius: 10,
    marginTop: hp(-0.5),
  },
  tittle: {
    height: '100%',
    width: '85%',
    paddingHorizontal: wp(4),
    justifyContent: 'center',
  },
  radioBtn: {
    height: '100%',
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tittletxt: {
    fontFamily: AppFonts.bold,
    color: baseColors.theme,
    fontWeight: '700',
    fontSize: RFValue(13),
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
});
