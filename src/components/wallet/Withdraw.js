import { useDispatch, useSelector } from 'react-redux';
import AppUtils from '../../Utils/appUtils';
import { hp, wp } from '../../Utils/dimension';
import { BettingTopBar } from '../../components/betting/topBar';
import AppImages from '../../constants/AppImages';
import { baseColors } from '../../constants/colors';
import AppFonts from '../../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'react-native-animatable';
import { Div } from 'react-native-magnus';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSetAuthValue } from '../../atoms/auth';
import { recharge_wallet, CashTransaction, withdraw_winnings } from '../../api/Services/services';
import { setLoader } from '../../redux/Reducers/tempData';
import { Get_wallet, setAuthRedux, setToken } from '../../redux/Reducers/userData';
import moment from 'moment';

const TransactionCard = ({ date, imageSource, points, pointType, status }) => {
  return (
    <View style={styles.TransactionsCard}>
      <View style={styles.DateContainer}>
        <Text style={styles.DateTxt}>{moment(date).format('MMMM Do YYYY, h:mm')}</Text>
        <Text style={[styles.DateTxt, { color: baseColors.purple, textTransform: 'capitalize', fontWeight: '700' }]}>{status ?? ''}</Text>
      </View>
      <View style={styles.BonusContainer}>
        <View style={styles.badgeContainer}>
          <Image source={imageSource} style={styles.rewardBadge} />
        </View>
        <View style={styles.BonusDesc}>
          <Text style={styles.BonusDesTxt}>{pointType ?? ''}</Text>
        </View>
        <View style={styles.PtsContainer}>
          <Text style={styles.PtsTxt}>{points ?? ''}</Text>
        </View>
      </View>
    </View>
  );
};

const Withdraw = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const setAuth = useSetAuthValue();
  const { cartData, dehliveryAddress } = useSelector(state => state?.tempData);
  const { token, user, wallet } = useSelector(state => state?.userData);
  let walletData = wallet
  const [transactions, setTransactions] = useState([]);
  const [Amount, setAmount] = useState('');
  const [couponCode, setCouponCode] = useState('');




  // Cash Transaction API
  const fetchTransactions = async () => {
    try {
      dispatch(setLoader(true));
      const response = await CashTransaction(token);
      const transactionsData = response?.data || [];
      console.log('TtransactionsData:', response?.data);

      if (transactionsData) {

        setTransactions(transactionsData?.all ?? []);
      } else {
        console.log('No transactions data available');
        setTransactions([]);
      }
    } catch (error) {
      console.log('Error fetching transactions:', error);
      AppUtils.showToast_error('Failed to fetch transactions');
      setTransactions([]);
    } finally {
      dispatch(setLoader(false));
    }
  };




  //Checkout will generate orderid or session id
  async function WithdrawAmount() {
    if (!token) {
      setAuth(prev => ({ ...prev, isAuthenticated: false }));
      dispatch(setToken(''));
      dispatch(setAuthRedux(false));
      // @ts-ignore
      navigation.navigate({ key: 'welcome', name: 'welcome' });
      return;
    }
    dispatch(setLoader(true));

    const body = {
      amount: parseInt(Amount)
    };

    try {
      const res = await withdraw_winnings(body, token);
      console.log('widthdraw winning response===>', res);
      dispatch(setLoader(false));
      if (res?.status == 200) {
        dispatch(Get_wallet(user?.id, token))
        setAmount('')
        AppUtils.showToast(res?.data?.message ?? '')
      } else {
        AppUtils.showToast(res?.data?.message ?? '')
      }
    } catch (err) {
      dispatch(setLoader(false));
      console.log('error while withdraw winning', err);
    }
  }


  const Withdraw = () => {
    if (Amount === '' || Amount == 0) {
      AppUtils.showToast_error('Please enter amount');
      return
    }
    else if (Amount > parseInt(walletData?.winning_cash)) {
      AppUtils.showToast_error(`You can only withdraw ${parseInt(walletData?.winning_cash ?? '')}`);
      return
    }
    else {
      console.log('===========', Amount, parseInt(walletData?.winning_cash))
      WithdrawAmount()
    }
  };

  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar title="Withdraw" noIcons />
      <View style={styles.AddMoneyWalletwrapper}>
        <View style={styles.Head}>
          <Text style={styles.Amounttxt}>Total Withdraw Amount</Text>
          <Text style={styles.Points}>{`₹ ${walletData?.winning_cash.toFixed(1)}`}</Text>
        </View>
        <View style={styles.InputContainer}>
          <Text style={styles.enterAmount}>Enter Amount</Text>
          <View style={styles.AmountContainer}>
            <TextInput
              placeholder="Enter Amount"
              placeholderTextColor={baseColors.placeholder}
              style={styles.input}
              keyboardType={'number-pad'}
              value={Amount}
              onChangeText={setAmount}
            />
            <Pressable style={styles.AddBtn} onPress={Withdraw}>
              <Text style={styles.btnTxt}>Withdraw</Text>
            </Pressable>
          </View>
          {/* <Text style={styles.enterCode}>Enter Coupon Code</Text>
          <View style={styles.couponContainer}>
            <TextInput
              placeholder="Enter Coupon Code"
              placeholderTextColor={baseColors.placeholder}
              style={styles.input}
              value={couponCode}
              onChangeText={setCouponCode}
            />
            <Pressable style={styles.ApplyBtn} onPress={Coupon}>  
              <Text style={couponCode ? styles.AppliedTxt : styles.ApplyBtnTxt}>Apply</Text>
            </Pressable>
          </View> */}
        </View>


      </View>
    </Div>
  );
};

export default Withdraw;

const styles = StyleSheet.create({
  AddMoneyWalletwrapper: {
    flex: 1,
    paddingTop: hp(1),
    paddingHorizontal: wp(4),
    backgroundColor: baseColors.white,
  },
  Head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  Amounttxt: {
    fontWeight: '700',
    fontSize: RFValue(13.5),
    color: baseColors.theme,
    fontFamily: AppFonts.medium,
  },
  Points: {
    fontSize: RFValue(14),
    color: baseColors.theme,
    fontFamily: AppFonts.bold,
    fontWeight: '600',
  },
  InputContainer: {
    flexDirection: 'column',
  },
  AmountContainer: {
    flexDirection: 'row',
    top: -10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: baseColors.borderColor,
  },
  enterAmount: {
    fontWeight: '600',
    fontSize: RFValue(12.5),
    paddingVertical: hp(2),
    color: baseColors.theme,
    fontFamily: AppFonts.bold,
  },
  input: {
    width: '75%',
    height: hp(7),
    maxHeight: 40,
    paddingHorizontal: 20,
    color: baseColors.black,
    fontSize: 14,
    fontFamily: AppFonts.medium
  },
  AddBtn: {
    backgroundColor: baseColors.theme,
    width: '25%',
    borderRadius: 5,
    justifyContent: 'center',
  },
  btnTxt: {
    textAlign: 'center',
    alignItems: 'center',
    fontSize: RFValue(12),
    color: baseColors.white,
    fontFamily: AppFonts.regular,
    fontWeight: '700',
  },
  enterCode: {
    fontWeight: '600',
    fontSize: RFValue(12.5),
    paddingVertical: hp(2),
    color: baseColors.theme,
    fontFamily: AppFonts.bold,
  },
  couponContainer: {
    flexDirection: 'row',
    top: -10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: baseColors.borderColor,
  },
  ApplyBtn: {
    width: '25%',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    backgroundColor: baseColors.white,
    borderColor: baseColors.borderColor,
  },
  ApplyBtnTxt: {
    fontWeight: '400',
    textAlign: 'center',
    alignItems: 'center',
    fontSize: RFValue(12),
    fontFamily: AppFonts.medium,
    color: baseColors.borderColor,
  },
  AppliedTxt: {
    color: baseColors.theme,
    fontWeight: '400',
    textAlign: 'center',
    alignItems: 'center',
    fontSize: RFValue(12),
    fontFamily: AppFonts.medium,
  },
  TransactionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: wp(5),
  },
  TransactionsHead: {
    fontWeight: '600',
    fontSize: RFValue(14.5),
    color: baseColors.theme,
    fontFamily: AppFonts.bold,
  },
  ViewAll: {
    fontSize: RFValue(11),
    color: baseColors.theme,
    fontFamily: AppFonts.bold,
    textDecorationLine: 'underline',
  },
  TransactionsCard: {
    marginTop: hp(1),
    borderRadius: 5,
    paddingVertical: hp(1),
    backgroundColor: baseColors.offwhite,
  },
  DateContainer: {
    // marginTop: hp(1),
    paddingHorizontal: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  DateTxt: {
    fontWeight: '400',
    fontSize: RFValue(9),
    fontFamily: AppFonts.medium,
    color: baseColors.themeLight,
  },
  BonusContainer: {
    marginTop: hp(0.6),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardBadge: {
    height: wp(7),
    width: wp(7),
    maxHeight: 22,
    maxWidth: 22,
    resizeMode: 'contain',
  },
  BonusDesc: {
    width: '60%',
    justifyContent: 'center',
  },
  BonusDesTxt: {
    fontWeight: '700',
    fontSize: RFValue(11),
    color: baseColors.theme,
    fontFamily: AppFonts.light,
    textAlign: 'left',
    paddingHorizontal: wp(2),
    textTransform: 'capitalize'
  },
  PtsContainer: {
    width: '25%',
    justifyContent: 'center',
  },
  PtsTxt: {
    fontWeight: '400',
    fontSize: RFValue(9.5),
    color: baseColors.theme,
    fontFamily: AppFonts.bold,
    textAlign: 'right',
  },
  noTransactionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(4),
  },
  noTransactionsText: {
    fontSize: RFValue(14),
    color: baseColors.theme,
    fontFamily: AppFonts.medium,
    marginBottom: hp(1),
  },
  noTransactionsSubText: {
    fontSize: RFValue(11),
    color: baseColors.themeLight,
    fontFamily: AppFonts.regular,
  },
});
