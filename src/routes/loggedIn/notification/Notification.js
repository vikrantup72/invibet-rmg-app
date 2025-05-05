import { hp, wp } from '../../../Utils/dimension';
import CommanTextInput from '../../../components/CommanTextInput';
import CustomBtn from '../../../components/CustomBtn';
import { BettingTopBar } from '../../../components/betting/topBar';
import AppImages from '../../../constants/AppImages';
import { baseColors, colors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'react-native-animatable';
import { Div } from 'react-native-magnus';
import { RFValue } from 'react-native-responsive-fontsize';

const TransactionCard = ({ imageSource, time, desc }) => {
  return (
    <View style={styles.NotificationCards}>
      <View style={styles.IconContainer}>
        <Image source={imageSource} style={styles.Icon} />
      </View>
      <View style={styles.Time_descriptionContainer}>
        <Text style={styles.Time}>{time}</Text>
        <Text style={styles.Desc}>
          {desc.split('').map((char, index) => (
            <Text key={index} style={index >= 0 && index <= 12 ? styles.highlight : styles.Desc}>
              {char}
            </Text>
          ))}
        </Text>
      </View>
    </View>
  );
};
const AddMoneyWallet = () => {
  const transactions = [
    {
      id: '1',
      imageSource: AppImages.User_Notification,
      time: '01:05 PM',
      desc: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly',
    },
    {
      id: '2',
      imageSource: AppImages.User_Notification,
      time: '01:05 PM',
      desc: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly',
    },
    {
      id: '4',
      imageSource: AppImages.User_Notification,
      time: '01:05 PM',
      desc: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly',
    },
    {
      id: '5',
      imageSource: AppImages.User_Notification,
      time: '01:05 PM',
      desc: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly',
    },
    {
      id: '6',
      imageSource: AppImages.User_Notification,
      time: '01:05 PM',
      desc: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly',
    },
    {
      id: '7',
      imageSource: AppImages.User_Notification,
      time: '01:05 PM',
      desc: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly',
    },
  ];
  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar title="Notifications" noIcons />
      <View style={styles.NotificationWrapper}>
        <View style={styles.separator} />
        <View style={styles.Head}>
          <Text style={styles.Day}>Today</Text>
          <Text style={styles.Readed}>Mark all as read</Text>
        </View>
        <View style={styles.separator} />
        <FlatList
          data={transactions} // Show all transactions
          renderItem={({ item }) => <TransactionCard imageSource={item.imageSource} time={item.time} desc={item.desc} />}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={<View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Div>
  );
};

export default AddMoneyWallet;

const styles = StyleSheet.create({
  NotificationWrapper: {
    flex: 1,
    paddingTop: hp(3),
    paddingHorizontal: wp(4),
    backgroundColor: baseColors.white,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#E4ECFD',
  },
  Head: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Day: {
    fontWeight: '600',
    fontSize: RFValue(14),
    color: baseColors.theme,
    fontFamily: AppFonts.bold,
  },
  Readed: {
    fontSize: RFValue(12),
    color: baseColors.theme,
    fontFamily: AppFonts.regular,
    fontWeight: '400',
  },
  TransactionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: wp(5),
  },
  TransactionsHead: {
    fontWeight: '600',
    fontSize: RFValue(14.5),
    color: baseColors.theme,
    fontFamily: AppFonts.bold,
  },
  ViewAll: {
    fontSize: RFValue(11),
    color: baseColors.theme,
    fontFamily: AppFonts.bold,
    textDecorationLine: 'underline',
  },
  //   Main Card
  NotificationCards: {
    marginTop: hp(1),
    borderRadius: 5,
    paddingVertical: wp(2.5),
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  IconContainer: {
    height: wp(10),
    width: wp(10),
    borderRadius: 100,
  },
  Icon: {
    resizeMode: 'cover',
    height: wp(10),
    width: wp(10),
    bottom: 1,
  },
  Time_descriptionContainer: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    width: '85%',
  },
  Time: {
    fontWeight: '600',
    fontSize: RFValue(10),
    color: colors.light.primaryLight,
    fontFamily: AppFonts.bold,
  },
  Desc: {
    fontSize: RFValue(11),
    color: baseColors.themeLight,
    fontWeight: '400',
    fontFamily: AppFonts.semibold,
  },
  highlight: {
    color: baseColors.theme,
    fontWeight: '700',
    fontSize: RFValue(12),
  },
});
