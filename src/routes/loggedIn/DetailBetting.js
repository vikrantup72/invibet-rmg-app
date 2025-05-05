import { hp, wp } from '../../Utils/dimension';
import { buyBooster, getAllBoosters, getBet_detail, getBet_detail_LeaderBoard, getHealth, joinBet } from '../../api/Services/services';
import CustomBtn from '../../components/CustomBtn';
import SingleRankBlock from '../../components/betting/SingleRankBlock';
import AppImages from '../../constants/AppImages';
import { baseColors } from '../../constants/colors';
import AppFonts from '../../constants/fonts';
import { useNavigation, useRoute } from '@react-navigation/native';
// import moment from 'moment';
import moment from "moment-timezone";
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Linking, Pressable, ImageBackground, RefreshControl, FlatList, TouchableOpacity } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';
import CountDown from 'react-native-countdown-component';
import { setAuthRedux, setToken } from '../../redux/Reducers/userData';
import { useSetAuthValue } from '../../atoms/auth';
import AppUtils from '../../Utils/appUtils';
import { setLoader } from '../../redux/Reducers/tempData';
import FastImage from 'react-native-fast-image';
import { setupListeners } from '@reduxjs/toolkit/query';
import { CalculateWinningPrice } from '../../constants/CommonFunctions';

const Separator = ({ }) => {
  return <View style={{ paddingVertical: hp(1), backgroundColor: baseColors.separatorClr, paddingHorizontal: wp(0.2) }} />;
};

const formatTimeLeft = (endDate) => {
  const now = moment();
  const end = moment(endDate);
  const duration = moment.duration(end.diff(now));
  if (duration.asMilliseconds() <= 0) {
    return ' Bet has ended.';
  }
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return ` Ends in: ${formattedHours}h ${formattedMinutes}m`;
};

const ActivityProgress = ({ step = 5, targetSteps = 10000, calories = 250, countdown, statusMessage, leaderboardSteps, statusMessageBooster, countdownBooster }) => {
  const navigation = useNavigation()
  const route = useRoute();
  const { betId } = route.params || {};
  const [laoad, setLoad] = useState();
  const [steps, setSteps] = useState([])
  const { token } = useSelector(state => state?.userData);


  const [fillValue, setFillValue] = useState(0);

  useEffect(() => {
    if (steps?.steps !== undefined && targetSteps !== undefined) {
      const newFill = Math.round((steps.steps / targetSteps) * 100);
      setFillValue(newFill);
    }
  }, [steps, targetSteps]);


  return (
    <View style={styles.ActivityProgresscontainer}>

      <AnimatedCircularProgress
        size={70}
        width={5}
        fill={100}
        tintColor="#FFA500"
        backgroundColor=" rgba(255, 149, 0, 0.3))"
        rotation={0}
        lineCap="round">
        {fill => (
          <View
            style={{
              height: 75,
              width: 75,
              borderRadius: 50,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFF4E5',
            }}>
            <Image
              source={AppImages.footprint}
              style={{ height: 28, width: 28 }}
              resizeMode="contain"
            />
          </View>
        )}
      </AnimatedCircularProgress>

      {/* Text Information */}
      <Image source={AppImages.steps} resizeMode="contain" />
      <View style={styles.textContainer}>
        {/* Steps Walked */}
        <Text style={styles.label}>Steps Walked</Text>
        <Text style={styles.value}>
          {(statusMessage == 'Starts in' || statusMessage == '') ? '-' : statusMessage == 'Ends in' ?
            (((statusMessageBooster == 'Ends in') && (countdownBooster > 0)) ? `${step}/10000` : step)
            : leaderboardSteps}
          {/* <Text style={styles.target}>{`${targetSteps.toLocaleString()} steps`}</Text> */}
        </Text>
      </View>
    </View>
  );
};

const BetDetail = ({ targetSteps = 10000, calories = 250 }) => {

  const route = useRoute();
  const { betId } = route.params || {};
  const navigation = useNavigation();
  const [betDetails, setBetDetails] = useState(null);
  console.log('betDetails-=-=-', betDetails)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user, wallet } = useSelector(state => state?.userData);
  const { connection_status, myBets } = useSelector(state => state?.tempData);
  const [leaderboard, setLeaderboard] = useState([]);
  const [countdown, setCountdown] = useState(0)
  const [statusMessage, setStatusMessage] = useState("");
  const [countdownBooster, setCountdownBooster] = useState('')
  const [statusMessageBooster, setStatusMessageBooster] = useState('')
  const [refreshing, setRefreshing] = useState(false);
  const [setps_cureent_day, setSetps_cureent_day] = useState('0')
  const [all_boosters, setAll_boosters] = useState([])
  const [timeLeftToEndbooster, setTimeLeftToEndbooster] = useState(0)
  const [userLeaderboardSteps, setUserLeaderboardSteps] = useState(0)
  const [setpRefreshing, setSetpRefreshing] = useState(false)
  const [priceDetail, setPriceDetail] = useState({ totalPrice: 0, deduction: 0, winningAmount: 0 })


  useEffect(() => {
    if (betDetails) {
      const { totalPrice, deduction, winningAmount } = CalculateWinningPrice(parseInt(betDetails?.put_points), parseInt(betDetails?.participating))
      setPriceDetail({ totalPrice: totalPrice, deduction: deduction, winningAmount: winningAmount })
    }
  }, [betDetails])




  useEffect(() => {
    if (leaderboard?.length > 0) {
      let UserLeaderboardData = leaderboard?.filter((item) => item?.user_id == user?.id)
      setUserLeaderboardSteps(UserLeaderboardData?.[0]?.final_steps)

    } else {
      setUserLeaderboardSteps(0)
    }
  }, [leaderboard])



  const onRefresh = useCallback(() => {
    setRefreshing(true);
    GetAllBoosters()
    fetchBetDetails();
    GetHealthData()
    fetchLeaderboard()
    setTimeout(() => {
      setRefreshing(false)
    }, 1000);

  }, []);

  const setAuth = useSetAuthValue();
  const dispatch = useDispatch()
  // Bet Data
  const data = {
    prizeDistribution: [
      { rank: 'Rank 1', percentage: '50%', reward: '₹5,000' },
      { rank: 'Rank 2', percentage: '20%', reward: '₹2,000' },
      { rank: 'Rank 3', percentage: '10%', reward: '₹1,000' },
      { rank: 'Rank 4-50', percentage: '20%', reward: '₹2,000' },
    ],
    about: [
      {
        title: '🏅 Winning Criteria:',
        description: 'Points are based on your steps and activity during the week. Use boosters strategically to climb the leaderboard.',
        icon: '',
      },
      {
        title: '💰 Entry & Cashback Usage:',
        description: 'Use your cashback to enter the Mega Pool. Turn your steps and efforts into exciting rewards.',
        icon: '',
      },
      {
        title: '🚀 Boost Your Points:',
        description: 'Get a 2x Points Booster to maximize your chances. Buy 1 booster per week.',
        icon: '',
      },
      {
        title: '📝 Key Notes:',
        description: 'Weekly reset, make every step count! Cashback entry is non-refundable.',
        icon: '',
      },
    ],
    joinPoints: 49,
  };

  const fetchBetDetails = async () => {
    try {
      dispatch(setLoader(true))
      setLoading(true);

      // if (!token) {
      //   console.log('No token found in Redux');
      //   setError('Authentication error. Please log in again.');
      //   return;
      // }

      if (!betId) {
        console.log('No bet ID found');
        setError('Invalid Bet ID');
        return;
      }

      // Fetch the bet details
      const response = await getBet_detail(betId, token);
      dispatch(setLoader(false))
      if (response.status === 200 && response.data) {
        setBetDetails(response.data);
        // getSecondsUntilBoosterEnds()
      } else {
        console.log('Failed to fetch bet details bet detail==', response);
        setError('Failed to fetch bet detailssss');
      }
    } catch (err) {
      dispatch(setLoader(false))
      console.error('Error fetching bet detailsss:', err);
      setError('Something went wrong');
    } finally {
      dispatch(setLoader(false))
      setLoading(false);
    }
  };

  const GetHealthData = async () => {
    console.log('i am here')
    try {
      if (!token) {
        console.log('No token found in Redux');
        return;
      }
      setSetpRefreshing(true)
      let current_date = moment().format('YYYY-MM-DD')
      setSetpRefreshing(false)
      const response = await getHealth(user?.id, current_date, token);
      // console.log('GetHealthData response==-=', response)
      if (response.status === 200) {
        setSetps_cureent_day(response?.data?.health_data?.steps)
      } else {
        console.log('Failed to fetch bet details');
      }
    } catch (err) {
      setSetpRefreshing(false)
      console.error('Error fetching health data:', err);
    } finally {
      setSetpRefreshing(false)
    }
  };

  const GetAllBoosters = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    try {
      const response = await getAllBoosters(token);
      // console.log('get all booster response==', response)
      if (response.status === 200) {
        setAll_boosters(response?.data)
      } else {
        console.log('Failed to fetch all booster');
      }
    } catch (err) {
      console.error('Error fetching all booster', err);
    }
  };

  const BuyBooster = async (booster_id) => {
    try {
      const body = {
        user_id: user?.id,
        bet_id: betId,
        booster_id: booster_id
      }
      const response = await buyBooster(body, token);
      if (response.status === 201) {
        AppUtils.showToast(response?.data?.message ?? '')
        fetchBetDetails()
      } else {
        AppUtils.showToast(response?.data?.error ?? '')
        console.log('Failed to fetch buy booster');
      }
    } catch (err) {
      console.error('Error fetching buy booster', err);
    }
  };

  const fetchLeaderboard = async () => {
    if (!betId) {
      return;
    }

    try {
      const response = await getBet_detail_LeaderBoard(betId, token);
      // console.log('leader borader ====', JSON.stringify(response))
      if (response.status === 200 && response.data?.leaderboard) {
        setLeaderboard(response.data.leaderboard);
      } else {
        console.log('Failed to fetch leaderboard data');
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Something went wrong while fetching leaderboard');
    }
  };

  useEffect(() => {
    fetchBetDetails();
    GetHealthData()
    GetAllBoosters()
    fetchLeaderboard();
  }, [betId, token]);

  useEffect(() => {
    getSecondsUntilBoosterEnds()
  }, [betDetails])



  //   const getCountdownTime = (startDateTimeGMT, endDateTimeGMT) => {
  //     const nowUTC = moment().utc(); // Get current time in UTC
  //     const startUTC = moment(startDateTimeGMT).utc(); // Convert start time to UTC
  //     const endUTC = moment(endDateTimeGMT).utc(); // Convert end time to UTC
  //     console.log('===========',nowUTC,startUTC,endUTC)

  //     if (nowUTC.isBefore(startUTC)) {
  //       console.log("🔵 Countdown to Start:", startUTC.diff(nowUTC, "seconds"));
  //       setStatusMessage("Starts in");
  //       setCountdown(startUTC.diff(nowUTC, "seconds"));
  //     }
  //     else if (nowUTC.isSameOrBefore(endUTC)) {
  //       console.log("🟢 Countdown to End:", endUTC.diff(nowUTC, "seconds"));
  //       setStatusMessage("Ends in");
  //       setCountdown(endUTC.diff(nowUTC, "seconds"));
  //     }
  //     else {
  //       console.log("🔴 Bet has ended. Returning 0.");
  //       setStatusMessage("Bet has ended");
  //       setCountdown(0);
  //     }
  // };

  // ********************** according to gmt ************************
  const getCountdownTime = (startDateTimeGMT, endDateTimeGMT) => {
    // Get current time in GMT (same as UTC)
    const nowGMT = moment().tz("GMT");

    // Convert start and end times to GMT
    const startGMT = moment.tz(startDateTimeGMT, "GMT");
    const endGMT = moment.tz(endDateTimeGMT, "GMT");

    console.log("Now (GMT):", nowGMT.format("YYYY-MM-DD HH:mm:ss"));
    console.log("Start (GMT):", startGMT.format("YYYY-MM-DD HH:mm:ss"));
    console.log("End (GMT):", endGMT.format("YYYY-MM-DD HH:mm:ss"));

    if (nowGMT.isBefore(startGMT)) {
      setStatusMessage("Starts in");
      setCountdown(startGMT.diff(nowGMT, "seconds"));
    }
    else if (nowGMT.isSameOrBefore(endGMT)) {
      console.log("🟢 Countdown to End:", endGMT.diff(nowGMT, "seconds"));
      setStatusMessage("Ends in");
      setCountdown(endGMT.diff(nowGMT, "seconds"));
    }
    else {
      console.log("🔴 Bet has ended. Returning 0.");
      setStatusMessage("Pool has ended");
      setCountdown(0);
    }
  };

  // countdown booster
  const getCountdownTimeBooster = (startDateTimeGMT, endDateTimeGMT) => {
    const nowGMT = moment().tz("GMT");

    const startGMT = moment.tz(startDateTimeGMT, "GMT");
    const endGMT = moment.tz(endDateTimeGMT, "GMT");

    console.log("Now (GMT):", nowGMT.format("YYYY-MM-DD HH:mm:ss"));
    console.log("Start (GMT):", startGMT.format("YYYY-MM-DD HH:mm:ss"));
    console.log("End (GMT):", endGMT.format("YYYY-MM-DD HH:mm:ss"));

    if (nowGMT.isBefore(startGMT)) {
      setStatusMessageBooster("Starts in");
      setCountdownBooster(startGMT.diff(nowGMT, "seconds"));
    }
    else if (nowGMT.isSameOrBefore(endGMT)) {
      console.log("🟢 Booster to End:", endGMT.diff(nowGMT, "seconds"));
      setStatusMessageBooster("Ends in");
      setCountdownBooster(endGMT.diff(nowGMT, "seconds"));
    }
    else {
      console.log("🔴 Booster has ended. Returning 0.");
      setStatusMessageBooster("Booster has ended");
      setCountdownBooster(0);
    }
  };

  const getSecondsUntilBoosterEnds = () => {
    const nowGMT = moment.utc();

    const endGMT = moment.utc(betDetails?.booster_expiry);

    const secondsLeft = endGMT.diff(nowGMT, "seconds");

    setTimeLeftToEndbooster(secondsLeft > 0 ? secondsLeft : 0)
  }





  //for booster countdown
  useEffect(() => {
    if (betDetails?.start_date && betDetails?.end_date) {
      setTimeout(() => {
        getCountdownTime(betDetails.start_date, betDetails.end_date);
      }, 2000);
    }
  }, [betDetails?.start_date, betDetails?.end_date]);

  //for booster countdown
  useEffect(() => {
    if (betDetails?.booster_start && betDetails?.booster_expiry) {
      setTimeout(() => {
        getCountdownTimeBooster(betDetails.booster_start, betDetails.booster_expiry);
      }, 2000);
    }
  }, [betDetails?.booster_start, betDetails?.booster_expiry]);

  const HandlePress_connect = () => {
    setAuth(prev => ({ ...prev, isAuthenticated: false }));
    dispatch(setAuthRedux(false));
    // @ts-ignore
    setTimeout(() => {
      navigation.navigate('AddDevice');
    }, 100);
  };

  const onPressTerms = () => {
    navigation.navigate('TermsCondition')
  }

  //join a bet
  async function JoinBet(bet_id,) {
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
      dispatch(setLoader(false));
      if (res?.status == 201) {
        AppUtils.showToast('Successfully joined the bet!');
        // GetRecommended_bets();
        fetchBetDetails()
      } else {
        AppUtils.showToast_error(res.data.message || 'something went wrong please try again');
      }
    } catch (err) {
      dispatch(setLoader(false));
      AppUtils.showToast_error('something went wrong please try again');
      console.log('error while joining bet list', err);
    }
  }

  const isBoosterExpired = (expiryDate) => {
    return moment.utc().isSameOrAfter(moment.utc(expiryDate));
  };


  return (
    <View style={{ flex: 1, backgroundColor: baseColors.white }} >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <ImageBackground source={AppImages.GameBanner} style={styles.headerImage} >
            <Pressable
              style={{ position: 'absolute', left: wp(5), top: hp(1) }}
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                source={AppImages.newBack}
                style={{
                  backgroundColor: 'white',
                  padding: wp(1),
                  borderRadius: 6,
                  width: wp(7),
                  height: wp(7),
                }}
                resizeMode="contain"
              />
            </Pressable>
            {betDetails?.is_joined && (
              <View style={{ alignSelf: 'flex-end', backgroundColor: 'background: rgba(43, 186, 79, 0.8)', borderRadius: 30, paddingHorizontal: wp(4), paddingVertical: 7, marginBottom: hp(1), marginRight: wp(5) }}>
                <Text style={{ fontFamily: AppFonts.medium, color: '#FFFFFF', fontSize: RFValue(11.5), paddingHorizontal: wp(1), textAlign: 'center' }}>
                  Joined
                </Text>
              </View>
            )}
          </ImageBackground>
        </View>
        <ScrollView scrollEnabled={false} style={{ paddingHorizontal: wp(5) }}>

          {/* ********************* countdown code *************************/}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: hp(2) }} >

            <View style={{ flexDirection: 'row', alignItems: 'center' }} >
              <Image source={AppImages.alarm} style={{ height: wp(3), width: wp(3), marginRight: 3 }} />
              <Text style={styles.titleCountdown} >{statusMessage ?? ''} : </Text>
            </View>

            <View style={{ marginTop: 1 }} >
              {(countdown > 0) && <CountDown
                // until={getCountdownTime(betDetails?.start_date,betDetails?.end_date)}
                until={countdown}
                // onFinish={() => Alert.alert('finished')}
                // onPress={() => Alert.alert('hello')}
                size={9}
                showSeparator
                digitStyle={{ baseColors: baseColors.white }}
                digitTxtStyle={{ color: baseColors.black }}
                // timeLabels={{ d: 'Days', h: 'Hr', m: 'Min', s: 'Sec' }}
                timeLabels={{ d: 'D', h: 'H', m: 'M', s: 'S' }}
                timeLabelStyle={{ color: baseColors.black, }}
              />}
            </View>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <View style={styles.leftTitle}>
              {/* <Text style={styles.timeLeft}>
              <Image source={AppImages.alarm} style={{ height: wp(3), width: wp(3) }} /> {formatTimeLeft(betDetails?.end_date)}
            </Text> */}


              <Text style={styles.title}>{betDetails?.name}</Text>
            </View>
            <Text style={styles.members}>{betDetails?.participating} members</Text>
          </View>
          <View style={{ height: 1, width: '100%', backgroundColor: baseColors.separatorClr, marginBottom: hp(1) }}></View>
          {/* Stats Section */}
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Steps</Text>
              <Text style={styles.statValue}>{(statusMessage == 'Starts in' || statusMessage == '') ? '-' : statusMessage == 'Ends in' ? setps_cureent_day : userLeaderboardSteps}</Text>
            </View>
            <Separator />

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Pool Prize</Text>
              {((betDetails?.bet_type == "mega_pool") || (betDetails?.bet_type == "private_pool")) ?
                <Text style={styles.statValue}>{`₹ ${parseInt(betDetails?.pool_prize) ?? ''}`}</Text>
                : <Text style={styles.statValue}>{`₹ ${priceDetail?.winningAmount ?? ''}`}</Text>
              }
            </View>
            <Separator />

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>1st Prize</Text>
              <Text
                style={
                  (styles.statValue,
                  {
                    backgroundColor: '#E6F6B2',
                    fontSize: RFValue(12),
                    fontWeight: '700',
                    fontFamily: AppFonts.medium,
                    color: baseColors.theme,
                    marginTop: hp(0.5),
                  })
                }>{((betDetails?.bet_type == 'mega_pool') || (betDetails?.bet_type == "private_pool")) ? (parseInt(betDetails?.pool_prize) / 2 ?? 0) : (parseInt(priceDetail?.winningAmount) ?? 0)}</Text>
            </View>
          </View>

          <View style={{ height: 1, width: '100%', backgroundColor: baseColors.separatorClr, marginBottom: hp(1) }}></View>


          {/* Prize Distribution */}
          {betDetails?.is_joined && <View style={{}}>
            <Text style={styles.sectionTitle}>
              Activity Progress
            </Text>

            <View style={styles.bottomActivity} >
              <View style={{ width: '70%' }} >
                <View style={{ marginTop: (`${targetSteps}` - `${betDetails?.steps}` != 0) ? hp(1) : 0 }} >
                  {statusMessage != '' && <ActivityProgress step={setps_cureent_day ?? ''} countdown={countdown} statusMessage={statusMessage} leaderboardSteps={userLeaderboardSteps} statusMessageBooster={statusMessageBooster} countdownBooster={countdownBooster} />}
                </View>
              </View>
              <TouchableOpacity onPress={() => {
                fetchBetDetails();
                GetHealthData()
                GetAllBoosters()
                fetchLeaderboard();
              }} style={styles.stepRefreshBtn} >
                {!setpRefreshing ? <Text style={styles.refresh} >Refresh</Text>
                  : <FastImage source={AppImages.loader} resizeMode='contain' style={styles.loader} />}
              </TouchableOpacity>
            </View>

          </View>}



          {/* ******************* Activated booster start******************* */}
          {betDetails?.is_joined && <>
            {(betDetails?.booster_id != null && !isBoosterExpired(betDetails?.booster_expiry)) && timeLeftToEndbooster > 0 && <View style={styles.activeBoosterMain} >
              <FastImage source={AppImages.checkGreen} resizeMode='contain' style={styles.checkGreen} />
              <Text style={styles.boosterActivated} >Booster Activated</Text>
              <View style={{ marginTop: 1, flexDirection: 'row' }} >
                <Text style={[styles.boosterActivated, { color: 'red', fontFamily: AppFonts.semibold }]} > {statusMessageBooster} : </Text>
                {(countdownBooster > 0) && <CountDown
                  until={countdownBooster}
                  size={9}
                  showSeparator
                  digitStyle={{ baseColors: baseColors.white }}
                  digitTxtStyle={{ color: baseColors.black }}
                  timeLabels={{ d: 'D', h: 'H', m: 'M', s: 'S' }}
                  timeLabelStyle={{ color: baseColors.black, }}
                />}
              </View>
            </View>}

            {(betDetails?.booster_id != null && isBoosterExpired(betDetails?.booster_expiry)) && timeLeftToEndbooster <= 0 && <View style={styles.activeBoosterMain} >
              <Text style={styles.boosterActivated} >⏳ Booster Used! New One Available Next Week</Text>
            </View>}
          </>}
          {/* ******************* Activated booster end******************* */}



          {/* ********************* Booster code start ************************* */}
          {betDetails?.is_joined && <>
            {(betDetails?.booster_id == null && all_boosters?.length > 0) && <View style={styles.boosterMain}>
              <FlatList
                data={all_boosters}
                renderItem={({ item, index }) => {
                  return (
                    <View style={{ marginTop: index == 0 ? 0 : hp(2.5) }} >
                      {/* <Text style={styles.boosterTitle}>Boost Your Challenge – {item?.name??''} 🚀 </Text> */}
                      <Text style={styles.boosterTitle}>{item?.name ?? ''} 🚀 </Text>
                      <Text style={styles.boosterdesc}>{item?.description ?? ''} </Text>
                      <Text style={[styles.bottsterDesc, { fontFamily: AppFonts.extraBold }]} >Note : <Text style={{ fontFamily: AppFonts.medium }} >2x steps will be counted if you complete 10k steps in 24hr.</Text></Text>

                      <View style={styles.btnOuter}>
                        <CustomBtn
                          onPress={() => {
                            if ((user && user.hasOwnProperty('device_id') && ((user?.device_id == null)))) {
                              HandlePress_connect()
                              return
                            }
                            // if (parseInt(item?.price) > parseInt(wallet?.total_balance)) {
                            //   AppUtils.showToast_error('Not enough balance')
                            //   setTimeout(() => {
                            //     navigation.navigate('AddMoneyWallet')
                            //   }, 500);
                            //   return
                            // }
                            BuyBooster(item?.booster_id)
                          }}
                          btnName={`Unlock Boost for ${item?.price ?? ''}`}
                          textStyle={{ color: baseColors.white }}
                          btnStyle={{ marginTop: hp(1), maxHeight: 40 }}
                        />
                      </View>
                    </View>
                  )
                }}

              />

            </View>}
          </>}
          {/* ********************* Booster code end ************************* */}



          {/* ****************** Prize distribution ************************ */}
          {!betDetails?.is_joined && betDetails?.bet_type == 'mega_pool' && <>
            <Text style={styles.sectionTitle}>Prize Distribution</Text>

            <SingleRankBlock
              title1={'Rank'}
              title2={'%Share'}
              title3={'Reward'}
              commonTextStyle={{ color: baseColors.purple, fontWeight: '600', fontFamily: AppFonts.bold, fontSize: RFValue(10.2) }}
            />
            <View style={styles.seperator} />
            {data.prizeDistribution.map((item, index) => (
              <SingleRankBlock
                title1={item.rank ?? ''}
                title2={item.percentage ?? ''}
                title3={item.reward ?? ''}
                mainExtraStyle={[
                  index == 0 && styles.prizeRowAlternate,
                  index % 3 === 1 && styles.prizeRowAlternate2,
                  index % 3 === 2 && styles.prizeRowAlternate3,
                  index % 3 === 0 && index !== 0 && styles.prizeRowAlternate4,
                ]}
              />
            ))}
          </>}

          {/* ****************** Prize distribution  end************************ */}

          {betDetails?.is_joined && <View style={styles.prizeTable}>
            {/* ****************** Leaderboard ************************ */}

            <>
              <View>
                <Text style={styles.sectionTitle}>Leaderboard</Text>
                <SingleRankBlock
                  title1={'Rank'}
                  title2={'Username'}
                  title3={'Steps'}
                  commonTextStyle={{ color: baseColors.purple, fontWeight: '600', fontFamily: AppFonts.bold, fontSize: RFValue(10.2) }}
                />
                {leaderboard?.map((item, index) => {
                  const specialStyle = (item?.user_id == (user?.id))
                    ? styles.prizeRowAlternate4
                    :
                    index === 0
                      ? styles.leaderB1
                      : index === 1
                        ? styles.leaderB2
                        : index === 2
                          ? styles.leaderB3
                          : ((index > 2 && (index - 3) % 2 === 0) && (item?.user_id != (user?.id)))
                            ? styles.leaderB4
                            : null;

                  let titleMegaPool = ((item?.rank == 1) ? `🥇${item.rank}` : (item?.rank == 2) ? `🥈${item.rank}` : (item?.rank == 3) ? `🥉${item.rank}` : `    ${item.rank}`)
                  let titleFloatingPool = ((item?.rank == 1) ? `🥇${item.rank}` : `    ${item.rank}`)
                  return (
                    <SingleRankBlock
                      item={item}
                      key={item.user_id}
                      title1={betDetails?.bet_type == 'mega_pool' ? titleMegaPool : titleFloatingPool}
                      title2={(item?.user_id == (user?.id)) ? "You" : (item?.name ?? 'User')}
                      title3={item.final_steps}
                      mainExtraStyle={[specialStyle]}
                    />
                  );

                })}
              </View>
            </>
          </View>}

          {/* About Section */}

          {!betDetails?.is_joined && (
            <>
              <Text style={styles.sectionTitle}>About {data.title}</Text>
              <View style={styles.aboutSection}>
                {data.about.map((item, index) => (
                  <View key={index} style={styles.aboutItem}>
                    <View style={styles.aboutContent}>
                      <Text style={styles.aboutTitle}>{item.title}</Text>
                      <Text style={styles.aboutDescription}>{item.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Join Button */}
          {/* <TouchableOpacity style={styles.joinButton} onPress={() => console.log('Join Challenge')}>
          <Text style={styles.joinButtonText}>Join for {data.joinPoints} Points</Text>
          </TouchableOpacity> */}
        </ScrollView>
      </ScrollView>
      {!betDetails?.is_joined && (
        <>
          <Text style={styles.TandC}>
            By participating , I accept the
            <Text
              style={{ color: baseColors.black, fontWeight: '700', fontFamily: AppFonts.bold, textDecorationLine: 'underline' }}
              onPress={() => onPressTerms()}>
              {' '}
              Rules{' '}
            </Text>
            &
            <Text
              style={{ color: baseColors.black, fontWeight: '700', fontFamily: AppFonts.bold, textDecorationLine: 'underline' }}
              onPress={() => onPressTerms()}>
              {' '}
              Terms & Conditions
            </Text>
          </Text>
        </>
      )}

      {!betDetails?.is_joined ? (
        <CustomBtn
          btnName={`Join for ${betDetails?.put_points} Points`}
          textStyle={{ color: baseColors.white, fontFamily: AppFonts.bold, fontWeight: '600' }}
          btnStyle={{
            backgroundColor: baseColors.theme,
            borderColor: baseColors.theme,
            borderWidth: 1,
            width: wp(90),
            marginBottom: hp(1.1),
          }}
          onPress={() => {
            if ((user && user.hasOwnProperty('device_id') && (user?.device_id != null))) {
              JoinBet(betId)
            }
            else {
              HandlePress_connect()
            }
          }}
        />

      ) : (
        <CustomBtn
          btnName={`View game details and rules`}
          textStyle={{
            color: baseColors.theme,
            fontFamily: AppFonts.bold,
            fontWeight: '600',
          }}
          btnStyle={{
            backgroundColor: baseColors.white,
            borderColor: baseColors.theme,
            borderWidth: 1,
            width: wp(90),
            marginBottom: hp(1.1),
          }}
          onPress={() => {
            onPressTerms()
            return
            Linking.openURL('https://tychee.in/terms-and-condition')
          }}
        />
      )}
    </View>
  );
};

export default BetDetail;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: baseColors.white,
    // paddingHorizontal: wp(5),
  },
  header: {
    // flexDirection: 'row',
    // paddingHorizontal: wp(5),
    alignItems: 'center',
    marginBottom: hp(2),
  },
  headerImage: {
    width: '100%',
    height: hp(22),
    justifyContent: 'flex-end'
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  leftTitle: {
    width: wp(65),
  },
  timeLeft: {
    fontSize: RFValue(9.5),
    color: baseColors.red,
    fontFamily: AppFonts.bold,
    fontWeight: '600',
    marginBottom: hp(0.5),
  },
  title: {
    fontSize: RFValue(13),
    color: baseColors.black,
    fontFamily: AppFonts.semibold,
    marginBottom: hp(0.5),
    textTransform: 'capitalize'
  },
  members: {
    fontSize: RFValue(11),
    color: baseColors.black,
    fontFamily: AppFonts.medium,
    fontWeight: '500',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  statItem: {},
  statValue: {
    fontSize: RFValue(12),
    fontWeight: '700',
    fontFamily: AppFonts.medium,
    color: baseColors.theme,
    marginTop: hp(0.5),
  },
  statLabel: {
    fontSize: RFValue(10),
    color: baseColors.gray,
    fontFamily: AppFonts.semibold,
    fontWeight: '400',
  },
  sectionTitle: {
    fontSize: RFValue(13.5),
    fontWeight: '600',
    fontFamily: AppFonts.bold,
    color: baseColors.black,
    marginTop: hp(2.5),
  },
  prizeTable: {
    marginBottom: hp(2),
  },
  prizeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp(1),
    // paddingHorizontal: wp(2.5),
  },
  prizeHeaderText: {
    fontSize: RFValue(11),
    fontWeight: '500',
    color: baseColors.purple,
    fontFamily: AppFonts.semibold,
    flex: 1,
    // borderWidth: 1,
    // textAlign:'center'
  },
  prizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp(1),
    paddingHorizontal: wp(2.5),
    // textAlign: 'center',
  },
  specialColor: {
    backgroundColor: baseColors.UCbg,
  },
  prizeRowAlternate: {
    backgroundColor: baseColors.white,
  },
  leaderB1: {
    backgroundColor: baseColors.fGold,
  },
  leaderB2: {
    backgroundColor: baseColors.seGold,
  },
  leaderB3: {
    backgroundColor: baseColors.thGold,
  },
  leaderB4: {
    backgroundColor: baseColors.UCbg,
  },
  prizeRowAlternate2: {
    backgroundColor: baseColors.rnk2,
  },
  prizeRowAlternate3: {
    backgroundColor: baseColors.rnk3,
  },
  prizeRowAlternate4: {
    backgroundColor: baseColors.rnkL,
  },
  prizeText: {
    fontSize: RFValue(11),
    // textAlign: 'justify',
    color: baseColors.black,
    flex: 1, // Ensures text aligns properly across columns
    // marginLeft: 50,
    fontFamily: AppFonts.regular,
  },

  aboutSection: {
    marginBottom: hp(2),
    padding: hp(1),
    borderColor: baseColors.btm_prd_border,
    borderWidth: 1,
    borderRadius: 8,
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp(1.5),
  },
  aboutIcon: {
    fontSize: RFValue(12),
    marginRight: wp(1.5),
  },
  aboutContent: {
    flex: 1,
  },
  aboutTitle: {
    fontSize: RFValue(11.5),
    fontWeight: '500',
    color: baseColors.black,
    marginBottom: hp(0.5),
    fontFamily: AppFonts.bold,
  },
  aboutDescription: {
    fontSize: RFValue(10.5),
    color: baseColors.gray,
    fontFamily: AppFonts.medium,
    fontWeight: '600',
    paddingHorizontal: wp(2.5),
    lineHeight: hp(2.5),
  },
  joinButton: {
    backgroundColor: baseColors.theme,
    paddingVertical: hp(1.5),
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: RFValue(14),
    fontWeight: '700',
    color: baseColors.white,
  },
  TandC: {
    fontSize: RFValue(9.9),
    fontWeight: '600',
    fontFamily: AppFonts.medium,
    color: baseColors.gray,
    textAlign: 'center',
    paddingVertical: hp(1),
  },
  ActivityProgresscontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(1),
  },
  progressText: {
    color: baseColors.black,
    fontSize: RFValue(14),
  },
  textContainer: {
    flex: 1,
    marginLeft: wp(6),
  },
  label: {
    fontSize: RFValue(11),
    color: baseColors.gray,
    fontWeight: '400',
    fontFamily: AppFonts.regular,
  },
  value: {
    fontSize: RFValue(12.5),
    fontWeight: '500',
    color: baseColors.black,
  },
  target: {
    color: baseColors.gray,
    fontFamily: AppFonts.regular,
    fontSize: RFValue(12.5),
  },
  separator: {
    height: hp(0.1),
    backgroundColor: baseColors.separatorClr,
    marginVertical: hp(0.5),
  },
  caloriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(0.51),
  },
  fireIcon: {
    width: wp(4),
    height: wp(4),
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  boosterMain: {
    paddingVertical: hp(2.1),
    backgroundColor: baseColors.boosterBg,
    paddingHorizontal: wp(3),

    borderRadius: 4,
    marginTop: hp(3),
    marginBottom: hp(1)
  },
  boosterTitle: {
    fontFamily: AppFonts.semibold,
    color: baseColors.black,
    fontWeight: '600',
    fontSize: RFValue(13.5),
  },
  boosterdesc: {
    fontFamily: AppFonts.medium,
    color: baseColors.black,
    fontWeight: '400',
    fontSize: RFValue(11.5),
  },
  bottsterDesc: {
    fontFamily: AppFonts.medium,
    color: baseColors.black,
    fontWeight: '400',
    fontSize: RFValue(11.5),
    marginTop: hp(1)
  },
  btnOuter: {
    width: '100%',
  },
  seperator: {
    backgroundColor: baseColors.rnk2,
    height: 1,
  },
  titleCountdown: {
    fontSize: RFValue(10),
    color: 'red',
    fontWeight: '500',
    fontFamily: AppFonts.medium,
    marginLeft: 3
  },
  activeBoosterMain: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: wp(2),
    marginTop: hp(2),
    backgroundColor: baseColors.grey_booster,
    borderRadius: 4
  },
  checkGreen: {
    height: wp(4.5),
    width: wp(4.5),
    maxHeight: 17,
    maxWidth: 17
  },
  boosterActivated: {
    fontSize: RFValue(10.4),
    color: baseColors.black,
    fontWeight: '600',
    fontFamily: AppFonts.medium,
    marginLeft: wp(1.5)
  },
  stepRefreshBtn: {
    backgroundColor: baseColors.theme,
    height: 35,
    width: wp(20),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomActivity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  refresh: {
    fontFamily: AppFonts.semibold,
    fontSize: RFValue(11),
    alignSelf: "center",
    color: baseColors.white,
    fontWeight: "700",
    textAlign: "center",
  },
  loader: {
    height: wp(12),
    width: wp(12)
  }
});
