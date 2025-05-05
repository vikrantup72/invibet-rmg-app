import { SuccessToast } from 'react-native-toast-message';
import AppUtils from '../../../Utils/appUtils';
import { wp } from '../../../Utils/dimension';
import CommanTextInput from '../../../components/CommanTextInput';
import CustomBtn from '../../../components/CustomBtn';
import { BettingTopBar } from '../../../components/betting/topBar';
import { baseColors, colors } from '../../../constants/colors';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Div } from 'react-native-magnus';

const AddUPI = () => {
  const [upiID, setUpiID] = useState('');

  const isValidUPI = upi => {
    const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiPattern.test(upi) && upi.length >= 5 && upi.length <= 30;
  };

  const handleSubmit = () => {
    if (isValidUPI(upiID)) {
        AppUtils.showToast( 'UPI ID is valid!')
    } else {
        AppUtils.showToast_error('Please enter Valid UPI ID');
    }
  };
  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar title="Add UPI" noIcons />
      <View style={styles.NotificationWrapper}>
        <CommanTextInput titleTxt={'Add UPI ID'} placeholder={'Enter Add UPI ID'} placeholderTextColor='red' />
        <CustomBtn onPress={handleSubmit} btnName={'Submit'} textStyle={{ color: baseColors.white }} />
      </View>
    </Div>
  );
};

export default AddUPI;

const styles = StyleSheet.create({
  NotificationWrapper: {
    flex: 1,
    paddingHorizontal: wp(4),
    backgroundColor: baseColors.white,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
});
