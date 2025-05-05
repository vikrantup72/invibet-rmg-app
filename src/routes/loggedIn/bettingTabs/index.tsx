import { baseColors } from '../../../constants/colors';
import { LoggedInBettingTabsParamsList } from '../../types';
import { AddBet } from './addBet';
import { BettingDashboard } from './betting';
import { MyBets } from './myBets';
import { Profile } from './profile';
import { Shop } from './shop';
import { BottomTabNavigationEventMap, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationHelpers, ParamListBase, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { ReactNode } from 'react';
import { Button, ButtonProps, Div, Text } from 'react-native-magnus';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { EditProfile } from './EditProfile';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSetAuthValue } from '../../../atoms/auth';
import { setAuthRedux, setToken } from '../../../redux/Reducers/userData';

// Define the type for the props of SimpleTabButton
type SimpleTabButtonProps = ButtonProps & {
  label?: string;
  isActive: boolean;
  simpleIcon: ReactNode;
  activeIcon: ReactNode;
  navigateTo: keyof LoggedInBettingTabsParamsList;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
};

// SimpleTabButton component definition
function SimpleTabButton({ label, isActive, simpleIcon, activeIcon, navigateTo, navigation, onPress, ...props }: SimpleTabButtonProps) {
  return (
    <Button
      bg="transparent"
      flexDir="column"
      alignItems="center"
      p={2}
      justifyContent="center"
      // onPress={() => navigation.navigate('bettingTabs', { screen: navigateTo })}
      onPress={onPress}
      {...props}
    >
      {isActive ? activeIcon : simpleIcon}
      {label ? (
        <Text mt={2} color={baseColors.theme} fontWeight="300">
          {label}
        </Text>
      ) : null}
    </Button>
  );
}

// BottomTabNavigator initialization
const Tab = createBottomTabNavigator<LoggedInBettingTabsParamsList>();

// BettingBottomTabs function definition
export function BettingBottomTabs() {
  const { isSkipped,user } = useSelector(state => state?.userData);
  const { connection_status, myBets, } = useSelector(state => state?.tempData);

  const dispatch = useDispatch();
  const setAuth = useSetAuthValue();
  const navigation = useNavigation(); // Use navigation hook here directly

  // HandlePress function moved inside the component
  const HandlePress = () => {
    setAuth(prev => ({ ...prev, isAuthenticated: false }));
    dispatch(setToken(''));
    dispatch(setAuthRedux(false));
    // @ts-ignore
    setTimeout(() => {
      navigation.navigate('mobileInput');
    }, 100);
  };

  const HandlePress_connect = () => {
    setAuth(prev => ({ ...prev, isAuthenticated: false }));
    dispatch(setAuthRedux(false));
    // @ts-ignore
    setTimeout(() => {
      navigation.navigate('AddDevice');
    }, 100);
  };

  return (
    <Div bg={baseColors.white} h="100%">
      <Tab.Navigator
        initialRouteName="betting/home"
        sceneContainerStyle={{ backgroundColor: baseColors.white }}
        screenOptions={{ headerShown: false }}
        tabBar={({ navigation, state }) => {
          const currentRoute = state.history.at(-1);
          const routKeyMap = state.routes.reduce<Record<keyof LoggedInBettingTabsParamsList, string>>(
            (acc, currRoute) => ({ ...acc, [currRoute.name]: currRoute.key }),
            {} as Record<keyof LoggedInBettingTabsParamsList, string>
          );

          return (
            <Div
              h={70}
              flexDir="row"
              alignItems="center"
              bg={baseColors.white}
              justifyContent="space-between"
              style={{
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                shadowColor: baseColors.black,
                elevation: 20,
                shadowRadius: 10,
                shadowOffset: { height: 100, width: 0 },
              }}
            >
              {/* <Div flexDir="row" justifyContent="space-around" alignItems="center" w="40%"> */}
              <Div flexDir="row" justifyContent="space-around" alignItems="center" w="50%">
                <SimpleTabButton
                  label="Home"
                  navigation={navigation}
                  navigateTo="betting/home"
                  activeIcon={<Entypo name="home" color={baseColors.theme} size={22} />}
                  simpleIcon={<Feather name="home" color={baseColors.theme} size={22} />}
                  isActive={routKeyMap['betting/home'] === currentRoute?.key}
                  // onPress={() => navigation.navigate('bettingTabs', { screen: navigateTo })}
                  onPress={() => navigation.navigate('bettingTabs', { screen: "betting/home" })}
                />
                <SimpleTabButton
                  label="My Bets"
                  navigation={navigation}
                  navigateTo="betting/myBets"
                  activeIcon={<MaterialCommunityIcons name="hand-coin" color={baseColors.theme} size={24} />}
                  simpleIcon={<MaterialCommunityIcons name="hand-coin-outline" color={baseColors.theme} size={24} />}
                  isActive={routKeyMap['betting/myBets'] === currentRoute?.key}
                  onPress={() => {
                    if (isSkipped) {
                      HandlePress()
                      return
                    }
                    else if ((user && (user?.device_id != null))) {
                      navigation.navigate('bettingTabs', { screen: "betting/myBets" })
                      return
                    }
                    else{
                      HandlePress_connect()
                    }
                  }}
                />
              </Div>

              {/* <Div position="relative">
                <SimpleTabButton
                  h={70}
                  w={70}
                  top={-65}
                  left={-30}
                  rounded={35}
                  position="absolute"
                  bg={baseColors.theme}
                  navigation={navigation}
                  navigateTo="betting/add"
                  isActive={routKeyMap['betting/add'] === currentRoute?.key}
                  activeIcon={<Entypo name="plus" size={32} color={baseColors.white} />}
                  simpleIcon={<Entypo name="plus" size={32} color={baseColors.white} />}
                  style={{
                    elevation: 20,
                    shadowRadius: 10,
                    shadowColor: baseColors.black,
                    shadowOffset: { height: 100, width: 0 },
                  }}
                />
              </Div> */}

              {/* <Div flexDir="row" justifyContent="space-around" alignItems="center" w="40%"> */}
              <Div flexDir="row" justifyContent="space-around" alignItems="center" w="50%">
                <SimpleTabButton
                  label="Shop"
                  navigation={navigation}
                  navigateTo="betting/shop"
                  simpleIcon={<AntDesign name="shoppingcart" color={baseColors.theme} size={24} />}
                  activeIcon={<FontAwesome5 name="shopping-cart" color={baseColors.theme} size={22} />}
                  isActive={routKeyMap['betting/shop'] === currentRoute?.key}
                  onPress={() => {

                    navigation.navigate('bettingTabs', { screen: "betting/shop" })
                  }}
                />
                <SimpleTabButton
                  label="Profile"
                  navigation={navigation}
                  navigateTo="betting/profile"
                  simpleIcon={<FontAwesome5 name="user-circle" color={baseColors.theme} size={22} />}
                  activeIcon={<FontAwesome name="user-circle-o" color={baseColors.theme} size={22} />}
                  isActive={routKeyMap['betting/profile'] === currentRoute?.key}
                  onPress={() => {
                    if (isSkipped) {
                      HandlePress()
                      return
                    }
                    // else if ((user && ((user?.device_id != null) || (user?.device_id != '')))) {
                    //   HandlePress_connect()
                    //   return
                    // }
                    navigation.navigate('bettingTabs', { screen: "betting/profile" })
                  }}
                />
              </Div>
            </Div>
          );
        }}
      >
        <Tab.Screen name="betting/home" component={BettingDashboard} />
        <Tab.Screen name="betting/myBets" component={MyBets} />
        <Tab.Screen name="betting/add" component={AddBet} />
        <Tab.Screen name="betting/shop" component={Shop} />
        <Tab.Screen name="betting/profile" component={Profile} />
      </Tab.Navigator>
    </Div>
  );
}
