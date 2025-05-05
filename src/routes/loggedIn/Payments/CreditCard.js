import AppUtils from '../../../Utils/appUtils';
import { wp } from '../../../Utils/dimension';
import CommanTextInput from '../../../components/CommanTextInput';
import CustomBtn from '../../../components/CustomBtn';
import { BettingTopBar } from '../../../components/betting/topBar';
import { baseColors } from '../../../constants/colors';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Div } from 'react-native-magnus';

const CreditCard = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSubmit = () => {
    const cardNumberRegex = /^\d{13,19}$/;
    q;
    if (!cardNumberRegex.test(cardNumber)) {
      AppUtils.showToast_error('Please enter valid card number 13 to 19 digits)');
      return;
    }
    const [month, year] = expiryDate.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (!month || !year || month < 1 || month > 12 || year < currentYear) {
      AppUtils.showToast_error('Please enter a valid expiry date (MM/YY)');
      return;
    } else if (year == currentYear && month < currentMonth) {
      AppUtils.showToast_error('Expiry Date Cannot be Before Today');
      return;
    }
  };
  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar title="Credit Card Details" noIcons />
      <View style={styles.NotificationWrapper}>
        <CommanTextInput titleTxt={'Card Number'} placeholder={'Enter Card Number'} maxLength={19} onChangeText={setCardNumber} />
        <CommanTextInput titleTxt={'Card Holder Name'} placeholder={'Enter Holder Name'} />

        <View style={styles.Date_CVV}>
          <View style={styles.Date}>
            <CommanTextInput titleTxt={'MM/YY'} placeholder={'12/26'} onChangeText={setExpiryDate} />
          </View>
          <View style={styles.CVV}>
            <CommanTextInput titleTxt={'CVV'} placeholder={'Enter CVV'} keyboardType="numeric" />
          </View>
        </View>
        <CustomBtn onPress={handleSubmit} btnName={'Submit'} textStyle={{ color: baseColors.white }} />
      </View>
    </Div>
  );
};
export default CreditCard;

const styles = StyleSheet.create({
  NotificationWrapper: {
    flex: 1,
    paddingHorizontal: wp(4),
    backgroundColor: baseColors.white,
    paddingVertical: 10,
  },
  Date_CVV: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  Date: {
    width: '45%',
  },
  CVV: {
    width: '45%',
  },
});
