import { useNavigation } from '@react-navigation/native';
import { hp, wp } from '../../Utils/dimension';
import AppImages from '../../constants/AppImages';
import { baseColors } from '../../constants/colors';
import AppFonts from '../../constants/fonts';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export default function SingleProduct(props) {
  const navigation=useNavigation()
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('SingleProductDetail', { productId: props?.item?.id });
      }}
      style={styles.main}>
      <Image source={AppImages.product} style={styles.img} />
      <View style={styles.bottomView}>
        <Text style={styles.productName}>{props?.item?.name ?? ''}</Text>
        <Text style={styles.productPrice}>{props?.item?.price ?? ''}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  main: {
    width: '47%',
    // paddingVertical: hp(2),
    backgroundColor: baseColors.white,
    borderRadius: 10,
    // overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,

    elevation: 5,
    marginTop: hp(2.5),
  },
  img: {
    width: '100%',
    height: hp(16),
    resizeMode: 'cover',
    borderRadius: 10,
  },
  bottomView: {
    width: '100%',
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
  },
  productName: {
    fontSize: RFValue(10),
    color: baseColors.black,
    fontFamily: AppFonts.semibold,
    fontWeight: '600',
  },
  productPrice: {
    fontSize: RFValue(9.5),
    color: baseColors.theme,
    fontFamily: AppFonts.bold,
    fontWeight: '700',
    marginTop: hp(0.3),
  },
});
