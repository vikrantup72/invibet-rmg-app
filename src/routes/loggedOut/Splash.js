import { NavigationContainer } from '@react-navigation/native';
import { hp, wp } from '../../Utils/dimension';
import CustomBtn from '../../components/CustomBtn';
import AppImages from '../../constants/AppImages';
import { baseColors } from '../../constants/colors';
import React, { useRef, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { Animated } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import AppFonts from '../../constants/fonts';
import { AppConstant } from '../../constants/AppConstants';

export default function Splash({navigation}) {
  const flatRef = useRef(null);
  let data = [
    { image: AppImages?.logo, title: 'Lorem Ipsum', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' },
    { image: AppImages?.splash2, title: 'Lorem Ipsum', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  return (
    <View style={styles.main}>
      <View style={{ height: hp(32) }}>
        <FlatList
          ref={flatRef}
          nestedScrollEnabled={true}
          data={data}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return <Image source={item?.image} style={styles.img} />;
          }}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        />
      </View>

      <View style={styles.pagination}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: currentIndex == index ? baseColors.white : baseColors.white, opacity: currentIndex === index ? 1 : 0.3 },
            ]}
          />
        ))}
      </View>

      <Text style={styles.title} >Tychee - Game of Effort</Text>
      <Text style={styles.desc} >The game where your dedication, strategy, and sheer effort can win you not just glory, but cold, hard cash.</Text>

      <CustomBtn
        onPress={() => {
            if(currentIndex==0){
                let index=1
                flatRef.current?.scrollToIndex({ animated: true, index })
            }
            else{
                navigation.navigate('mobileInput')
            }
        }}
        btnName={'Next'}
        textStyle={{ color: baseColors.white }}
        btnStyle={{ marginTop: hp(6), borderColor: baseColors.themeLight, borderWidth: 1,width:'98%' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: baseColors.theme,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(4),
  },
  img: {
    height: hp(30),
    width: wp(92),
    resizeMode: 'contain',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(2),
  },
  dot: {
    height: 9,
    width: 9,
    borderRadius: 5,
    backgroundColor: baseColors.white,
    marginHorizontal: 5,
  },
  title:{
    fontSize:RFValue(13),
    fontWeight:'600',
    fontFamily:AppFonts.bold,
    color:baseColors.white,
    marginTop:hp(2.5)
  },
  desc:{
    fontSize:RFValue(10),
    fontWeight:'400',
    fontFamily:AppFonts.bold,
    color:baseColors.white,
    marginTop:hp(0.3),
    textAlign:'center'
  },
});
