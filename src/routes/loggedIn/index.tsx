import { LoggedInStackParamsList } from "../types";
import CreditCard from "./Payments/CreditCard";
import { AddMoney } from "./addMoney";
import { BettingBottomTabs } from "./bettingTabs";
import { AppDevice } from "./bettingTabs/AppDevice";
import { EditProfile } from "./bettingTabs/EditProfile";
import { NeedHelp } from "./bettingTabs/NeedHelpDevice";
import { Setting } from "./bettingTabs/Setting";
import { BetDetail } from "./bettingTabs/betDetailPage";
import { MyBets } from "./bettingTabs/myBets";
import { Shop } from "./bettingTabs/shop";
import { ProductDetail } from "./product/detail";
import { WatchTermsAndConditions } from "./product/tnc";
import { WhatSettingUp } from "./product/whatSettingUp";
import { QuestionFive } from "./questions/questionFive";
import { QuestionFour } from "./questions/questionFour";
import { QuestionOne } from "./questions/questionOne";
import { QuestionSix } from "./questions/questionSix";
import { QuestionThree } from "./questions/questionThree";
import { QuestionTwo } from "./questions/questionTwo";
import { QuestionWhatToDo } from "./questions/questionWhatToDo";
import { AddAddress } from "./shop/AddAddress";
import { Checkout } from "./shop/Checkout";
import { Coupons } from "./shop/Coupons";
import PaymentMethods from "./shop/PaymentMethods";
import { SingleProductDetail } from "./shop/SingleProductDetail";
import AddMoneyWallet from "./wallet/AddMoneyWallet";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import DeviceSetup from "./DeviceSetup";
import Setup from "./Setup";
import CashTransactions from "./wallet/CashTransactions";
import AddDevice from "./AddDevice";
import ConnectingDevice from "./ConnectingDevice";
import TrackJourney from "./TrackJourney";
import Fitplay from "./Fitplay";
import DetailBetting from "./DetailBetting";
import Wallet from "./wallet/Wallet";
import TermsCondition from "../TermsCondition";
import HelpCenter from "../HelpCenter";
import Kyc from "./wallet/Kyc";
import { KycOtp } from "./wallet/KycOtp";
import KycDetail from "./wallet/KycDetail";
import AaddharKyc from "./kyc/AaddharKyc";
import PanKyc from "./kyc/PanKyc";
import AccountVerification from "./kyc/AccountVerification";
import Withdraw from "../../components/wallet/Withdraw";
import ProductDetailWebView from "./bettingTabs/ProductDetailWebView";
import Spike, {
  StatisticsType,
  SpikeConnection,
  StatisticsInterval,
  StatisticsFilter,
  Provider,
} from "react-native-spike-sdk";
import { useEffect, useState } from "react";
import {
  getHealthData,
  getSignatureToken,
  sendLogActivity,
} from "../../api/Services/services";
import { Linking } from "react-native";

const LoggedInStack = createNativeStackNavigator<LoggedInStackParamsList>();
export function LoggedInStackRoutes(): React.JSX.Element {
  const { deviceAddress, auth, token, user } = useSelector(
    (state) => state?.userData
  );
  const getSpikeConnection = async (signature: any) => {
    try {
      const connection = await Spike.createConnectionAPIv3({
        applicationId: 10916,
        signature: signature,
        endUserId: user?.id?.toString(),
      });
      const result = await connection.requestHealthPermissions({
        statisticTypes: [StatisticsType.steps, StatisticsType.distanceTotal],
      });

      const now = new Date();
      const start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1
      );
      const end = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );

      const statistics = await connection.getStatistics({
        ofTypes: [
          StatisticsType.steps,
          StatisticsType.distanceTotal,
          StatisticsType.caloriesBurnedTotal,
        ],
        from: start,
        to: end,
        interval: StatisticsInterval.hour,
        filter: new StatisticsFilter({
          excludeManual: false,
          providers: [Provider.apple, Provider.healthConnect],
        }),
      });
      await sendLogActivity(token, {
        device_id: null,
        data: statistics,
      });
    } catch (error) {
      console.error(error, "error==>");
    }
  };

  const getSignatureData = async () => {
    const result = await getSignatureToken(token);
    if (result?.status === 200) {
      if (result?.data?.signature) {
        getSpikeConnection(result?.data?.signature);
      }
    }
  };

  useEffect(() => {
    if (token) {
      getSignatureData();
    }
  }, []);

  return (
    <LoggedInStack.Navigator
      initialRouteName={"bettingTabs"}
      screenOptions={{ headerShown: false }}
    >
      {/* <LoggedInStack.Navigator initialRouteName={'product/tnc'} screenOptions={{ headerShown: false }}> */}
      <LoggedInStack.Screen name="AddMoneyWallet" component={AddMoneyWallet} />
      <LoggedInStack.Screen name="wallet" component={Wallet} />
      <LoggedInStack.Screen name="Setup" component={Setup} />
      {/* <LoggedInStack.Screen name="product/tnc" component={WatchTermsAndConditions} /> */}
      <LoggedInStack.Screen name="questionOne" component={QuestionOne} />
      <LoggedInStack.Screen
        name="CashTransaction"
        component={CashTransactions}
      />
      <LoggedInStack.Screen name="questionTwo" component={QuestionTwo} />
      <LoggedInStack.Screen name="questionThree" component={QuestionThree} />
      <LoggedInStack.Screen name="questionFour" component={QuestionFour} />
      <LoggedInStack.Screen name="questionFive" component={QuestionFive} />
      <LoggedInStack.Screen name="questionSix" component={QuestionSix} />
      {/* <LoggedInStack.Screen name="MyBets" component={MyBets} /> */}
      <LoggedInStack.Screen
        name="questionWhatToDo"
        component={QuestionWhatToDo}
      />
      <LoggedInStack.Screen
        name="product/whatSettingUp"
        component={WhatSettingUp}
      />
      <LoggedInStack.Screen name="product/detail" component={ProductDetail} />
      <LoggedInStack.Screen name="bettingTabs" component={BettingBottomTabs} />
      <LoggedInStack.Screen name="betDetail" component={BetDetail} />
      <LoggedInStack.Screen name="EditProfile" component={EditProfile} />
      <LoggedInStack.Screen name="AppDevice" component={AppDevice} />
      <LoggedInStack.Screen name="NeedHelp" component={NeedHelp} />
      <LoggedInStack.Screen name="Setting" component={Setting} />
      <LoggedInStack.Screen
        name="SingleProductDetail"
        component={SingleProductDetail}
      />
      <LoggedInStack.Screen name="Checkout" component={Checkout} />
      <LoggedInStack.Screen name="AddAddress" component={AddAddress} />
      <LoggedInStack.Screen name="Coupons" component={Coupons} />
      <LoggedInStack.Screen name="PaymentMethods" component={PaymentMethods} />
      <LoggedInStack.Screen name="CreditCard" component={CreditCard} />
      <LoggedInStack.Screen name="TrackOrder" component={TrackJourney} />
      <LoggedInStack.Screen name="Fitplay" component={Fitplay} />
      <LoggedInStack.Screen name="Betdetails" component={DetailBetting} />
      <LoggedInStack.Screen name="TermsCondition" component={TermsCondition} />
      <LoggedInStack.Screen name="HelpCenter" component={HelpCenter} />
      <LoggedInStack.Screen name="Kyc" component={Kyc} />
      <LoggedInStack.Screen name="KycOtp" component={KycOtp} />
      <LoggedInStack.Screen name="KycDetail" component={KycDetail} />
      <LoggedInStack.Screen name="AaddharKyc" component={AaddharKyc} />
      <LoggedInStack.Screen name="PanKyc" component={PanKyc} />
      <LoggedInStack.Screen
        name="AccountVerification"
        component={AccountVerification}
      />
      <LoggedInStack.Screen name="Withdraw" component={Withdraw} />
      <LoggedInStack.Screen
        name="ProductDetailWebView"
        component={ProductDetailWebView}
      />
      {/* <LoggedInStack.Screen name='DeviceSetup' component={DeviceSetup} /> */}
    </LoggedInStack.Navigator>
  );
}
