import React from 'react';
import { Pressable, View, Text, Image, StyleSheet } from 'react-native';
import { ImageSourcePropType } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { hp, wp } from '../../Utils/dimension';
import AppFonts from '../../constants/fonts';
import { baseColors } from '../../constants/colors';
import AppImages from '../../constants/AppImages';

interface ActiveBetsCardsProps {
  title: string;
  prize: string;
  rank: string;
  imageSource: ImageSourcePropType;
  onPress: () => void;
  betType: any,
  joinedUsers: any,
  deduction: any,
  totalAmount: any
}

export const ActiveBetsCards: React.FC<ActiveBetsCardsProps> = ({ title, prize, rank, imageSource, onPress, betType, joinedUsers, deduction, totalAmount }) => {
  return (
    <Pressable style={styles.activeBetsCardContainer} onPress={onPress}>
      {/* Image Section */}
      <Image source={imageSource} style={styles.activeBetImage} resizeMode="cover" />

      {/* Content Section */}
      <View style={styles.activeBetContent}>
        <View style={styles.leftContent}>
          <Text style={styles.activeBetTitle}>{title ?? ''}</Text>
          {/* <Text style={styles.activeBetPrize}>Prize: {prize ?? ''}</Text> */}
          {
            betType == 'floating_pool' ?
              <Text style={styles.activeBetPrize}>Prize: ₹{(parseInt(totalAmount - deduction)) ?? ''}</Text>
              : <Text style={styles.activeBetPrize}>Prize: ₹{(prize ) ?? ''}</Text>
          }
        </View>
        <View style={styles.rightContent}>
          <Text style={styles.rankTitle}>Rank</Text>
          <Text style={styles.rankValue}>{rank ?? ''}</Text>
        </View>
        <View style={styles.lastContainer}>
          <Image style={styles.ForwardArrow} source={AppImages.ArrowFrd} resizeMode="contain" />
        </View>
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  activeBetsCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF7FC',
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
    fontSize: RFValue(12),
    fontFamily: AppFonts.bold,
    color: baseColors.black,
    textTransform: 'capitalize'
  },
  activeBetPrize: {
    fontSize: RFValue(11),
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
});
