import Setup from '../loggedIn/Setup';
import { LoggedInStackRoutes } from '../loggedIn';
import AddUPI from '../loggedIn/Payments/AddUPI';
import CreditCard from '../loggedIn/Payments/CreditCard';
import Notification from '../loggedIn/notification/Notification';
import { WatchTermsAndConditions } from '../loggedIn/product/tnc';
import AddMoneyWallet from '../loggedIn/wallet/AddMoneyWallet';
import CashTransaction from '../loggedIn/wallet/CashTransactions';
import { LoggedOutStackParamsList } from '../types';
import Questions from './Questions/Question';
import Question from './Questions/Question';
import Questions2 from './Questions/Question2';
import Question3 from './Questions/Question3';
import Question4 from './Questions/Question4';
import Question5 from './Questions/Question5';
import Question6 from './Questions/Question6';
import Splash from './Splash';
import { MobileInput } from './mobileInput';
// import { MobileInputUserRegister } from './mobileInputUserRegister';
import { NameInput } from './nameInput';
import { Otp } from './otp';
import { TermsAndConditions } from './termsAndConditions';
import { Welcome } from './welcome';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeviceSetup from '../loggedIn/DeviceSetup';
import DeviceOverview from '../loggedIn/DeviceOverview';
import TrackJourney from '../loggedIn/TrackJourney';
import { BettingBottomTabs } from '../loggedIn/bettingTabs';
import { MyBets } from '../loggedIn/bettingTabs/myBets';
import { useSelector } from 'react-redux';
import ConnectingDevice from '../loggedIn/ConnectingDevice';
import AddDevice from '../loggedIn/AddDevice';
import { BettingDashboard } from '../loggedIn/bettingTabs/betting';
import TermsCondition from '../TermsCondition';

const LoggedOutStack = createNativeStackNavigator<LoggedOutStackParamsList>();
export function LoggedOutStackRoutes(): React.JSX.Element {

  const { token } = useSelector(state => state?.userData)
  const { auth, user } = useSelector(state => state?.userData);

  return (
    <LoggedOutStack.Navigator
      // initialRouteName={'Question3'}
      initialRouteName={((token?.length > 0) ? ("AddDevice" ) : "Splash")} 
      screenOptions={{ headerShown: false }}>
      {/* //  <LoggedOutStack.Navigator initialRouteName={"mobileInput"} screenOptions={{headerShown:false}}>  */}
      {/*//<LoggedOutStack.Navigator initialRouteName={"wallet"} screenOptions={{headerShown:false}}> */}
      <LoggedOutStack.Screen name="CreditCard" component={CreditCard} />
      <LoggedOutStack.Screen name="UPI" component={AddUPI} />
      <LoggedOutStack.Screen name="Notify" component={Notification} />
      {/* <LoggedOutStack.Screen name="CashTransaction" component={CashTransaction} /> */}
      <LoggedOutStack.Screen name="wallet" component={AddMoneyWallet} />
      <LoggedOutStack.Screen name="Splash" component={Splash} />
      <LoggedOutStack.Screen name="welcome" component={Welcome} />
      <LoggedOutStack.Screen name="mobileInput" component={MobileInput} />
      {/*<LoggedOutStack.Screen name="mobileInputUserRegister" component={MobileInputUserRegister} /> */}
      <LoggedOutStack.Screen name="nameInput" component={NameInput} />
      <LoggedOutStack.Screen name="otp" component={Otp} />
      <LoggedOutStack.Screen name="termsAndConditions" component={TermsAndConditions} />
      <LoggedOutStack.Screen name="c" component={Question} />
      <LoggedOutStack.Screen name="Questions" component={Questions} />
      <LoggedOutStack.Screen name="Questions2" component={Questions2} />
      <LoggedOutStack.Screen name="Question3" component={Question3} />
      <LoggedOutStack.Screen name="Question4" component={Question4} />
      <LoggedOutStack.Screen name="Question5" component={Question5} />
      <LoggedOutStack.Screen name="Question6" component={Question6} />
      <LoggedOutStack.Screen name="product/tnc" component={WatchTermsAndConditions} />
      <LoggedOutStack.Screen name="setup" component={Setup} />
      <LoggedOutStack.Screen name="DeviceSetup" component={DeviceSetup} />
      <LoggedOutStack.Screen name="DeviceOverview" component={DeviceOverview} />
      <LoggedOutStack.Screen name="TrackJourney" component={TrackJourney} />
      <LoggedOutStack.Screen name="bet" component={BettingBottomTabs} />
      <LoggedOutStack.Screen name="mbets" component={MyBets} />
      <LoggedOutStack.Screen name="ConnectingDevice" component={ConnectingDevice} />
      <LoggedOutStack.Screen name="AddDevice" component={AddDevice} />
      <LoggedOutStack.Screen name="Home" component={BettingDashboard} />
      <LoggedOutStack.Screen name="TermsCondition" component={TermsCondition} />

    </LoggedOutStack.Navigator>
  );
}
