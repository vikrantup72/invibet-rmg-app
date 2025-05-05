import { hp, wp } from '../../../Utils/dimension';
import { getMyBets } from '../../../api/Services/services';
import { useSetAuthValue } from '../../../atoms/auth';
import SingleBetComp from '../../../components/SingleBetComp';
import { ActiveBetsCards } from '../../../components/betting/ActiveBetsCards';
import { BettingTopBar } from '../../../components/betting/topBar';
import AppImages from '../../../constants/AppImages';
import { baseColors } from '../../../constants/colors';
import { Get_myBets, setLoader } from '../../../redux/Reducers/tempData';
import { setAuthRedux, setToken } from '../../../redux/Reducers/userData';
import { LoggedInBettingTabsParamsList } from '../../types';
import { PickOfTheDaySingle } from './pickOfDaySingle';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { createRef, useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text } from 'react-native';
import { Div, ScrollDiv } from 'react-native-magnus';
import { useDispatch, useSelector } from 'react-redux';
import CountDown from 'react-native-countdown-component';
import AppFonts from '../../../constants/fonts';
import { RFValue } from 'react-native-responsive-fontsize';
import { constSelector } from 'recoil';
import { ThreeTabs } from '../../../components/ThreeTabs';

export function MyBets({ navigation }: BottomTabScreenProps<LoggedInBettingTabsParamsList, 'betting/myBets'>) {
  const { token, user } = useSelector(state => state?.userData);
  const { myBets } = useSelector(state => state?.tempData);
  const dispatch = useDispatch()
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Active')


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // getMyBets();
    dispatch(Get_myBets())
    setTimeout(() => {
      setRefreshing(false)
    }, 1000);

  }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(Get_myBets())
    }, []),
  );


  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar title="My Bets" noBackBtn />
      {/* <CountDown
        until={500}
        onFinish={() => Alert.alert('finished')}
        onPress={() => Alert.alert('hello')}
        size={8}
        digitStyle={{ baseColors: baseColors.white }}
        timeLabels={{ d: 'Days', h: 'Hours', m: 'Minutes', s: 'Seconds' }}
      /> */}

      {/* <ScrollDiv mb={24} px={20} pt={20}> */}

      <ThreeTabs
        title1='Active'
        title2='Upcoming'
        title3={'Completed'}
        slectedTab={selectedTab}
        onPress={(tab) => {
          console.log(tab)
          setSelectedTab(tab)
        }}
      />
      {/* <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: wp(4), paddingTop: hp(2) }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {(myBets ?? [])?.length > 0 ? myBets?.map((data, index) => (
          <ActiveBetsCards
            key={index}
            title={data.name}
            prize={data.get_points}
            rank={data.rank ?? "-"}
            imageSource={AppImages.GameBanner}
            onPress={() =>
              navigation.navigate('Betdetails', {
                betId: data.bet_id,
                betTitle: data.name,

              })
            }
          />
        ))
          : <Text style={{ textAlign: 'center', fontSize: RFValue(11), color: baseColors.black, fontFamily: AppFonts.bold }}>
            No pool found.
          </Text>
        }



      </ScrollView> */}

      <FlatList
        data={(selectedTab == 'Active') ? myBets?.active_bets : (selectedTab == 'Upcoming') ? myBets?.upcoming_bets : myBets?.completed_bets}
        style={style.flatlistStyle}
        bounces={true}
        contentContainerStyle={{ flexGrow: 1, paddingTop: hp(1), paddingBottom: hp(10), paddingHorizontal: wp(5) }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => {
          return (
            <Text style={{ textAlign: 'center', fontSize: RFValue(11), color: baseColors.black, fontFamily: AppFonts.bold }}>
              No pool found.
            </Text>
          )
        }}
        renderItem={({ item, index }) => <ActiveBetsCards
        betType={item?.bet_type ?? 'mega_pool'}
        joinedUsers={item.joined_users || 0}
        deduction={(parseInt(item?.put_points) * parseInt(item?.joined_users) * 15) / 100}
        totalAmount={parseInt(item?.put_points) * parseInt(item?.joined_users)}
          key={index}
          title={item.name}
          prize={item.get_points}
          rank={item.rank ?? "-"}
          imageSource={AppImages.GameBanner}
          onPress={() =>
            navigation.navigate('Betdetails', { betId: item.bet_id, betTitle: item.name })
          }
        />}
      />

      {/* </ScrollDiv> */}
      {/* <PickOfTheDaySingle key={index} {...data} onPressJoin={() => JoinBet(data?.bet_id)} /> */}
    </Div>
  );
}


const style = StyleSheet.create({
  flatlistStyle: {
    marginTop: hp(2),
    flex: 1,
  }
})