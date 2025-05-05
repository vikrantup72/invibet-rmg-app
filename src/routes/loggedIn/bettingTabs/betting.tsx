import AppUtils from '../../../Utils/appUtils';
import { hp, wp } from '../../../Utils/dimension';
import { getAll_bets, getMyBets, getVersion, joinBet } from '../../../api/Services/services';
import { useSetAuthValue } from '../../../atoms/auth';
import { useProfileDataValue } from '../../../atoms/profileData';
import { BettingTopBar } from '../../../components/betting/topBar';
import { connectBT, disconnectDevice, enableStepAutoUpdate, getBluetoothStatusOnOff, isDeviceConnected, listenToDeviceScans, selectBleDevice, syncDeviceTime, watchSdkEmitter } from '../../../components/native';
import AppImages from '../../../constants/AppImages';
import { baseColors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import { useAsyncStorage } from '../../../hooks/useAsyncStorage';
import { Get_myBets, setConnection_status, setLoader, setMyBets } from '../../../redux/Reducers/tempData';
import { Get_user_detail, Get_wallet, setAuthRedux, setCurrentAppVersion, setIsConnected, setToken } from '../../../redux/Reducers/userData';
import { LoggedInBettingTabsParamsList } from '../../types';
import { BettingDashboardHeading } from './components';
import { ActivebetSingle, PreviousBetSingle } from './pickOfDaySingle';
import { activeBetsDetailSampleData, previousBetsSampleData } from './sampleData';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { ImageSourcePropType, RefreshControl, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { FlatList, Image, Linking, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Div, ScrollDiv } from 'react-native-magnus';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment-timezone";
import CountDown from 'react-native-countdown-component';
import { Activity } from '../../../components/activity';
import { CalculateWinningPrice } from '../../../constants/CommonFunctions';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import NewVersionModal from '../../../components/modals/NewVersionModal';

function Dashboard(props: { setDetailType: (type: 'pickOfDay') => void }) {
  const { user, token, isSkipped } = useSelector(state => state?.userData);
  const [currentAppVersion, setCurrentAppVersion] = useState(8)
  const { connection_status, myBets } = useSelector(state => state?.tempData);
  const connectionStatusRef = useRef(connection_status);
  const navigation = useNavigation();
  const { getString } = useAsyncStorage();
  const setAuth = useSetAuthValue();
  const [upcoming_bets_list, setUpcoming_bets_list] = useState([]);
  const [bluetoothStatus, setBluetoothStatus] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [deviceConnected, setDeviceConnected] = useState(false);
  const isFocused = useIsFocused();
  const [games, setGames] = useState<GameItem[]>([]);
  const [activeBets, setActiveBets] = useState([]);
  const [floatingGames, setFloatingGames] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [firstBet, setFirstBet] = useState([])
  const [restBets, setRestBets] = useState([])
  const [topActiveBets, setTopActiveBets] = useState([])
  const [versionPopupVis, setversionPopupVis] = useState(false)
  const [versionLatestData, setVersionLatestData] = useState({})


  useEffect(() => {
    if (versionLatestData && versionLatestData.hasOwnProperty('version')) {
      setversionPopupVis((versionLatestData?.version) != currentAppVersion)
    }
  }, [versionLatestData])


  useEffect(() => {
    if (connection_status?.isConnected) {
      setTimeout(() => {
        connectBT().then((i) => {
          // console.log('cnnnectBt====>', i)
        })
      }, 10000);
    }
  }, [connection_status?.isConnected])


  useEffect(() => {
    connectionStatusRef.current = connection_status;
  }, [connection_status]);

  useEffect(() => {
    setInterval(() => {
      CheckConnectionStatus()
    }, 10000);
  }, [])

  useEffect(() => {
    setTimeout(() => {
      GetAllBets()
      dispatch(Get_user_detail());
    }, 500);
  }, [])


  useEffect(() => {
    let x = activeBets.slice(0, 3)
    setTopActiveBets(x)
  }, [activeBets])

  useEffect(() => {
    dispatch(Get_wallet(user?.id, token))
  }, [user, token]);



  // Effect for Settings if Bluetooth off
  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => {
        getBluetoothStatusOnOff()
          .then(status => {
            setBluetoothStatus(status);
            if (!status) {
              setModalVisible(true);
            }
          })
          .catch(console.log);
      }, 300);

      return () => clearInterval(interval);
    }, []),
  );

  const goToBluetoothSettings = async () => {
    if (Platform.OS === 'ios') {
      // await Linking.openURL('App-Prefs:Bluetooth');
    } else {
      await Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS');
    }
  };

  const CheckConnectionStatus = async () => {
    isDeviceConnected()
      .then((i) => {
        dispatch(setConnection_status({ isConnected: i, isConnecting: false }))
        if (!i) {
          connectWatch()
        }
        else {
          connectBT().then((i) => console.log('cnnnectBt====>', i))
        }
      })
      .catch((error) => {
        console.log('error while isDeviceConnected', error);
      });
  }

  const connectWatch = async () => {
    try {
      if (user?.device_id) {
        await selectBleDevice(user?.device_id);
      }

      // Enable step auto update
      // await enableStepAutoUpdate(true)
      // setInterval(async () => {
      //   listenToDeviceScans()
      //   setTimeout(async () => {
      //     if (user?.device_id != null) {
      //       CheckConnectionStatus()
      //       await connectWatch();
      //     }
      //   }, 3000);

      // }, 20000);

    } catch (err) {

      console.log('--****************** Error unable to connect to watch ******************----+', err, connectionStatusRef?.current);
      // listenToDeviceScans()

      // setTimeout(async () => {
      //   if (user?.device_id != null && connectionStatusRef?.current?.connection_status?.isConnected == false) {
      //     console.log('i am here inside ifffffff')
      //     CheckConnectionStatus()
      //     await connectWatch();
      //   }
      // }, 5000);
    }
  };

  useEffect(() => {

    watchSdkEmitter.addListener('connectionStatus', connection => {
      // console.log('connection-=-=', connection);
      // dispatch(setConnection_status(connection));
      if (connection?.isConnected) {
        syncDeviceTime()
      }
    });
    setTimeout(() => {
      enableStepAutoUpdate(true)
      listenToDeviceScans();
      // setTimeout(async () => {
      //   if (user?.device_id != null && connection_status?.isConnected == false) {
      //     await connectWatch(connection_status?.isConnected);
      //   }

      // }, 1000);

    }, 5000);
  }, [user, connection_status]);


  //Get all bets  in single api
  async function GetAllBets() {
    dispatch(setLoader(true));
    try {
      const res = await getAll_bets(user?.id ?? '', token);
      dispatch(setLoader(false));

      if (res?.status == 200) {
        let mega_pool = res?.data?.mega_pool ?? []

        let floation_pool = res?.data?.floating_pool ?? []
        let upcoming_pool = res?.data?.upcoming ?? []
        let active_joined_bets = res?.data?.active_joined_bets ?? []
        let betsfirst = (mega_pool ?? [])?.slice(0, 1)
        setFirstBet(betsfirst)
        let leftbets = (mega_pool ?? [])?.slice(1)

        setRestBets(leftbets)

        setFloatingGames(floation_pool);

        setUpcoming_bets_list(upcoming_pool);

        setActiveBets(active_joined_bets)

      } else {
        setFirstBet([])
        setGames([]);
        setRestBets([])
        setFloatingGames([])
        setUpcoming_bets_list([])
        setActiveBets([])
      }
    } catch (err: any) {
      dispatch(setLoader(false));
      console.log('error while joining bet list', err);
    }
  }

  //Get app version
  async function GetAppVersion() {
    try {
      const res = await getVersion();
      console.log('res version-=-=-', res?.data,)

      if (res?.status == 200) {
        setVersionLatestData(res?.data ?? {})


      } else {
        setVersionLatestData({})
      }
    } catch (err: any) {
      setVersionLatestData({})
      console.log('error while joining bet list', err);
    }
  }



  useEffect(() => {
    GetAllBets()
    GetAppVersion()
    dispatch(Get_myBets())
  }, [])

  //Joing a bet Function & API
  async function JoinBet(bet_id: any) {
    const token = await getString('token');
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
      const res = await joinBet(body, token, user.id);
      dispatch(setLoader(false));
      if (res?.status == 201) {
        AppUtils.showToast(res?.data?.message ?? '')
        GetAllBets()
        dispatch(Get_myBets())
      } else {
        GetAllBets()
        AppUtils.showToast_error(res?.data?.error ?? '');
      }
    } catch (err: any) {
      dispatch(setLoader(false));
      console.log('error while joining bet list', err);
    }
  }

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

  // Seprator for Game UI
  const Separator = ({ }) => {
    return <View style={{ paddingVertical: hp(1), backgroundColor: baseColors.separatorClr, paddingHorizontal: wp(0.3), borderRadius: 10 }} />;
  };

  interface RankedRaceCardProps {
    title: string;
    prize: string;
    members: number;
    imageSource: ImageSourcePropType;
    onJoin: () => void;
    betType: any,
    deduction: any,
    totalAmount: any
  }

  const RankedRaceCard: React.FC<RankedRaceCardProps> = ({ title, prize, members, imageSource, onJoin, betType, deduction, totalAmount }) => {

    return (
      <View style={styles.cardWrapper}>
        {/* Image */}
        <Image source={imageSource} style={styles.cardImages} />

        {/* Content */}
        <View style={styles.cardContent}>
          {/* Title */}
          <Text style={styles.cardTitle}>{title ?? ''}</Text>

          {/* Prize */}
          {
            betType == 'floating_pool' ?
              <Text style={styles.cardPrize}>Prize: ₹{(parseInt(totalAmount - deduction)) ?? ''}</Text>
              : <Text style={styles.cardPrize}>Prize: ₹{(prize) ?? ''}</Text>
          }

          {/* Members */}
          <Text style={styles.cardMembers}>{members ?? 0} members</Text>
        </View>

        {/* Join Button */}
        {/* <TouchableOpacity style={styles.joinButtons} onPress={onJoin}>
          <Text style={styles.joinButtonTexts}>Join</Text>
        </TouchableOpacity> */}
      </View>
    );
  };


  interface ActiveBetsCardsProps {
    title: string;
    prize: string;
    rank: string;
    imageSource: ImageSourcePropType;
    onPress: () => void;
    betType: any
    totalAmount: any
    deduction: any
    joinedUsers: any
  }
  const ActiveBetsCards: React.FC<ActiveBetsCardsProps> = ({ title, prize, rank, imageSource, onPress, betType, totalAmount, deduction, joinedUsers }) => {
    return (
      <Pressable style={styles.activeBetsCardContainer} onPress={onPress}>
        {/* Image Section */}
        <Image source={imageSource} style={styles.activeBetImage} resizeMode="cover" />

        {/* Content Section */}
        <View style={styles.activeBetContent}>
          <View style={styles.leftContent}>
            <Text style={styles.activeBetTitle}>{title}</Text>
            {
              betType == 'floating_pool' ?
                <Text style={styles.activeBetPrize}>Prize: ₹{(parseInt(totalAmount - deduction)) ?? ''}</Text>
                : <Text style={styles.activeBetPrize}>Prize: ₹{(prize) ?? ''}</Text>
            }
            {/* <Text style={styles.activeBetPrize}>Prize: {prize*joinedUsers??0}</Text> */}
          </View>
          <View style={styles.rightContent}>
            <Text style={styles.rankTitle}>Rank</Text>
            <Text style={styles.rankValue}>{rank}</Text>
          </View>
          <View style={styles.lastContainer}>
            <Image style={styles.ForwardArrow} source={AppImages.ArrowFrd} resizeMode="contain" />
          </View>
        </View>
      </Pressable>
    );
  };

  // Games UI
  interface GameItem {
    name: string;
    bet_declaration: string;
    put_points: number;
    get_points: number;
    steps: number | string;
    joined_users: number;
    timeframe: string;
    bet_id: number;
  }

  interface GamesCardProps {
    title: string;
    declaration: string;
    entryFee: string;
    prizePoints: string;
    steps: number | string;
    joinedUsers: number;
    timeframe: string;
    onJoinNow: () => void;
    onPress: () => void;

    imageSource: ImageSourcePropType; // Type for images
    isJoined: any;
    pool_prize: any;
    betType: string;
    betId: number;
    start_date: any;
    spotLeft: any
    deduction: any
    totalAmount: any
  }

  const GamesCard: React.FC<GamesCardProps> = ({
    title,
    declaration,
    entryFee,
    prizePoints,
    pool_prize,
    joinedUsers,
    timeframe,
    onJoinNow,
    imageSource,
    isJoined,
    betType,
    start_date,
    betId,
    spotLeft,
    deduction,
    totalAmount
  }) => {
    const [countdown, setCountdown] = useState('')
    const [statusMessage, setStatusMessage] = useState("");
    const [priceDetail, setPriceDetail] = useState({ totalPrice: 0, deduction: 0, winningAmount: 0 })

    const getCountdownTime = (startDateTimeGMT,) => {
      const nowGMT = moment().tz("GMT");
      const startGMT = moment.tz(startDateTimeGMT, "GMT");
      // console.log("Now (GMT):", nowGMT.format("YYYY-MM-DD HH:mm:ss"));
      // console.log("Start (GMT):", startGMT.format("YYYY-MM-DD HH:mm:ss"));
      // console.log("🔵 Countdown to Start:", startGMT.diff(nowGMT, "seconds"));
      setCountdown(startGMT.diff(nowGMT, "seconds"));

    }

    useEffect(() => {
      if (pool_prize && joinedUsers) {
        const { totalPrice, deduction, winningAmount } = CalculateWinningPrice(pool_prize, joinedUsers);
        setPriceDetail({ totalPrice: totalPrice, deduction: deduction, winningAmount: winningAmount })
      }
    }, [betId])



    useEffect(() => {
      if (start_date) {
        setTimeout(() => {
          getCountdownTime(start_date);
        }, 2000);
      }
    }, [start_date]);




    return (
      <Pressable style={styles.gamesCard} onPress={() => {
        if (isSkipped) {
          HandlePress()
          return
        }
        else if (user.hasOwnProperty('device_id') && user?.device_id != null) {
          navigation.navigate('Betdetails', { betId })
        }
        else {
          HandlePress_connect()
        }
      }}>
        <View style={styles.cardHeader}>
          <View style={{}}>
            <Text style={styles.title}>
              {title}
              {'\n'}
              <Text style={styles.subtitle}>{declaration}</Text>
            </Text>
          </View>

          <View style={{ paddingHorizontal: wp(2.5) }}>
            <Text style={styles.entryFee}>Entry Fee</Text>
            <Text style={styles.entryFeePoint}>{entryFee}</Text>
          </View>
        </View>
        {/* Image */}
        <View>
          <Image source={imageSource} style={styles.cardImage} resizeMode="contain" />
        </View>

        {/* Prize and Players Info */}
        <View style={styles.prizesRow}>
          <View style={styles.prizeItem}>
            {betType == 'floating' && (
              <>
                <Text style={styles.prizeHeading}>Pool Prize</Text>
                <Text
                  style={{
                    fontSize: RFValue(12),
                    fontWeight: '800',
                    color: baseColors.theme,
                    backgroundColor: '#D9E1BD',
                    padding: 1.5,
                    fontFamily: AppFonts.regular,
                  }}>
                  {parseInt(totalAmount - deduction)}
                </Text>
              </>
            )}
            {betType == 'megapool' && (
              <>
                <Text style={styles.prizeHeading}>Pool Prize</Text>
                <Text style={styles.prizeValue}>{pool_prize ?? 0}</Text>
              </>
            )}
          </View>
          <Separator />
          {betType == 'megapool' && (
            <>
              <View style={styles.prizeItem}>
                <Text style={styles.prizeHeading}>1st Prize</Text>
                <Text style={styles.firstPrizeValue}>{parseInt(parseInt(pool_prize ?? 0) / 2) ?? ''}</Text>
              </View>
              <Separator />
            </>
          )}
          <View style={styles.prizeItem}>
            <Text style={styles.prizeHeading}>Players Joined</Text>
            <Text style={styles.prizeValue}>{joinedUsers}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: hp(1.5),
            paddingHorizontal: wp(1),
            paddingVertical: hp(1),
          }}>
          {/* Text Section */}
          <View style={{ flex: 1.5, paddingRight: wp(1.5) }}>
            {/* {betType == 'megapool' && ( */}
            <Text style={styles.spotsLeft}>
              Hurry up!{' '}
              <Text style={styles.spotsLeftCount}>
                {'\n'}
                {spotLeft ?? 0} spots left
              </Text>
            </Text>
            {/* )} */}
            {betType == 'floatinggg' && (
              <>
                <Text style={{ fontWeight: '400', fontSize: RFValue(10), fontFamily: AppFonts.medium }}>
                  Start soon
                  {/* <Text style={{ color: baseColors.theme, fontFamily: AppFonts.semibold }}>
                  {start_date} <Image source={AppImages.alarm} style={{ height: wp(3), width: wp(3) }} />
                </Text> */}

                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                  {(countdown != 0) ?
                    <>
                      <CountDown
                        until={countdown}
                        size={9}
                        showSeparator
                        digitStyle={{ baseColors: baseColors.white }}
                        digitTxtStyle={{ color: baseColors.black }}
                        timeToShow={['D', 'H', 'M',]}
                        timeLabels={{ d: 'D', h: 'H', m: 'M', }}
                        timeLabelStyle={{ color: baseColors.black, }}
                      />
                      <Image source={AppImages.alarm} style={{ height: wp(2.5), width: wp(2.5), marginLeft: 3 }} />
                    </>
                    : <Text style={{
                      fontSize: RFValue(10),
                      color: 'red',
                      fontWeight: '500',
                      fontFamily: AppFonts.medium,
                      marginLeft: 3
                    }} >Bet has started.</Text>}

                </View>
              </>
            )}
          </View>

          {/* Button Section */}
          <View style={{ flex: 2.5 }}>
            <TouchableOpacity style={styles.joinButton} onPress={() => {
              if (isSkipped) {
                HandlePress()
              }
              else if (user.hasOwnProperty('device_id') && user?.device_id != null) {
                onJoinNow()
              }
              else {
                HandlePress_connect()
              }
            }} disabled={isJoined}>
              <Text style={styles.joinButtonText}>Join now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    );
  };


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    GetAllBets()
    GetAppVersion()
    dispatch(Get_user_detail(token));
    dispatch(Get_myBets(user?.id, token))
    setTimeout(() => {
      setRefreshing(false)
    }, 1000);

  }, []);
  // Main UI Render
  return (
    <>

      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Fitplay would like to use Bluetooth for new connections.</Text>
            <Text style={styles.modalDescription}>You can allow new connections in settings.</Text>
            <View style={styles.modalButtons}>
              <Pressable style={styles.settingsButton} onPress={goToBluetoothSettings}>
                <Text style={styles.settingsButtonText}>Settings</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <BettingTopBar title={'Tychee'} noBackBtn />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: wp(5), paddingBottom: hp(10) }} showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        <Activity token={token} deviceAddress={user?.device_id} />

        {/* <ScrollDiv mb={24} px={20} > */}
        {firstBet?.length > 0 && (
          <>

            <BettingDashboardHeading title="New Challenge"
              onPressConnectionText={() => {
                console.log('pressed======')
              }}
            />
            <GamesCard
              deduction={(parseInt(firstBet[0].put_points) * parseInt(firstBet[0].joined_users) * 15) / 100}
              totalAmount={parseInt(firstBet[0].put_points) * parseInt(firstBet[0].joined_users)}
              betId={firstBet[0].bet_id}
              scrollEnabled={false}
              betType="megapool"
              title={firstBet[0].name || 'No Title'}
              declaration={firstBet[0].bet_declaration || 'The more players, the bigger the prize!'}
              // prizePoints={`${firstBet[0].put_points || 0} Points`}
              entryFee={`${firstBet[0].put_points || 0} Points`}
              pool_prize={firstBet[0].pool_prize || 'N/A'}
              joinedUsers={firstBet[0].joined_users || 0}
              timeframe={firstBet[0].timeframe || 'No Timeframe'}
              imageSource={AppImages.GameBanner}
              spotLeft={firstBet?.[0]?.max_users - firstBet?.[0]?.joined_users}
              onJoinNow={() => {
                if (isSkipped) {
                  HandlePress()
                  return
                }
                else if (user && (user?.device_id != null)) {
                  JoinBet(firstBet[0].bet_id)
                }
                else {
                  HandlePress_connect()
                  return
                }
              }}
            />
          </>
        )}
        {/*  */}
        {topActiveBets.length > 0 && !isSkipped && (
          <>
            <BettingDashboardHeading title="Active Bets" />
            {topActiveBets.map((item, index) => (
              <ActiveBetsCards
                betType={item?.bet_type ?? 'mega_pool'}
                joinedUsers={item.joined_users || 0}
                deduction={(parseInt(item?.put_points) * parseInt(item?.joined_users) * 15) / 100}
                totalAmount={parseInt(item?.put_points) * parseInt(item?.joined_users)}
                key={index}
                title={item.name || 'Untitled Bet'}
                prize={`${item.get_points || 0}`}
                rank={`${item.rank ?? '-'}`}
                imageSource={AppImages.GameBanner}

                onPress={() => {
                  if (isSkipped) {
                    HandlePress()
                    return
                  }
                  else if (user && (user?.device_id != null)) {
                    navigation.navigate('Betdetails', {
                      betId: item.bet_id,
                      betTitle: item.name,
                    })
                  }
                  else {
                    HandlePress_connect()
                    return
                  }

                }}
                betId={item.bet_id}

              />
            ))}
          </>
        )}

        {(restBets ?? [])?.length > 0 && (
          <>
            <FlatList
              data={restBets}
              keyExtractor={item => item.bet_id.toString()}
              style={{ marginTop: hp(2) }}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <GamesCard
                  betType="megapool"
                  deduction={(parseInt(item?.put_points) * parseInt(item?.joined_users) * 15) / 100}
                  totalAmount={parseInt(item?.put_points) * parseInt(item?.joined_users)}
                  title={item?.name || 'No Title'}
                  declaration={item?.bet_declaration || 'The more players, the bigger the prize!'}
                  // prizePoints={`${firstBet[0].put_points || 0} Points`}
                  entryFee={`${item?.put_points || 0} Points`}
                  pool_prize={item?.pool_prize || 'N/A'}
                  joinedUsers={item?.joined_users || 0}
                  timeframe={item?.timeframe || 'No Timeframe'}
                  imageSource={AppImages.GameBanner}
                  spotLeft={item?.max_users - item?.joined_users}

                  onJoinNow={() => {
                    if (isSkipped) {
                      HandlePress()
                      return
                    }
                    else if (user && (user?.device_id != null)) {
                      JoinBet(item?.bet_id)
                    }
                    else {
                      HandlePress_connect()
                      return
                    }

                  }}
                  betId={item?.bet_id}
                />
              )}
            />
          </>
        )}

        {floatingGames?.length > 0 && (
          <>
            <FlatList
              data={floatingGames}
              keyExtractor={item => item.bet_id.toString()}
              style={{ marginTop: hp(2) }}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <GamesCard
                  deduction={(parseInt(item?.put_points) * parseInt(item?.joined_users) * 15) / 100}
                  totalAmount={parseInt(item?.put_points) * parseInt(item?.joined_users)}
                  betType="floating"
                  title={item.name || 'No Title'}
                  declaration={item.bet_declaration || ' '}
                  // prizePoints={`${firstBet[0].put_points || 0} Points`}
                  entryFee={`${item.put_points || 0} Points`}
                  pool_prize={`₹${item.pool_prize || 0} + and Counting `}
                  joinedUsers={item.joined_users || 0}
                  // timeframe={firstBet[0].timeframe || 'No Timeframe'}
                  start_date={item.start_date}
                  imageSource={AppImages.GameBanner}
                  // onJoinNow={() => JoinBet(firstBet[0].bet_id)}
                  spotLeft={item?.max_users - item?.joined_users}
                  onJoinNow={() => {
                    if (isSkipped) {
                      HandlePress()
                      return
                    }
                    else if (user && (user?.device_id != null)) {
                      JoinBet(item?.bet_id)
                    }
                    else {
                      HandlePress_connect()
                      return
                    }

                    // JoinBet(item.bet_id)
                  }}
                  betId={item.bet_id}
                />
              )}
            />
          </>
        )}
        <BettingDashboardHeading title="Upcoming Challenges" />
        {upcoming_bets_list && (upcoming_bets_list ?? []).length > 0 ? (
          <FlatList
            data={upcoming_bets_list}
            keyExtractor={item => item.bet_id.toString()}
            renderItem={({ item }) => (
              <RankedRaceCard
                title={item.name}
                betType={item?.bet_type}
                deduction={(parseInt(item?.put_points) * parseInt(item?.joined_users) * 15) / 100}
                totalAmount={parseInt(item?.put_points) * parseInt(item?.joined_users)}
                prize={`${item.get_points || 0}`}
                members={item.joined_users || 0}
                imageSource={AppImages.UCstep}
                onJoin={() => {
                  if (isSkipped) {
                    HandlePress()
                    return
                  }
                  else if (user && (user?.device_id != null)) {
                    JoinBet(item?.bet_id)
                  }
                  else {
                    HandlePress_connect()
                    return
                  }

                  // JoinBet(item.bet_id)
                }}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: wp(1),
            }}
          />
        ) : (
          <Text style={{ textAlign: 'center', fontSize: RFValue(11), color: baseColors.black, fontFamily: AppFonts.bold }}>
            No upcoming pool available.
          </Text>
        )}
        {versionPopupVis && <NewVersionModal
          versionData={versionLatestData}
          onCrossPress={() => { setversionPopupVis(false) }}
          onDownloadPress={() => { Linking.openURL(`https://storage.cloud.google.com/tychee-storage/app_release_${versionLatestData?.version}.apk`) }}
        />}
        {/* </ScrollDiv> */}
      </ScrollView>
    </>
  );
}

function PickOfTheDay(props: { backAction: () => void }) {
  return (
    <>
      <BettingTopBar title="Pick of the Day" subTitle="Lorem Ipsum" noBackBtn={false} backAction={props.backAction} />

      <ScrollDiv mb={24}>
        <Div px={20}>
          <BettingDashboardHeading title="Active Bets" subTitle={false} />
          {activeBetsDetailSampleData.map((data, index) => (
            <ActivebetSingle key={index} {...data} />
          ))}
        </Div>

        <Div px={20}>
          <BettingDashboardHeading title="Previous Bets" subTitle={false} />
          {previousBetsSampleData.map((data, index) => (
            <PreviousBetSingle key={index} {...data} />
          ))}
        </Div>


      </ScrollDiv>
    </>
  );
}

export function BettingDashboard({ navigation }: BottomTabScreenProps<LoggedInBettingTabsParamsList, 'betting/home'>) {
  const [detailType, setDetailType] = useState<'pickOfDay' | null>(null);
  return (
    <Div bg={baseColors.white} h="100%">
      {detailType === 'pickOfDay' ? (
        <PickOfTheDay backAction={() => setDetailType(null)} />
      ) : (
        <Dashboard setDetailType={state => setDetailType(state)} />
      )}
    </Div>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: baseColors.white,
    borderRadius: 28,
    paddingHorizontal: wp(5),
    width: wp(85),
    paddingVertical: hp(2.5),
  },
  modalTitle: {
    fontSize: RFValue(14),
    fontFamily: AppFonts.medium,
    marginBottom: hp(1),
    color: baseColors.black,
    fontWeight: '600',
  },
  modalDescription: {
    fontSize: RFValue(13),
    fontFamily: AppFonts.regular,
    color: baseColors.gray,
    marginBottom: hp(3),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    paddingHorizontal: wp(5),
  },
  closeButtonText: {
    color: baseColors.black,
    fontSize: RFValue(13),
    fontFamily: AppFonts.medium,
  },
  settingsButton: {},
  settingsButtonText: {
    color: baseColors.theme,
    fontSize: RFValue(13),
    fontFamily: AppFonts.medium,
  },
  //
  gamesCard: {
    // marginTop: hp(2),
    marginBottom: hp(1),
    borderRadius: 8,
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    backgroundColor: baseColors.Gamebg,
    shadowColor: baseColors.Gamebg,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  title: {
    fontSize: RFValue(12.5),
    fontWeight: '600',
    fontFamily: AppFonts.bold,
    color: baseColors.black,
    textTransform: 'capitalize'
  },
  subtitle: {
    fontSize: RFValue(10),
    color: baseColors.gray,
    fontWeight: '400',
    fontFamily: AppFonts.medium,
    lineHeight: hp(3),
  },
  entryFee: {
    fontSize: RFValue(9.5),
    color: baseColors.gray,
    fontWeight: '400',
    fontFamily: AppFonts.regular,
    textAlign: 'right',
  },
  entryFeePoint: {
    fontSize: RFValue(11),
    color: baseColors.link,
    fontFamily: AppFonts.bold,
    fontWeight: '500',
    lineHeight: hp(3),
  },
  cardImage: {
    width: '100%',
    height: hp(15),
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: hp(1),
  },
  prizesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: hp(1),
  },
  prizeItem: {
    alignItems: 'flex-start',
  },
  prizeHeading: {
    fontSize: RFValue(11),
    color: baseColors.gray,
    fontFamily: AppFonts.regular,
    fontWeight: '400',
    lineHeight: hp(2.7),
  },
  prizeValue: {
    fontSize: RFValue(12),
    fontWeight: '800',
    color: baseColors.theme,
    fontFamily: AppFonts.medium,
  },
  firstPrizeValue: {
    fontSize: RFValue(12),
    fontWeight: '800',
    color: baseColors.theme,
    backgroundColor: '#D9E1BD',
    padding: 1.5,
    fontFamily: AppFonts.regular,
  },
  spotsLeft: {
    fontSize: RFValue(11),
    color: 'red',
    fontFamily: AppFonts.regular,
    fontWeight: '400',
    paddingHorizontal: wp(0.1),
  },
  spotsLeftCount: {
    fontWeight: '600',
    fontSize: RFValue(10),
    color: baseColors.theme,
    fontFamily: AppFonts.bold,
  },
  joinButton: {
    backgroundColor: baseColors.theme,
    borderRadius: 8,
    paddingHorizontal: wp(1),
    paddingVertical: hp(1.5),
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: RFValue(12),
    color: baseColors.white,
    fontWeight: '600',
    fontFamily: AppFonts.bold,
  },
  //
  Heading: {
    fontSize: RFValue(16),
    color: baseColors.black,
    fontFamily: AppFonts.bold,
    marginBottom: hp(1),
  },
  activeBetsCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF7FC',
    // paddingHorizontal: wp(2),
    // paddingVertical: hp(2),
    marginBottom: hp(1.5),
    padding: hp(1.1),

    borderRadius: 12,
  },
  activeBetImage: {
    width: wp(22),
    height: hp(8),
    maxHeight: 54,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  activeBetContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: wp(4),
  },
  leftContent: {
    paddingVertical: wp(1),
    width: wp(25),
  },
  activeBetTitle: {
    fontSize: RFValue(11),
    fontFamily: AppFonts.bold,
    color: baseColors.black,
    textTransform: 'capitalize'
  },
  activeBetPrize: {
    fontSize: RFValue(12),
    color: baseColors.gray,
    fontFamily: AppFonts.medium,
    marginTop: hp(0.5),
    fontWeight: '600',
  },
  rightContent: {
    paddingVertical: wp(1),
    width: wp(25),
    alignItems: 'center',
  },
  rankTitle: {
    fontSize: RFValue(12),
    fontFamily: AppFonts.bold,
    color: baseColors.black,
    textAlign: 'left',
  },
  rankValue: {
    fontSize: RFValue(11),
    fontWeight: '500',
    fontFamily: AppFonts.bold,
    color: baseColors.gray,
    marginTop: hp(0.5),
  },
  lastContainer: {
    paddingVertical: wp(1),
    width: wp(5),
  },
  ForwardArrow: {
    width: wp(2),
    height: hp(2),
    maxHeight: 12,
    maxWidth: 12
  },
  //
  cardWrapper: {
    backgroundColor: baseColors.UCbg,
    borderRadius: 12,
    // overflow: 'hidden',
    // marginVertical: hp(1),

    margin: wp(1),
    paddingHorizontal: wp(1.5),
    paddingVertical: hp(1),
  },

  cardImages: {
    width: '100%',
    height: hp(11),
    resizeMode: 'contain',
    borderRadius: 12,
  },
  cardContent: {
    paddingHorizontal: wp(1),
    paddingVertical: wp(1),
  },
  cardTitle: {
    fontSize: RFValue(9.5),
    fontWeight: '500',
    fontFamily: AppFonts.bold,
    color: baseColors.purple,
    marginBottom: hp(0.5),
    textTransform: 'capitalize'
  },
  cardPrize: {
    fontSize: RFValue(11),
    fontWeight: '500',
    fontFamily: AppFonts.bold,
    color: baseColors.gray,
  },
  cardMembers: {
    fontSize: RFValue(9),
    fontFamily: AppFonts.medium,
    color: baseColors.gray,
    lineHeight: hp(2),
  },
  joinButtons: {
    backgroundColor: baseColors.theme,
    paddingVertical: hp(1),
    borderRadius: wp(2),
  },
  joinButtonTexts: {
    fontSize: RFValue(12),
    color: baseColors.white,
    fontFamily: AppFonts.bold,
    textAlign: 'center',
  },
});
