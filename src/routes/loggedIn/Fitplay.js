import { hp, wp } from '../../Utils/dimension';
import { pickOfTheDay } from '../../api/Services/services';
import { App } from '../../app';
import CustomBtn from '../../components/CustomBtn';
import { BettingTopBar } from '../../components/betting/topBar';
import AppImages from '../../constants/AppImages';
import { baseColors } from '../../constants/colors';
import AppFonts from '../../constants/fonts';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSelector } from 'react-redux';

const Separator = ({}) => {
  return <View style={{ paddingVertical: hp(1), backgroundColor: baseColors.separatorClr, paddingHorizontal: wp(0.3), borderRadius: 10 }} />;
};

const GamesCard = ({ title, declaration, entryFee, prizePoints, steps, joinedUsers, timeframe, onJoinNow, imageSource }) => {
  return (
    <View style={styles.gamesCard}>
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
          <Text style={styles.entryFeePoint}>{prizePoints}</Text>
        </View>
      </View>
      {/* Image */}
      <View>
        <Image source={imageSource} style={styles.cardImage} resizeMode="contain" />
      </View>

      {/* Prize and Players Info */}
      <View style={styles.prizesRow}>
        <View style={styles.prizeItem}>
          <Text style={styles.prizeHeading}>Pool Prize</Text>
          <Text style={styles.prizeValue}>{steps}</Text>
        </View>
        <Separator />
        <View style={styles.prizeItem}>
          <Text style={styles.prizeHeading}>1st Prize</Text>
          <Text style={styles.firstPrizeValue}>{`₹ ${steps}`}</Text>
        </View>
        <Separator />
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

          paddingHorizontal: wp(1), // Add padding for responsiveness
          paddingVertical: hp(1),
        }}>
        {/* Text Section */}
        <View style={{ flex: 1, paddingRight: wp(0) }}>
          <Text style={styles.spotsLeft}>
            Hurry up!{' '}
            <Text style={styles.spotsLeftCount}>
              {'\n'}
              {timeframe} spots left
            </Text>
          </Text>
        </View>

        {/* Button Section */}
        <View style={{ flex: 2 }}>
          <TouchableOpacity style={styles.joinButton} onPress={onJoinNow}>
            <Text style={styles.joinButtonText}>Join now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const ActiveBetsCards = ({ title, prize, rank, imageSource, onPress }) => {
  return (
    <Pressable style={styles.activeBetsCardContainer} onPress={onPress}>
      {/* Image Section */}
      <Image source={imageSource} style={styles.activeBetImage} resizeMode="cover" />

      {/* Content Section */}
      <View style={styles.activeBetContent}>
        <View style={styles.leftContent}>
          <Text style={styles.activeBetTitle}>{title}</Text>
          <Text style={styles.activeBetPrize}>Prize: {prize}</Text>
        </View>
        <View style={styles.rightContent}>
          <Text style={styles.rankTitle}>Rank</Text>
          <Text style={styles.rankValue}>{rank}</Text>
        </View>
        <View style={styles.lastContainer}>
          <Image style={styles.ForwardArrow} source={AppImages.ArrowFrd} resizeMode="contain" />
        </View>
      </View>

      {/* Chevron Icon */}
    </Pressable>
  );
};
const Fitplay = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector(state => state.userData.token);
  // console.log('Token============>', token)
  useEffect(() => {
    const fetchPickOfTheDayData = async () => {
      setLoading(true);
      try {
        const response = await pickOfTheDay(token);
        console.log('Fetched Data:', response.data);
        setGames(response.data);
      } catch (error) {
        console.error('Error fetching pick of the day data:', error);
        setError(error.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchPickOfTheDayData();
  }, [token]);
  const [games, setGames] = useState([
    {
      id: '1',
      title: 'Mega Pool',
      subtitle: 'The more players, the bigger the prize!',
      entryFee: 'Entry Fee',
      entryFeePoints: '30 points',
      imageSource: AppImages.GameBanner,
      poolPrize: '₹ 50K',
      firstPrize: '₹ 5000',
      playersJoined: 100,
      spotsLeft: 30,
    },
    {
      id: '2',
      title: 'Mega Pool',
      subtitle: 'The more players, the bigger the prize!',
      entryFee: 'Entry Fee',
      entryFeePoints: '30 points',
      imageSource: AppImages.GameBanner,
      poolPrize: '₹ 50K',
      firstPrize: '₹ 5000',
      playersJoined: 100,
      spotsLeft: 30,
    },
    {
      id: '3',
      title: 'Mega Pool',
      subtitle: 'The more players, the bigger the prize!',
      entryFee: 'Entry Fee',
      entryFeePoints: '30 points',
      imageSource: AppImages.GameBanner,
      poolPrize: '₹ 50K',
      firstPrize: '₹ 5000',
      playersJoined: 100,
      spotsLeft: 30,
    },
    {
      id: '4',
      title: 'Mega Pool',
      subtitle: 'The more players, the bigger the prize!',
      entryFee: 'Entry Fee',
      entryFeePoints: '30 points',
      imageSource: AppImages.GameBanner,
      poolPrize: '₹ 50K',
      firstPrize: '₹ 5000',
      playersJoined: 100,
      spotsLeft: 30,
    },
    {
      id: '5',
      title: 'Mega Pool',
      subtitle: 'The more players, the bigger the prize!',
      entryFee: 'Entry Fee',
      entryFeePoints: '30 points',
      imageSource: AppImages.GameBanner,
      poolPrize: '₹ 50K',
      firstPrize: '₹ 5000',
      playersJoined: 100,
      spotsLeft: 30,
    },
  ]);
  const [activeBets, setActiveBets] = useState([
    {
      id: '1',
      title: 'Mega Pool',
      prize: '₹5,000',
      rank: '23/100',
      imageSource: AppImages.GameBanner,
    },
    {
      id: '2',
      title: 'Super Pool',
      prize: '₹10,000',
      rank: '12/50',
      imageSource: AppImages.GameBanner,
    },
    {
      id: '3',
      title: 'Super Pool',
      prize: '₹10,000',
      rank: '12/50',
      imageSource: AppImages.GameBanner,
    },
    {
      id: '4',
      title: 'Super Pool',
      prize: '₹10,000',
      rank: '12/50',
      imageSource: AppImages.GameBanner,
    },
    {
      id: '5',
      title: 'Super Pool',
      prize: '₹10,000',
      rank: '12/50',
      imageSource: AppImages.GameBanner,
    },
    {
      id: '6',
      title: 'Super Pool',
      prize: '₹10,000',
      rank: '12/50',
      imageSource: AppImages.GameBanner,
    },
  ]);

  const handleJoinNow = () => {
    console.log('Join Now Pressed');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BettingTopBar title={'Tychee'} noBackBtn />
      <ScrollView style={styles.fitplayWrapper}>
        {games.length === 0 ? (
          <Text style={styles.noDataText}>No Games Available</Text>
        ) : (
          <FlatList
            data={games}
            renderItem={({ item }) => (
              <GamesCard
                title={item.name || 'No Title'}
                declaration={item.bet_declaration || 'The more players, the bigger the prize!'}
                entryFee={`${item.put_points || 0} Points`}
                prizePoints={`${item.get_points || 0} Points`}
                steps={item.steps || 'N/A'}
                joinedUsers={item.joined_users || 0}
                timeframe={item.timeframe || 'No Timeframe'}
                imageSource={AppImages.GameBanner}
                onJoinNow={() => handleJoinNow(item.bet_id)}
              />
            )}
            keyExtractor={item => item.bet_id}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            contentContainerStyle={{ paddingBottom: hp(2) }}
          />
        )}
        <Text style={styles.Heading}>Active Bets</Text>
        <FlatList
          data={activeBets}
          renderItem={({ item }) => (
            <ActiveBetsCards
              title={item.title}
              prize={item.prize}
              rank={item.rank}
              imageSource={item.imageSource}
              onPress={() => console.log(`Active Bet Pressed: ${item.title}`)}
            />
          )}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          contentContainerStyle={{ paddingBottom: hp(2) }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Fitplay;

const styles = StyleSheet.create({
  fitplayWrapper: {
    flex: 1,
    paddingHorizontal: wp(5),
    backgroundColor: baseColors.white,
  },
  gamesCard: {
    marginTop: hp(2),
    borderRadius: 8,
    paddingVertical: hp(2),
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
    fontSize: RFValue(13),
    fontWeight: '600',
    fontFamily: AppFonts.bold,
    color: baseColors.black,
  },
  subtitle: {
    fontSize: RFValue(11),
    color: baseColors.gray,
    fontWeight: '400',
    fontFamily: AppFonts.medium,
    lineHeight: hp(3),
  },
  entryFee: {
    fontSize: RFValue(10),
    color: baseColors.gray,
    fontWeight: '400',
    fontFamily: AppFonts.regular,
    textAlign: 'right',
  },
  entryFeePoint: {
    fontSize: RFValue(13),
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
    marginBottom: hp(1.5),
  },
  prizesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  prizeItem: {
    alignItems: 'flex-start',
  },
  prizeHeading: {
    fontSize: RFValue(12),
    color: baseColors.gray,
    fontFamily: AppFonts.regular,
    fontWeight: '400',
    lineHeight: hp(2.7),
  },
  prizeValue: {
    fontSize: RFValue(13),
    fontWeight: '800',
    color: baseColors.theme,
    fontFamily: AppFonts.medium,
  },
  firstPrizeValue: {
    fontSize: RFValue(13),
    fontWeight: '800',
    color: baseColors.theme,
    backgroundColor: '#D9E1BD',
    padding: 1.5,
    fontFamily: AppFonts.regular,
  },
  spotsLeft: {
    fontSize: RFValue(12),
    color: 'red',
    fontFamily: AppFonts.regular,
    fontWeight: '400',
    paddingHorizontal: wp(1),
  },
  spotsLeftCount: {
    fontWeight: '600',
    fontSize: RFValue(11),
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
  // Active Banner
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
    padding: hp(2),
    marginBottom: hp(1.5),
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeBetImage: {
    width: wp(22),
    height: hp(8),
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
    fontSize: RFValue(13),
    fontFamily: AppFonts.bold,
    color: baseColors.black,
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
    fontSize: RFValue(13),
    fontFamily: AppFonts.bold,
    color: baseColors.black,
    textAlign: 'left',
  },
  rankValue: {
    fontSize: RFValue(12),
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
  },
});
