import AppUtils from '../../../Utils/appUtils';
import { hp, wp } from '../../../Utils/dimension';
import { getBet_detail, getRecommended_bet, joinBet, getBet_detail_LeaderBoard } from '../../../api/Services/services';
import { useSetAuthValue } from '../../../atoms/auth';
import CustomBtn from '../../../components/CustomBtn';
import SingleBetComp from '../../../components/SingleBetComp';
import { BettingTopBar } from '../../../components/betting/topBar';
import AppImages from '../../../constants/AppImages';
import { baseColors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import { setLoader } from '../../../redux/Reducers/tempData';
import { setAuthRedux, setToken } from '../../../redux/Reducers/userData';
import { LoggedInStackParamsList } from '../../types';
import { BettingDashboardHeading } from './components';
import { goalMap, PickOfTheDaySingle } from './pickOfDaySingle';
import { BetDetailData } from './sampleData';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import { PropsWithChildren, useEffect, useId, useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Div, ScrollDiv, Text } from 'react-native-magnus';
import { RFValue } from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';

const betDetailSampleData: BetDetailData = {
  colorType: 'walking',
  gameLost: 3245,
  goal: '15000 Cal in 15 days',
  dateFrom: '15th Jan 2023',
  dateTo: '30th Jan 2023',
  moneyWon: 230,
  participating: 3245,
  pointsYouGet: 460,
  pointsYouPay: 230,
  progress: '20k',
  progressOutOf: '100k',
};

function BetDetailLabel(props: PropsWithChildren<{ title: string; subTitle: string }>) {
  return (
    <Div flexDir="row" alignItems="center" justifyContent="space-between">
      {props.children}
      <Div ml={wp(1)}>
        <Text fontWeight="700" fontSize={10}>
          {props.title}
        </Text>
        <Text fontSize={10}>{props.subTitle}</Text>
      </Div>
    </Div>
  );
}

function SmallLabel(props: { name: string; value: string | number }) {
  return (
    <Div flexDir="row" alignItems="center" justifyContent="space-between">
      <Text fontSize={10} mr={4}>
        {props.name}:
      </Text>
      <Text fontSize={10} fontWeight="700">
        {props.value}
      </Text>
    </Div>
  );
}

export function BetDetail({ navigation, route }: NativeStackScreenProps<LoggedInStackParamsList, 'betDetail'>) {
  const { deviceAddress, auth, token, user, deviceActivity, isSkipped } = useSelector(state => state?.userData);
  const setAuth = useSetAuthValue();
  const screenWidth = Dimensions.get('window').width;
  const { betId, betTitle } = route?.params ?? {};
  const dispatch = useDispatch();
  const [betDetails, setBetDetails] = useState({});
  console.log('===',betDetails)
  const [recommended_bet_list, setRecommended_bet_list] = useState([]);
  const [leaderBoardData, setLeaderBoardData] = useState([]);

  async function GetBetDetail() {
    if (!token) {
      setAuth(prev => ({ ...prev, isAuthenticated: false }));
      dispatch(setToken(''));
      dispatch(setAuthRedux(false));
      // @ts-ignore
      navigation.navigate({ key: 'welcome', name: 'welcome' });
      return;
    }
    dispatch(setLoader(true));

    try {
      const res = await getBet_detail(betId, token);
      console.log('bet detail res-=-=-=', res)
      dispatch(setLoader(false));
      if (res?.status == 200) {
        setBetDetails(res?.data);
      } else {
        setBetDetails({});
        console.log('Elser Bet ===>', betDetails);
      }
    } catch (err) {
      dispatch(setLoader(false));
      console.log('error while getting  bet detail', err);
    }
  }
  async function GetRecommended_bets() {
    if (!token) {
      setAuth(prev => ({ ...prev, isAuthenticated: false }));
      dispatch(setToken(''));
      dispatch(setAuthRedux(false));
      // @ts-ignore
      navigation.navigate({ key: 'welcome', name: 'welcome' });
      return;
    }
    dispatch(setLoader(true));

    try {
      const res = await getRecommended_bet(token);
      dispatch(setLoader(false));
      if (res?.status == 200) {
        setRecommended_bet_list(res?.data);
      } else {
        setRecommended_bet_list([]);
      }
    } catch (err) {
      dispatch(setLoader(false));
      console.log('error while getting recommended bet list', err);
    }
  }

  useEffect(() => {
    if (betId) {
      GetBetDetail();
      GetRecommended_bets();
      GetLeaderboard();
    }
  }, []);

  //join a bet
  async function JoinBet(bet_id: any, token: any,) {
    console.log('token ====>     ====>', token)
    if (!token) {
      setAuth(prev => ({ ...prev, isAuthenticated: false }));

      dispatch(setToken(''));
      dispatch(setAuthRedux(false));
      // @ts-ignore
      navigation.navigate({ key: 'welcome', name: 'welcome' });
      return;
    }


    const body = {
      bet_id: bet_id,
    };
    dispatch(setLoader(true));
    try {
      const res = await joinBet(body, token, user?.id ?? '');
      console.log('join res-=-==-==-', res)
      dispatch(setLoader(false));
      if (res?.status == 201) {
        AppUtils.showToast('Successfully joined the bet!');
        GetRecommended_bets();
        GetBetDetail()
      } else {
        AppUtils.showToast_error(res.data.message || 'something went wrong please try again');
      }
    } catch (err: any) {
      dispatch(setLoader(false));
      AppUtils.showToast_error('something went wrong please try again');
      console.log('error while joining bet list', err);
    }
  }
  // getBet_detail_LeaderBoard API Hit's
  async function GetLeaderboard() {
    if (!token) {
      setAuth(prev => ({ ...prev, isAuthenticated: false }));
      dispatch(setToken(''));
      dispatch(setAuthRedux(false));
      // @ts-ignore
      navigation.navigate({ key: 'welcome', name: 'welcome' });
      return;
    }

    dispatch(setLoader(true));

    try {
      const res = await getBet_detail_LeaderBoard(betId, token);
      dispatch(setLoader(false));

      if (res?.status === 200) {
        setLeaderBoardData(res?.data);
        console.log('Leader Board Data Response ====>', leaderBoardData);
      } else {
        setLeaderBoardData([]);
        console.log('Leader Board Data  ===>', leaderBoardData);
      }
    } catch (err) {
      dispatch(setLoader(false));
      console.log('Error while getting leaderboard data', err);
    }
  }

  const Leadboard_Block = ({ title1, title2, title3, title4 }) => {
    return (
      <View style={styles.leadboard_block}>
        <View style={styles.leftBlock}>
          <View style={{ width: '18%', justifyContent: 'center' }}>
            <Text style={styles.sr}>{title1}</Text>
          </View>
          <View style={{ width: '45%', justifyContent: 'center', paddingHorizontal: wp(2) }}>
            <Text style={styles.name}>{title2}</Text>
          </View>

          <View style={{ width: '19%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.sr}>{title3}</Text>
          </View>
          <View style={{ width: '19%', justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: wp(2) }}>
            <Text style={styles.name}>{title4}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar
        noIcons
        noBackBtn={false}
        title={betDetails.name}
        backAction={() => {
          if (navigation.canGoBack()) navigation.goBack();
        }}
      />

      <ScrollDiv pt={20} mb={24} px={20} h={hp(100)}>
        <Div flexDir="row" alignItems="center" w={wp(92)}>
          <Div flexDir="row" alignItems="center">
            {betDetails?.calories > 0 && betDetails?.steps > 0 ? (
              //combined Icon

              <Image source={AppImages.dis_and_steps} style={styles.icon} />

            ) : (
              //individual~icon
              <>
                {betDetails?.calories > 0 && (
                  <Image source={AppImages.calories} style={styles.icon} />
                )}
                {betDetails?.steps > 0 && (
                  <Image source={AppImages.walk} style={styles.icon} />
                )}
              </>
            )}
            <Div ml={6}>
              <Text fontWeight="500" fontSize={16}>
                {betDetails?.bet_declaration ?? ''}
              </Text>
              <Text fontSize={8}>
                Date: {betDetails.start_date} - {betDetails.end_date}
              </Text>
            </Div>
          </Div>
        </Div>

        <Div
          py={2}
          px={2}
          my={16}
          flexDir="row"
          alignItems="center"
          w={screenWidth - 40}
          justifyContent="space-between"
          bg={baseColors.yellowPrimary + '64'}>
          <SmallLabel name="Money Won" value={betDetails.money_won} />
          <SmallLabel name="Participating" value={betDetails.participating} />
          <SmallLabel name="Game Lost" value={betDetails.game_lost} />
        </Div>

        <Div flexDir="row" alignItems="center" justifyContent="space-between" mb={16}>
          <BetDetailLabel title={`PTs ${betDetails?.put_points ?? ''}`} subTitle="You Give">
            <FontAwesome5 name="hand-holding-usd" size={20} color={baseColors.theme} />
          </BetDetailLabel>
          <BetDetailLabel title={`PTs ${betDetails?.get_points ?? ''}`} subTitle="You Get">
            <FontAwesome5 name="hand-holding-usd" size={20} color={baseColors.theme} />
          </BetDetailLabel>
          <BetDetailLabel
            title={`PTs ${betDetails?.pointsYouPay ?? ''}`}
            // subTitle={(() => {
            //   if (betDetails?.timeframe) {
            //     const [startDate, endDate] = betDetails?.timeframe?.split(' to ');
            //     const formattedStartDate = moment(startDate).format('DD MMM, YY');
            //     const formattedEndDate = moment(endDate).format('DD MMM, YY');
            //     return `${formattedStartDate} - ${formattedEndDate}`;
            //   }
            // })()}
            subTitle={betDetails?.timeframe ?? ''}
          >
            <AntDesign name="calendar" size={20} color={baseColors.theme} />
          </BetDetailLabel>
        </Div>

        {!betDetails?.is_joined && (
          <CustomBtn
            onPress={() => {
              JoinBet(betId, token);
            }}
            btnName={'Join'}
            textStyle={{ color: baseColors.white }}
            btnStyle={{ marginVertical: hp(2) }}
          />
        )}

        <View
          style={{ height: 1, width: '100%', borderTopWidth: 2, borderColor: baseColors.borderColor, borderStyle: 'dashed', marginVertical: hp(2) }}
        />

        {!betDetails?.is_joined && (
          <Div mb={hp(1)}>
            <BettingDashboardHeading title="Recommended Challenges" subTitle={false} />
            {/* // <PickOfTheDaySingle
            //   key={index}
            //   {...data}
            //   onPressJoin={() => {
            //     JoinBet(data?.bet_id);
            //   }}
            // /> */}
            {(recommended_bet_list ?? [])?.map((data, index) => (
              <SingleBetComp
                key={index}
                {...data}
                onPressJoin={() => {
                  JoinBet(data?.bet_id);
                }}
              />
            ))}
          </Div>
        )}

        {betDetails?.is_joined && (
          <>
            <Text style={styles.leaderBoard}>Leader Board</Text>
            <View style={[styles.seperatore, { marginTop: hp(1) }]} />
            <Leadboard_Block title1={'Rank'} title2={'Athlete'} title3={'Distance'} title4={'Winnings'} />

            <View style={styles.seperatore} />

            {(leaderBoardData ?? [])?.map((item, index) => {
              return <Leadboard_Block title1={item?.rank} title2={item?.name} title3={item?.final_steps} title4={item?.is_winner} />;
            })}
          </>
        )}
      </ScrollDiv>
    </Div>
  );
}

const styles = StyleSheet.create({
  leadboard_block: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(1.5),
    width: wp(94),
    paddingHorizontal: wp(5),
  },
  leftBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'yeelow',
    width: '100%',
  },
  sr: {
    fontSize: RFValue(9),
    fontWeight: '400',
    fontFamily: AppFonts.medium,
    color: baseColors.theme,
  },
  name: {
    fontSize: RFValue(9),
    fontWeight: '400',
    fontFamily: AppFonts.medium,
    color: baseColors.theme,
    textTransform: 'capitalize',
  },
  seperatore: {
    height: 1,
    width: '100%',
    backgroundColor: baseColors.borderColor,
  },
  leaderBoard: {
    fontFamily: AppFonts.bold,
    fontSize: RFValue(14),
    fontWeight: '700',
    color: baseColors.theme,
  },
  icon: {
    height: wp(10),
    width: wp(10),
    resizeMode: "contain"
  },
});
