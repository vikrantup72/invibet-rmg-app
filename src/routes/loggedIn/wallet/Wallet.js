import { useDispatch, useSelector } from 'react-redux';
import AppUtils from '../../../Utils/appUtils';
import { hp, wp } from '../../../Utils/dimension';
import CommanTextInput from '../../../components/CommanTextInput';
import CustomBtn from '../../../components/CustomBtn';
import AppImages from '../../../constants/AppImages';
import { baseColors, colors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
import { BettingTopBar } from '../../../components/betting/topBar'
import WalletDetail from '../../../components/wallet/WalletDetail'
import Blocks from '../../../components/wallet/Blocks'

export default function Wallet({ navigation }) {
    let detailData = [{ title: 'Total Cash', value: '400 Points' }]
    const TabsData = [
        // { title: 'KYC Verification', description: 'Complete KYC to enable Withdrawls', icon: AppImages.kyc, screen: 'Kyc' },
        { title: 'KYC Verification', description: 'Complete KYC to enable Withdrawls', icon: AppImages.kyc, screen: 'KycDetail' },
        { title: 'My Transaction', description: 'View Add/Withdraw History', icon: AppImages.history, screen: 'CashTransaction', },
        { title: 'Payment Settings', description: 'Add or Remove Cards & Accounts', icon: AppImages.wallet },
        { title: 'Customer support', description: "We're Here to Help You", icon: AppImages.support, screen: 'HelpCenter' },
    ]

    const dispatch = useDispatch();
    const setAuth = useSetAuthValue();
    const { cartData, dehliveryAddress } = useSelector(state => state?.tempData);
    const { token, user, wallet } = useSelector(state => state?.userData);
    let walletData = wallet
    const [transactions, setTransactions] = useState([]);
    const [Amount, setAmount] = useState('');
    const [couponCode, setCouponCode] = useState('');


    useEffect(() => {
        dispatch(Get_wallet(user?.id, token))
    }, [user?.id, token]);

    // Cash Transaction API
    const fetchTransactions = async () => {
        try {
            dispatch(setLoader(true));
            const response = await CashTransaction(token);
            console.log('Transaction response:', response?.data);
            const transactionsData = response?.data || [];

            if (Array.isArray(transactionsData)) {
                const formattedTransactions = transactionsData.map(trans => ({
                    id: trans.id || Math.random().toString(),
                    pointType: trans.point_type || '',
                    date: moment(trans?.created_at).format('Do MMM, YYYY'),
                    imageSource: getTransactionImage(trans.point_type),
                    points: `PTs ${trans.points || 0}`
                }));
                setTransactions(formattedTransactions);
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
                _startCheckout(("ORDER_" + JSON.stringify(res?.data?.order_id)), res?.data?.payment_session)
              
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
            CFEnvironment.SANDBOX,
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
        <View style={styles.main} >
            <BettingTopBar title={'My Wallet'} noIcons />
            <ScrollView nestedScrollEnabled={true} style={styles.scrollview} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: wp(5), borderRadius: 8, padding: 10 }} >

                <View style={styles.detailViewOuter} >
                    <WalletDetail title='Total Cash' value={`${walletData?.total_balance.toFixed(1)} Points`} icon={AppImages.rupeeCoin} btnIcon={AppImages.add} />
                    <View style={styles.seperator} />

                    <WalletDetail showButton title='Deposit Cash' value={`₹ ${walletData?.deposit_balance.toFixed(1)}`} icon={AppImages.bank} btnIcon={AppImages.add} btnTitle={'Add Money'} onPress={() => { navigation.navigate('AddMoneyWallet') }} />
                    <View style={styles.seperator} />

                    <WalletDetail showButton title='Winning Cash' value={`₹ ${walletData?.winning_cash.toFixed(1)}`} icon={AppImages.crawn} btnIcon={AppImages.add} btnTitle={'Withdraw'} onPress={() => navigation.navigate('Withdraw') } />
                </View>

                <FlatList
                    data={TabsData}
                    nestedScrollEnabled={true}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => <Blocks detail={item} index={index} verficationStatus={index == 0 ? true : false}
                        onPress={() => {
                            if (item?.screen && item?.screen?.length > 0) {
                                navigation.navigate(item?.screen)
                            }
                        }}
                    />}
                />

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: baseColors.white
    },
    scrollview: {
        flex: 1,
    },
    detailViewOuter: {
        backgroundColor: baseColors.grey_light,
        borderRadius: 8,
        padding: 10,
        paddingBottom: hp(1),
        marginTop: hp(2)
    },
    seperator: {
        height: 1,
        backgroundColor: baseColors.seperatorDark,
        margin: 5
    }
})