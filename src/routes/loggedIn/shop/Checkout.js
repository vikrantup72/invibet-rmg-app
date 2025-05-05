import AppUtils from '../../../Utils/appUtils';
import { hp, wp } from '../../../Utils/dimension';
import { addToCart, checkout } from '../../../api/Services/services';
import { useSetAuthValue } from '../../../atoms/auth';
import CustomBtn from '../../../components/CustomBtn';
import { BettingTopBar } from '../../../components/betting/topBar';
import AppImages from '../../../constants/AppImages';
import { baseColors, colors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import { setCartData, setLoader } from '../../../redux/Reducers/tempData';
import { setAuthRedux, setToken } from '../../../redux/Reducers/userData';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Div } from 'react-native-magnus';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { CFPaymentGatewayService } from 'react-native-cashfree-pg-sdk';
import {
  CFDropCheckoutPayment,
  CFEnvironment,
  CFPaymentComponentBuilder,
  CFPaymentModes,
  CFSession,
  CFThemeBuilder,
} from 'cashfree-pg-api-contract';

export function Checkout({ navigation }) {
  const setAuth = useSetAuthValue();
  const { token } = useSelector(state => state?.userData);
  const { cartData, dehliveryAddress } = useSelector(state => state?.tempData);
  const { user } = useSelector(state => state?.userData);
  const hasCoupon = cartData?.coupon_code?.trim()?.length > 0 ? true : false;

  const dispatch = useDispatch();

  const onDecrement = () => {
    if (cartData?.quantity > 1) {
      dispatch(setCartData({ ...cartData, quantity: +cartData?.quantity - 1 }));
    }
  };

  const onIncrement = () => {
    dispatch(setCartData({ ...cartData, quantity: +cartData?.quantity + 1 }));
  };

  async function AddToCart() {
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
      product_id: cartData?.id,
      quantity: cartData?.quantity,
    };

    try {
      const res = await addToCart(body, token);
      console.log('add cart response', res);
      dispatch(setLoader(false));
      if (res?.status == 201) {
        // AppUtils.showToast('Product added to cart successfully');
        Checkout()
      } else {
        AppUtils.showToast(res?.data?.message)
      }
    } catch (err) {
      dispatch(setLoader(false));
      console.log('error while getting product detail', err);
    }
  }

  //Checkout will generate orderid or session id
  async function Checkout() {
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
      address: "lorep ipsum",
      landmar: dehliveryAddress?.landmark ?? "",
      pincode: dehliveryAddress?.pincode ?? "",
      city: dehliveryAddress?.city ?? "",
      state: dehliveryAddress?.state ?? "",
      // coupon_code: cartData?.coupon_code ?? ""
    };
//     console.log('cartdata==',cartData)
// console.log('body===',body,)
    try {
      const res = await checkout(body, token);
      console.log('checkout response===>', res);
      dispatch(setLoader(false));
      if (res?.status == 201) {
        // startPayment(res?.data?.cashfree_order_id,res?.data?.payment_session)
        _startCheckout(("ORDER_" + JSON.stringify(res?.data?.order_id)), res?.data?.payment_session)
      } else {
      }
    } catch (err) {
      dispatch(setLoader(false));
      console.log('error while getting product detail', err);
    }
  }

  const showPaymentSuccessAlert = () => {
    Alert.alert(
      "Payment Successful",
      "Your payment has been processed successfully. Thank you for your purchase!",
      [
        { text: "OK", onPress: () => {
          navigation.navigate('betting/shop')
          console.log("Payment Success OK Pressed")} }
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


  //Start payment
  const _startCheckout = async (orderId, token) => {
    try {
      if (!token) {
        console.error("Token is missing!");
        return; // Don't proceed if token is missing
      }

      // Assuming getSession expects the orderId and token, pass the token along with the orderId
      const session = await getSession(orderId, token);
      console.log('Session: ', session);

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
      console.log('Session:', session, 'Payment Modes:', paymentModes);

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
    
    };
    
    const onError = (error, orderId) => {
      // Alert.alert('order id is : ',orderId)
      console.log(
        "onErrorEvent===>>>" + 'exception is : ' + JSON.stringify(error) + '\norderId is :' + orderId,
      );
      showPaymentFailureAlert()
      console.log(' Error payment==', JSON.stringify(error?.message))
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

  const getSession = (orderId, token) => {
    console.log('getSession==============', orderId, token)
    return new CFSession(
      token,
      orderId,
      CFEnvironment.SANDBOX,
    );
  };

  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar title="Checkout" noIcons />
      <View style={styles.main}>
        <View style={styles.productView}>
          {/* left img */}
          <View style={styles.productImg}>
            <Image source={AppImages.product} style={styles.img} />
          </View>

          {/* right view */}
          <View style={styles.rightview}>
            <View>
              <View style={styles.nameCrossView}>
                <Text style={styles.productname}>{cartData?.name}</Text>
                <Pressable>
                  <Image source={AppImages.cross} style={styles.cross} />
                </Pressable>
              </View>

              <Text style={styles.price}>Rs {cartData?.price}</Text>
            </View>

            <View style={styles.qtyMain}>
              <Text style={styles.qty}>Qty : </Text>
              <View style={styles.counterView}>
                <Pressable onPress={onDecrement} style={styles.counterBtn} hitSlop={20}>
                  <Image source={AppImages.minus} style={styles.icon} />
                </Pressable>
                <Text style={styles.quantity}>{cartData?.quantity}</Text>
                <Pressable onPress={onIncrement} style={styles.counterBtn} hitSlop={20}>
                  <Image source={AppImages.plus} style={[styles.icon, { height: '38%' }]} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* address */}
        <View style={styles.AddressMain}>
          <View style={styles.upper}>
            <Text style={styles.dehliveryAdd}>Delivery Address</Text>
            <Text
              onPress={() => {
                navigation.navigate('AddAddress');
              }}
              style={styles.addAddress}>
              Add new Address
            </Text>
          </View>

          {dehliveryAddress?.pincode?.trim()?.length > 0 && (
            <>
              <View style={styles.seperator} />
              <Text style={styles.dehliveryAdd}>{`${dehliveryAddress?.flat ?? ''}, ${dehliveryAddress?.landmark}, ${dehliveryAddress?.pincode}, ${dehliveryAddress?.city ?? ''
                }, ${dehliveryAddress?.state}`}</Text>
            </>
          )}
        </View>

        {/* offer and benifit */}
        <View style={styles.AddressMain}>
          <View style={styles.upper}>
            <Text style={styles.dehliveryAdd}>Offer & Benefits</Text>
            <Text
              onPress={() => {
                navigation.navigate('Coupons');
              }}
              style={styles.addAddress}>
              Apply
            </Text>
          </View>
        </View>

        {/*  */}
        <View style={styles.AddressMain}>
          <View style={styles.upper}>
            <Text style={styles.dehliveryAdd}>Price Details (1item)</Text>
          </View>

          <View style={[styles.seperator, { marginVertical: hp(1.6) }]} />
          <View style={styles.upper}>
            <Text style={styles.dehliveryAdd}>Total MRP</Text>
            <Text style={styles.dehliveryAdd}>Rs. {(+cartData?.quantity * +cartData?.price).toFixed(2)}</Text>
          </View>
          <View style={[styles.upper, { marginTop: hp(1.5) }]}>
            <Text style={styles.dehliveryAdd}>Total Discount</Text>
            <Text style={[styles.dehliveryAdd, { color: baseColors.green }]}>
              -Rs. {hasCoupon && JSON.stringify(cartData?.coupon_amount)?.length > 0 ? cartData?.coupon_amount : 0}
            </Text>
          </View>

          <View style={[styles.seperator, { marginVertical: hp(1.6) }]} />

          <View style={styles.upper}>
            <Text style={styles.dehliveryAdd}>Total Payable</Text>
            <Text style={styles.dehliveryAdd}>Rs. {(+cartData?.quantity * +cartData?.price - cartData?.coupon_amount ?? 0)?.toFixed(2) ?? 0}</Text>
          </View>
        </View>

        <CustomBtn
          onPress={() => {
            if (dehliveryAddress?.flat?.trim()?.length == 0) {
              AppUtils.showToast_error('Please add address');
            } else {
              // startPayment()
              // _startCheckout("2188397238", "session_ewaYVL3-5h2C2XVpovqgPBNNMrdwJt523G8XqRGGslVHw0yz1Yo1MhvkIGwDwiSNmvJGn6F5V3-rH2cXWISoJFQdycw9fgjVV7VaFrgZ8kBKqJdPlGPq95SNswpaymentpayment")
              // return
              AddToCart();
            }
          }}
          btnName={`Checkout (Rs. ${(+cartData?.quantity * +cartData?.price - cartData?.coupon_amount ?? 0).toFixed(2)})`}
          textStyle={{ color: baseColors.white }}
          btnStyle={{ marginTop: hp(3) }}
        />
      </View>
    </Div>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: baseColors.white,
    paddingHorizontal: wp(4),
  },
  productView: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: baseColors.borderColor,
    marginTop: hp(2),
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productImg: {
    height: hp(18),
    width: '35%',
  },
  img: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 4,
  },
  rightview: {
    height: hp(18),
    width: '64%',
    paddingHorizontal: wp(2),
    paddingVertical: hp(1.2),
    justifyContent: 'space-between',
  },
  productname: {
    fontSize: RFValue(10),
    fontFamily: AppFonts.semibold,
    fontWeight: '400',
    color: baseColors.theme,
    textTransform: 'capitalize',
    width: '80%',
  },
  cross: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
  },
  nameCrossView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: RFValue(12),
    fontFamily: AppFonts.bold,
    fontWeight: '700',
    color: baseColors.theme,
    textTransform: 'capitalize',
  },
  qty: {
    fontSize: RFValue(12),
    fontFamily: AppFonts.medium,
    fontWeight: '400',
    color: baseColors.theme,
    textTransform: 'capitalize',
    marginRight: wp(2),
  },
  qtyMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtn: {
    height: wp(6),
    width: wp(6),
    borderRadius: 0.5,
    borderWidth: 1,
    borderColor: baseColors.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: '18%',
    width: '60%',
    resizeMode: 'contain',
  },
  quantity: {
    fontSize: RFValue(11),
    fontWeight: '700',
    fontFamily: AppFonts.bold,
    color: baseColors.theme,
    marginHorizontal: wp(4),
  },
  AddressMain: {
    paddingVertical: hp(2),
    backgroundColor: 'rgba(123, 96, 134, 0.1)',
    borderRadius: 4,
    marginTop: hp(2),
    paddingHorizontal: wp(3),
  },

  upper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dehliveryAdd: {
    fontSize: RFValue(10),
    fontWeight: '500',
    fontFamily: AppFonts.bold,
    color: baseColors.theme,
  },
  addAddress: {
    fontSize: RFValue(10),
    fontWeight: '500',
    fontFamily: AppFonts.semibold,
    color: baseColors.theme,
    textDecorationLine: 'underline',
  },
  seperator: {
    height: 1,
    width: '100%',
    backgroundColor: baseColors.borderColor,
    marginVertical: hp(1),
  },
});
