import { hp, wp } from '../../../../Utils/dimension';
import { useProfileDataState } from '../../../../atoms/profileData';
import { baseColors } from '../../../../constants/colors';
import AppFonts from '../../../../constants/fonts';
import React, { RefObject, useLayoutEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View,FlatList, NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Div, Text } from 'react-native-magnus';

const singleItemWidth = 44;
const ageOneToHundred = Array.from({ length: 100 }).map((_, idx) => idx);

export default Question222= ()=>{
  const flatListRef: RefObject<FlatList<any>> | null = useRef(null);
  const [profile, setProfile] = useProfileDataState();

  const onScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newValue = Math.floor((event.nativeEvent.contentOffset.x + 4 * singleItemWidth) / singleItemWidth);
    setProfile(prev => ({ ...prev, age: newValue }));
  };

  useLayoutEffect(() => {
    if (!flatListRef.current) return;
    flatListRef.current.scrollToOffset({
      animated: true,
      offset: profile.age * singleItemWidth,
    });
  }, []);


  return (
    <View style={styles.main}>
 <View style={styles.viewText} > 
        {/* <FlatList
          horizontal={true}
          scrollEnabled
          ref={flatListRef}
          style={{ flex: 1,backgroundColor:'blue' }}
          data={ageOneToHundred}
          onScroll={onScrollEndDrag}
          legacyImplementation={false}
          onScrollEndDrag={onScrollEndDrag}
          keyboardShouldPersistTaps="always"
          onMomentumScrollEnd={onScrollEndDrag}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.toString()}
          onMomentumScrollBegin={onScrollEndDrag}
          getItemLayout={(_, index) => ({
            index: index,
            length: singleItemWidth,
            offset: index * singleItemWidth,
          })}
          renderItem={data => (
            <View style={{width:singleItemWidth,alignSelf:'center',flexDirection:'row',backgroundColor:'green'}}  >
              <Text style={{fontWeight:'400',fontFamily:AppFonts.bold,fontSize:22,color:baseColors.white}}>
                {data.item}
              </Text>
            </View>
          )}
        /> */}

{/* <FlatList 
  horizontal={false}  // Ensure the horizontal prop is set correctly
  data={ageOneToHundred}
  keyExtractor={item => item.toString()}  // Add keyExtractor to avoid warnings
  renderItem={data => (
    <View style={{width: singleItemWidth, alignItems: 'center'}}  >
      <Text style={{fontWeight: '400', fontFamily: AppFonts.bold, fontSize: 22, color: baseColors.white}}>
        {data.item}
      </Text>
    </View>
  )}
  showsHorizontalScrollIndicator={false}  // Optionally hide the scroll indicator
/> */}

<ScrollView>

{
  ageOneToHundred?.map((item,index)=>{
    return(
      <View style={{width: singleItemWidth, alignItems: 'center'}}  >
      <Text style={{fontWeight: '400', fontFamily: AppFonts.bold, fontSize: 22, color: baseColors.white}}>
    sdfsdfsd
      </Text>
    </View>
    )
  })
}
</ScrollView>

        {/* <Div
          rounded={31}
          h={62}
          w={62}
          bg={baseColors.yellowPrimary + 58}
          position="absolute"
          alignItems="center"
          justifyContent="center"
          alignSelf="center"
          mt={-10}>
          <Div
            rounded={27}
            h={54}
            w={54}
            bg={baseColors.yellowPrimary}
            borderColor={baseColors.yellowPrimary + 70}
            borderWidth={5}
            alignItems="center"
            justifyContent="center">
            <Text color={baseColors.white} fontWeight="500" fontSize={18}>
              {profile.age}
            </Text>
          </Div>
        </Div> */}
       
</View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginTop: hp(3),
  },
  viewText:{
    width:wp(90),
    marginTop:hp(2),
    backgroundColor:'red',
    height:44,
    borderRadius:8,
  }
});
