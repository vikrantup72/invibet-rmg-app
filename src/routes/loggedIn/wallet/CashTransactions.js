import { hp, wp } from '../../../Utils/dimension';
import { CashTransaction } from '../../../api/Services/services';
import CommanTextInput from '../../../components/CommanTextInput';
import CustomBtn from '../../../components/CustomBtn';
import { BettingTopBar } from '../../../components/betting/topBar';
import AppImages from '../../../constants/AppImages';
import { baseColors, colors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import React, { useState, useEffect } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Div } from 'react-native-magnus';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSelector } from 'react-redux';
import moment from 'moment';

const Rewards = () => {
  <View style={styles.screen}>
    <Text>Rewards</Text>
  </View>;
};
const Earnings = () => {
  <View style={styles.screen}>
    <Text>Earnings</Text>
  </View>;
};
const Recharge = () => {
  <View style={styles.screen}>
    <Text>Recharge</Text>
  </View>;
};
const All = () => {
  <View style={styles.screen}>
    <Text>All</Text>
  </View>;
};
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
          <Text style={styles.BonusDesTxt}>{pointType}</Text>
        </View>
        <View style={styles.PtsContainer}>
          <Text style={styles.PtsTxt}>{points}</Text>
        </View>
      </View>
    </View>
  );
};
const CashTransactions = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector(state => state?.userData?.token);
  const [allTransactions, setAllTransactions] = useState([])
  const [play_money_transactions, setPlay_money_transactions] = useState([])
  const [rechargeTransactions, setRechargeTransactions] = useState([])
  const [winningTransactions, setWinningTransactions] = useState([])
  const [withdrawTransactions, setWithdrawTransactions] = useState([])

  const getTransactionImage = (pointType) => {
    console.log('Point type received:', pointType);
    switch (pointType?.toLowerCase()) {
      case 'reward':
      case 'rewards':
        return AppImages.Reward_Bonus_Badge;
      case 'earning':
      case 'earnings':
        return AppImages.Earning_Badge;
      case 'recharge':
        return AppImages.Recharge_Badge;
      default:
        console.log('Using default icon for type:', pointType);
        return AppImages.transactionIcon;
    }
  };

  const fetchTransactions = async type => {
    try {
      setLoading(true);
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      console.log('Using token for transaction fetch:', token);

      const response = await CashTransaction(token, type);
      // console.log('Transaction API response:', response?.data);
      if (response?.data) {
        // const formattedTransactions = response.data.map(trans => {
        //   console.log('Transaction data:', trans);
        //   const image = getTransactionImage(trans.point_type);
        //   console.log('Selected image:', image);

        //   return {
        //     id: trans.id || Math.random().toString(),
        //     date: moment(trans?.created_at).format('Do MMM, YYYY'),
        //     imageSource: image,
        //     pointType: trans?.point_type || 'Transaction',
        //     points: `PTs ${trans?.points || 0}`
        //   };
        // });
        // setTransactions(formattedTransactions);
        let data = response?.data
        setAllTransactions(data?.all ?? [])
        setPlay_money_transactions(data?.play_money ?? [])
        setRechargeTransactions(data?.recharge ?? [])
        setWinningTransactions(data?.winning ?? [])
        setWithdrawTransactions(data?.withdraw ?? [])

      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      if (error?.response?.status === 403) {
        console.log('Session expired. Please login again.');
        // Handle unauthorized access - maybe logout user
      } else {
        console.log('Failed to fetch transactions');
      }
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const type = activeTab.toLowerCase();
    fetchTransactions(type);
  }, [activeTab]);



  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar title="MyCash Transactions" noIcons />
      <View style={styles.CashTransactionWrapper}>
        <View style={styles.Head}>
          <Text style={styles.Heading}>MyCash Transactions</Text>
        </View>
        <View>
          {activeTab === 'Rewards' && <Rewards />}
          {activeTab === 'Earnings' && <Earnings />}
          {activeTab === 'Recharge' && <Recharge />}
          {activeTab === 'All' && <All />}

          {/* <View style={styles.tabBar}>
            {['All', 'Play money', 'Recharge', 'Winning', 'Withdraw'].map(tab => (
              <View>
                <Pressable key={tab} onPress={() => setActiveTab(tab)} style={styles.tab}>
                  <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                </Pressable>
                <View style={[styles.separator, activeTab === tab && styles.activeSeparator]} />
              </View>
            ))}
          </View> */}

          <FlatList
            data={['All', 'Play money', 'Recharge', 'Winning', 'Withdraw']}
            keyExtractor={(item, index) => index.toString()}
            style={{ width: '100%', marginTop: hp(2), marginBottom: hp(1) }}
            horizontal
            renderItem={({ item, index }) => {
              return (
                <Pressable onPress={() => { setActiveTab(item) }} >
                  <Text style={[styles.tabText, activeTab === item && styles.activeTabText]}>{item}</Text>
                  <View style={[styles.separator, activeTab === item && styles.activeSeparator]} />
                </Pressable>
              )
            }}
          />

        </View>

        {activeTab == 'All' && <FlatList
          data={allTransactions}
          renderItem={({ item }) => (
            <TransactionCard date={item.created_at} imageSource={AppImages.Reward_Bonus_Badge} pointType={item.point_type} points={item.amount} status={item?.status} />
          )}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp(5) }}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.noTransactionsText}>No transactions available yet</Text>
              {/* <Text style={styles.noTransactionsSubText}>
                  {activeTab === 'Rewards'
                    ? 'Your Rewards transactions will appear here'
                    : activeTab === 'All'
                      ? 'Your complete transaction history will appear here'
                      : activeTab === 'Recharge'
                        ? 'Your Recharge transactions will appear here'
                        : 'Your Earnings transaction will appear here'
                  }
                </Text> */}
            </View>
          )}
        />}

        {activeTab == 'Play money' && <FlatList
          data={play_money_transactions}
          renderItem={({ item }) => (
            <TransactionCard date={item.created_at} imageSource={AppImages.Reward_Bonus_Badge} pointType={item.point_type} points={item.amount} status={item?.status} />
          )}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp(5) }}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.noTransactionsText}>No play money transactions available yet</Text>
            </View>
          )}
        />}

        {activeTab == 'Recharge' && <FlatList
          data={rechargeTransactions}
          renderItem={({ item }) => (
            <TransactionCard date={item.created_at} imageSource={AppImages.Reward_Bonus_Badge} pointType={item.point_type} points={item.amount} status={item?.status} />
          )}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp(5) }}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.noTransactionsText}>No recharge transactions available yet</Text>
            </View>
          )}
        />}

        {activeTab == 'Winning' && <FlatList
          data={winningTransactions}
          renderItem={({ item }) => (
            <TransactionCard date={item.created_at} imageSource={AppImages.Reward_Bonus_Badge} pointType={item.point_type} points={item.amount} status={item?.status} />
          )}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp(5) }}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.noTransactionsText}>No winning transactions available yet</Text>
            </View>
          )}
        />}

        {activeTab == 'Withdraw' && <FlatList
          data={withdrawTransactions}
          renderItem={({ item }) => (
            <TransactionCard date={item.created_at} imageSource={AppImages.Reward_Bonus_Badge} pointType={item.point_type} points={item.amount} status={item?.status} />
          )}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp(5) }}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.noTransactionsText}>No withdraw transactions available yet</Text>
            </View>
          )}
        />}

      </View>
    </Div>
  );
};

export default CashTransactions;

const styles = StyleSheet.create({
  CashTransactionWrapper: {
    flex: 1,
    paddingTop: hp(2),
    paddingHorizontal: wp(4),
    backgroundColor: baseColors.white,
  },
  Heading: {
    fontWeight: '700',
    fontSize: RFValue(13.5),
    color: baseColors.theme,
    fontFamily: AppFonts.medium,
  },
  tabBar: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  tab: {
    alignItems: 'center',
    marginRight: 2,

  },
  tabText: {
    fontSize: RFValue(13),
    fontFamily: AppFonts.medium,
    color: colors.light.tab,
    fontWeight: '400',
    marginHorizontal: wp(3)
  },
  activeTabText: {
    fontFamily: AppFonts.bold,
    color: baseColors.tabActive,
  },
  separator: {
    height: 3,
    width: '100%',
    backgroundColor: 'rgba(69,43,80,0.1)',
    marginTop: 5,
  },
  activeSeparator: {
    height: 3,
    backgroundColor: baseColors.tabActive,
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
    textTransform: 'capitalize'
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
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
    alignItems: 'center',
  },
  BonusSubTxt: {
    fontWeight: '400',
    fontSize: RFValue(9),
    color: baseColors.themeLight,
    fontFamily: AppFonts.regular,
    paddingHorizontal: wp(2),
  },
});
