import { useDispatch, useSelector } from 'react-redux';
import AppUtils from '../../../Utils/appUtils';
import { hp, wp } from '../../../Utils/dimension';
import CommanTextInput from '../../../components/CommanTextInput';
import CustomBtn from '../../../components/CustomBtn';
import { BettingTopBar } from '../../../components/betting/topBar';
import AppImages from '../../../constants/AppImages';
import { baseColors, colors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'react-native-animatable';
import { Div } from 'react-native-magnus';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSetAuthValue } from '../../../atoms/auth';
import { checkout, recharge_wallet, wallet, CashTransaction } from '../../../api/Services/services';
import { setLoader } from '../../../redux/Reducers/tempData';
import { CFPaymentGatewayService } from 'react-native-cashfree-pg-sdk';
import {
  CFDropCheckoutPayment,
  CFEnvironment,
  CFPaymentComponentBuilder,
  CFPaymentModes,
  CFSession,
  CFThemeBuilder,
} from 'cashfree-pg-api-contract';
import { Get_wallet, setAuthRedux, setToken } from '../../../redux/Reducers/userData';
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
          <Text style={styles.BonusDesTxt}>{pointType??''}</Text>
        </View>
        <View style={styles.PtsContainer}>
          <Text style={styles.PtsTxt}>{points??''}</Text>
        </View>
      </View>
    </View>
  );
};

const AddMoneyWallet = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const setAuth = useSetAuthValue();
  const { cartData, dehliveryAddress } = useSelector(state => state?.tempData);
  const { token, user, wallet } = useSelector(state => state?.userData);
  let walletData = wallet
  const [transactions, setTransactions] = useState([]);
  // console.log('transactions======',transactions)
  // const [walletData, setWalletData] = useState({ total_balance: 0 });
  const [Amount, setAmount] = useState('');
  const [couponCode, setCouponCode] = useState('');
  // Wallet API
  // const fetchWalletData = async () => {
  //   try {
  //     dispatch(setLoader(true));
  //     const response = await wallet(user?.id, token);
  //     console.log('Wallet API Response===>', response)
  //     if (response?.status === 200) {
  //       setWalletData(response?.data?.wallet);
  //     }
  //   } catch (error) {
  //     console.log('Error fetching wallet data:', error);
  //     AppUtils.showToast_error('Failed to fetch wallet data');
  //   } finally {
  //     dispatch(setLoader(false));
  //   }
  // };

  useEffect(() => {
    dispatch(Get_wallet(user?.id, token))
    // fetchWalletData();
  }, [user?.id, token]);

  // Cash Transaction API
  const fetchTransactions = async () => {
    try {
      dispatch(setLoader(true));
      const response = await CashTransaction(token);
      const transactionsData = response?.data || [];
      console.log('TtransactionsData:', response?.data);

      if (transactionsData) {
        
        setTransactions(transactionsData?.all??[]);
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

  // Helper function to determine transaction image
  const getTransactionImage = (type) => {
    switch (type?.toLowerCase()) {
      case 'reward':
        return AppImages.Reward_Bonus_Badge;
      case 'earning':
        return AppImages.Earning_Badge;
      case 'recharge':
        return AppImages.Recharge_Badge;
      default:
        return AppImages.Recharge_Badge;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [token]);

  const Add = () => {
    if (Amount === '' || Amount === 0) {
      AppUtils.showToast_error('Please enter a Valid Amount');
      return
    }
    else {
      Checkout_wallet()
    }
  };

  const Coupon = () => {
    if (couponCode.trim() === '') {
      AppUtils.showToast_error('Please enter a Valid Coupon Code');
    }
  };

  const showPaymentSuccessAlert = () => {
    Alert.alert(
      "Payment Successful",
      "Your payment has been processed successfully. Thank you for your purchase!",
      [
        {
          text: "OK", onPress: () => {
            //navigation.navigate('betting/shop')
            console.log("Payment Success OK Pressed")
          }
        }
      ],
      { cancelable: false }
    );
  };

  const showPaymentFailureAlert = () => {
    Alert.alert(
      "Payment Failed",
      "There was an issue processing your payment. Please try again later or contact support.",
      [
        { text: "OK", onPress: () => console.log("Payment Failure OK Pressed") }
      ],
      { cancelable: false }
    );
  };


  useEffect(() => {
    const onReceivedEvent = (eventName, map) => {
      console.log(
        'onReceivedEvent===>>>.' + 'Event recieved on screen: ' +
        eventName +
        ' map: ' +
        JSON.stringify(map),
      );
    };
    const onVerify = (orderId) => {
      console.log('onVerifyEvent===>>>', 'verify orderId:', orderId);
      showPaymentSuccessAlert()
      // fetchWalletData() // Walllet Data APi Hitttt
      setAmount('')
      dispatch(Get_wallet(user?.id, token))
      fetchTransactions()
    };

    const onError = (error, orderId) => {
      // Alert.alert('order id is : ', orderId)
      console.log(
        "onErrorEvent===>>>" + 'exception is : ' + JSON.stringify(error) + '\norderId is :' + orderId,
      );
      showPaymentFailureAlert()
      console.log(' Error payment==', JSON.stringify(error?.message))
      fetchTransactions()
      // updateStatus(JSON.stringify(error));
    };
    CFPaymentGatewayService.setEventSubscriber({ onReceivedEvent });
    CFPaymentGatewayService.setCallback({ onVerify, onError });
    return () => {
      console.log('UNMOUNTED');
      CFPaymentGatewayService.removeCallback();
      CFPaymentGatewayService.removeEventSubscriber();
    };
  }, []);


  //Checkout will generate orderid or session id
  async function Checkout_wallet() {
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
      user_id: user?.id,
      recharge_amount: Amount
    };
    console.log('token-=-'), token
    try {
      const res = await recharge_wallet(body, token);
      console.log('recharge wallet response===>', res);
      dispatch(setLoader(false));
      if (res?.status == 201) {
        // startPayment(res?.data?.cashfree_order_id,res?.data?.payment_session)
        _startCheckout(res?.data?.order_id, res?.data?.payment_session)
      } else {
      }
    } catch (err) {
      dispatch(setLoader(false));
      console.log('error while getting product detail', err);
    }
  }

  const getSession = (orderId, token) => {
    console.log('getSession==============', orderId, token)
    return new CFSession(
      token,
      orderId,
      CFEnvironment.PRODUCTION,
    );
  };

  //Start payment
  const _startCheckout = async (orderId, token) => {
    try {

      if (!token) {
        console.error("Token is missing!");
        return; // Don't proceed if token is missing
      }

      // Assuming getSession expects the orderId and token, pass the token along with the orderId
      const session = await getSession(orderId, token);
      console.log('recharge_wallet Session: ', session);

      // Create payment modes as before
      const paymentModes = new CFPaymentComponentBuilder()
        .add(CFPaymentModes.CARD)
        .add(CFPaymentModes.UPI)
        .add(CFPaymentModes.NB)
        .add(CFPaymentModes.WALLET)
        .add(CFPaymentModes.PAY_LATER)
        .build();

      // Define the theme for the payment UI
      const theme = new CFThemeBuilder()
        .setNavigationBarBackgroundColor(colors.theme)
        .setNavigationBarTextColor('#FFFFFF')
        .setButtonBackgroundColor('#FFC107')
        .setButtonTextColor('#FFFFFF')
        .setPrimaryTextColor('#212121')
        .setSecondaryTextColor('#757575')
        .build();

      // Log session and payment modes for debugging
      console.log('recharge_wallet Session:', session, 'recharge_wallet Payment Modes:', paymentModes);

      // Prepare the drop payment object
      const dropPayment = new CFDropCheckoutPayment(session, paymentModes, theme);
      console.log('Drop Payment Object:', JSON.stringify(dropPayment));

      // Call the Cashfree payment service
      CFPaymentGatewayService.doPayment(dropPayment)
      // .then(response => {
      //   console.log('Payment Response:', response);
      // }).catch(error => {
      //   console.error('Payment Error:', error);
      // });
    } catch (e) {
      console.error('_startCheckout error ===>', e);
    }
  };

  // Update MyCashTransaction function to refresh data
  const MyCashTransaction = () => {
    fetchTransactions();
    navigation.navigate('CashTransaction');
  };

  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar title="Add Money" noIcons />
      <View style={styles.AddMoneyWalletwrapper}>
        <View style={styles.Head}>
          <Text style={styles.Amounttxt}>Total Amount</Text>
          <Text style={styles.Points}>PTs {walletData?.total_balance.toFixed(1)}</Text>
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
            <Pressable style={styles.AddBtn} onPress={Add}>
              <Text style={styles.btnTxt}>Add</Text>
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
        <View style={styles.TransactionWrapper}>
          <Text style={styles.TransactionsHead}>MyCash Transactions</Text>
          <Text onPress={MyCashTransaction} style={styles.ViewAll}>
            View All
          </Text>
        </View>
        {transactions.length > 0 ? (
          <FlatList
            data={transactions.slice(0, 10)}
            contentContainerStyle={{paddingBottom:hp(4)}}
            renderItem={({ item }) => (
              <TransactionCard date={item.created_at} imageSource={AppImages.Reward_Bonus_Badge} pointType={item.point_type} points={item.amount} status={item?.status} />
            )}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noTransactionsContainer}>
            <Text style={styles.noTransactionsText}>
              No transactions available yet
            </Text>
            <Text style={styles.noTransactionsSubText}>
              Your Latest 10 transaction history will appear here
            </Text>
          </View>
        )}
      </View>
    </Div>
  );
};

export default AddMoneyWallet;

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
    textTransform:'capitalize'
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
