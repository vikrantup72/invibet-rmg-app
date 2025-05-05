import { hp } from '../Utils/dimension';
import { baseColors } from '../constants/colors';
import AppFonts from '../constants/fonts';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';

// Define the props for the Block component
interface BlockProps {
  extraStyle?: ViewStyle;
  title: string; // Fixed typo: changed 'titile' to 'title'
  value: number; // Assuming value is a number, adjust as needed
}

const Block: React.FC<BlockProps> = ({ extraStyle, title, value }) => {
  return (
    <View style={[styles.mainBlock, extraStyle]}>
      <Text style={styles.heading}>{title}</Text>
      <Text style={styles.valuefield}>{value}</Text>
    </View>
  );
};

const Gamesview: React.FC = ({wins,lost,total}) => {
  return (
    <View style={styles.main}>
      <Block extraStyle={{ borderRightWidth: 1 }} title={'Total Games'} value={total} />
      <Block extraStyle={{ borderRightWidth: 1 }} title={'Total Win'} value={wins} />
      <Block extraStyle={{}} title={'Total Lost'} value={lost} />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    marginTop: hp(2),
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainBlock: {
    flex: 1,
    borderColor: baseColors.theme,
    alignItems: 'center',
    paddingVertical: 1,
  },
  heading: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: AppFonts.medium,
    color: baseColors.yellowPrimary,
  },
  valuefield: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: AppFonts.medium,
    color: baseColors.themeLight,
    marginTop: hp(0.5),
  },
});

export default Gamesview;
