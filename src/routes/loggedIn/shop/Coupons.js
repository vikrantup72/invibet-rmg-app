import { hp, wp } from '../../../Utils/dimension';
import { getCoupons } from '../../../api/Services/services';
import { useSetAuthValue } from '../../../atoms/auth';
import { BettingTopBar } from '../../../components/betting/topBar';
import { baseColors, colors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import { setCartData, setLoader } from '../../../redux/Reducers/tempData';
import { setAuthRedux, setToken } from '../../../redux/Reducers/userData';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Div } from 'react-native-magnus';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';

export function Coupons({ navigation }) {
  const { deviceAddress, auth, token, user, deviceActivity } = useSelector(state => state?.userData);
  const { cartData, dehliveryAddress } = useSelector(state => state?.tempData);
  const dispatch = useDispatch();
  const setAuth = useSetAuthValue();
  const [coupons_list, setCoupons_list] = useState([]);


  const renderItem = ({ item }) => {
    return (
      <View style={styles.Couponmain}>
        {/* Code & Button Container */}
        <View style={styles.Coupon_Tag_Btn_Col}>
          <View style={styles.CouponBg}>
            <View style={styles.dot}></View>
            <Text style={styles.CouponNum}> {item.code} </Text>
          </View>
          <Pressable
            onPress={() => {
              if (item?.id == cartData?.coupon_id) {
                dispatch(setCartData({ ...cartData, coupon_code: '', coupon_amount: '',coupon_id:'' }));
              } else {
                dispatch(setCartData({ ...cartData, coupon_code: item?.code, coupon_amount: item?.discount_price ,coupon_id:item?.id}));
              }
            }}
            style={[styles.CouponApplyBtn,{backgroundColor:(item?.id == cartData?.coupon_id)?baseColors.theme:'transparent'}]}>
            <Text style={[styles.ApplyTxt,{color:(item?.id == cartData?.coupon_id)?baseColors.white:baseColors.theme}]}>{item?.id == cartData?.coupon_id?"Applied":"Apply"}</Text>
          </Pressable>
        </View>
        {/* Coupon Description Container */}
        <View style={styles.CouponDesc}>
          <Text style={styles.DescTxt}>Get Rs.{item.discount_price} Off by applying this coupon</Text>
        </View>
      </View>
    );
  };

  async function GetCoupons() {
    if (!token) {
      setAuth(prev => ({ ...prev, isAuthenticated: false }));
      dispatch(setToken(''));
      dispatch(setAuthRedux(false));
      // @ts-ignore
      navigation.navigate({ key: 'welcome', name: 'welcome' });
      return;
    }
    dispatch(setLoader(true));
    try {
      const res = await getCoupons(token);
      console.log('coupons list', res);
      dispatch(setLoader(false));
      if (res?.status == 200) {
        setCoupons_list(res?.data);
      }
      else{
        setCoupons_list([]);
      }
    } catch (err) {
      dispatch(setLoader(false));
      console.log('error while getting product detail', err);
    }
  }

  useFocusEffect(
    useCallback(() => {
      GetCoupons();
    }, []),
  );
  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar title="Apply Coupon" noIcons />
      <View style={styles.main}>
        <Text style={styles.tittle}>Applicable</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          data={coupons_list}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={<View style={styles.seperatore}></View>}
        />
      </View>
    </Div>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: baseColors.white,
    paddingHorizontal: wp(4),
  },
  tittle: {
    fontSize: RFValue(12.5),
    fontWeight: '700',
    color: colors.light.theme,
    fontFamily: AppFonts.semibold,
    marginVertical: wp(2.5),
  },
  Couponmain: {
    paddingVertical: hp(0.5),
  },
  Coupon_Tag_Btn_Col: {
    width: '100%',
    paddingVertical: hp(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  CouponDesc: {
    height: wp(5),
    justifyContent: 'center',
  },
  DescTxt: {
    fontSize: RFValue(11),
    color: baseColors.theme,
    fontWeight: '400',
    fontFamily: AppFonts.semibold,
  },
  CouponBg: {
    paddingVertical: hp(1),
    minWidth: wp(29),
    backgroundColor: baseColors.theme,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    position: 'relative',
  },
  CouponNum: {
    fontSize: RFValue(11),
    fontFamily: AppFonts.medium,
    color: baseColors.white,
    fontWeight: '700',
    textAlign: 'center',
  },
  CouponApplyBtn: {
    backgroundColor: 'white',
    borderColor: baseColors.theme,
    borderWidth: 1,
    paddingVertical: hp(1),
    // paddingHorizontal: wp(4),
    width:wp(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  ApplyTxt: {
    fontSize: RFValue(10),
    color: baseColors.theme,
    fontFamily: AppFonts.bold,
    fontWeight: '600',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: baseColors.white,
    position: 'absolute',
    left: -4,
  },
  seperatore: {
    height: 1,
    width: '100%',
    backgroundColor: baseColors.borderColor,
    marginVertical: hp(0.5),
  },
});
