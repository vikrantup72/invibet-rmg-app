import { hp, wp } from '../../../Utils/dimension';
import { getProduct_detail } from '../../../api/Services/services';
import { useSetAuthValue } from '../../../atoms/auth';
import CommanTextInput from '../../../components/CommanTextInput';
import CustomBtn from '../../../components/CustomBtn';
import ProductDetailTab from '../../../components/ProductDetailTab';
import { BettingTopBar } from '../../../components/betting/topBar';
import AppImages from '../../../constants/AppImages';
import { baseColors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import { setCartData, setLoader } from '../../../redux/Reducers/tempData';
import { setAuthRedux, setToken } from '../../../redux/Reducers/userData';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput } from 'react-native';
import { Animated, FlatList, Image, StyleSheet, View } from 'react-native';
import { Div } from 'react-native-magnus';
import { useDispatch, useSelector } from 'react-redux';


export function SingleProductDetail({ navigation, route }) {
  const productId = route?.params?.productId ?? '';
  const { token } = useSelector(state => state?.userData);
  const { cartData } = useSelector(state => state?.tempData);
  const data = [1, 2, 3, 4];
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [selectedVarient, setselectedVarient] = useState(0);
  const setAuth = useSetAuthValue();
  const dispatch = useDispatch();
  const [productDetail, setProductDetail] = useState({});
  const deliverinfo = ['7 Days', 'Free Delivery', '1 Year Waranty'];
  const [pincode, setPincode] = useState('');
  const [selectedTab, setSelectedTab] = useState('Specifications');

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  async function GetDetail(id) {
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
      const res = await getProduct_detail(id, token);
      // console.log('products detali', res);
      dispatch(setLoader(false));
      if (res?.status == 200) {
        setProductDetail(res?.data);
      }
    } catch (err) {
      dispatch(setLoader(false));
      console.log('error while getting product detail', err);
    }
  }

  useEffect(() => {
    if (productId) {
      GetDetail(productId);
    }
  }, []);

  //check with pincode input Ui
  const PincodeBloc = () => {
    return (
      <View style={styles.inputOuter}>
        <TextInput
          value={pincode}
          placeholder="Enter Pincode"
          placeholderTextColor={baseColors.placeholder}
          onChangeText={text => setPincode(text)}
          style={styles.input}
        />
        <Text style={styles.check}>Check </Text>
      </View>
    );
  };



  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar title="Invibet - Band 6.0" noIcons />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} >
        <View style={styles.main}>
          {/*********** product image *************/}
          <View style={{ height: hp(26), justifyContent: 'center' }}>
            <FlatList
              nestedScrollEnabled={true}
              data={data}
              horizontal
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => {
                return (
                  <View style={styles.productImgOuter}>
                    <Image source={AppImages.product} style={styles.productImg} />
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
            />
          </View>

          <View style={styles.pagination}>
            {data.map((_, index) => (
              <View key={index} style={[styles.dot, { opacity: currentIndex === index ? 1 : 0.3 }]} />
            ))}
          </View>

          <Text style={styles.title}>{productDetail?.name ?? ''} </Text>

          <Text style={styles.price}>Rs. {productDetail?.price ?? '0'}</Text>
          <Text style={styles.allTax}>Inclusive of all Taxes</Text>

          <View style={styles.e} />

          {/* <Text style={styles.color}>
            Color : <Text style={{ fontWeight: '400', color: baseColors.theme, fontFamily: AppFonts.semibold }}>Black Silicon</Text>
          </Text>

          <FlatList
            data={[1, 2, 3, 4, 5, 6]}
            nestedScrollEnabled={true}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ marginTop: hp(1) }}
            style={{ marginBottom: hp(1.5) }}
            renderItem={({ item, index }) => {
              return (
                <Pressable
                  onPress={() => {
                    setselectedVarient(index);
                  }}
                  style={[styles.varientImgOuter, { borderWidth: selectedVarient == index ? 2 : 0 }]}>
                  <Image source={AppImages.product} style={styles.varientImg} />
                </Pressable>
              );
            }}
          /> */}

          {deliverinfo?.map((item, index) => {
            return (
              <View key={index} style={styles.deliverInfo}>
                <View style={styles.dotDeliveryInfo} />
                <Text style={styles.deliverInfotitle}>{item}</Text>
              </View>
            );
          })}

          <View style={[styles.seperatore, { marginTop: hp(3) }]} />

          {/* <Text style={styles.checkDelivery}>Check Delivery Avaliability</Text>

          <PincodeBloc
          /> */}

          {/* <ProductDetailTab
            selectedTab={selectedTab}
            onPress={tab => {
              setSelectedTab(tab);
            }}
          /> */}

          <Text style={[styles.tabTitle, { color: baseColors.theme, fontWeight: '700' }]}>Specifications :</Text>

          <Text style={styles.description}>{productDetail?.description ?? ''}</Text>

          <View style={styles.btnOuter}>
            <CustomBtn
              onPress={() => {
                dispatch(setCartData({ ...cartData, ...productDetail, id: productId, quantity: 1 }));
                setTimeout(() => {
                  navigation.navigate('Checkout');
                }, 300);
              }}
              btnName={'Buy Now'}
              textStyle={{ color: baseColors.white }}
              btnStyle={{ marginTop: hp(3) }}
            />
          </View>
        </View>
      </ScrollView>
    </Div>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
  },
  productImgOuter: {
    width: wp(90),
    height: hp(25),
    backgroundColor: baseColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImg: {
    height: wp(60),
    width: wp(90),
    resizeMode: 'contain',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: wp(-6),
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: baseColors.white,
    marginHorizontal: 5,
  },
  varient: {
    height: wp(13),
    width: wp(13),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    borderWidth: 1,
    marginRight: wp(2),
  },
  productColor: {
    height: wp(8),
    width: wp(8),
    resizeMode: 'contain',
  },
  title: {
    fontSize: 12,
    fontFamily: AppFonts.medium,
    color: baseColors.theme,
    marginTop: hp(2),
    alignSelf: 'flex-start',
  },
  price: {
    fontSize: 26,
    fontFamily: AppFonts.bold,
    fontWeight: '700',
    alignSelf: 'flex-start',
    color: baseColors.theme,
    marginTop: hp(1),
  },
  allTax: {
    fontSize: 14,
    fontFamily: AppFonts.light,
    fontWeight: '400',
    alignSelf: 'flex-start',
    color: baseColors.theme,
    marginTop: -6,
  },
  seperatore: {
    height: 1,
    width: '100%',
    backgroundColor: baseColors.borderColor,
    marginTop: hp(2),
  },
  color: {
    fontSize: 14,
    fontFamily: AppFonts.light,
    fontWeight: '400',
    color: baseColors.primaryLight,
  },
  varientImgOuter: {
    height: wp(15),
    width: wp(15),
    borderRadius: 4,
    marginRight: wp(2),
    overflow: 'hidden',
    borderColor: baseColors.yellowPrimary,
  },
  varientImg: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  deliverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1),
  },
  dotDeliveryInfo: {
    height: wp(1),
    width: wp(1),
    borderRadius: wp(2),
    backgroundColor: baseColors.theme,
    marginRight: wp(2),
  },
  deliverInfotitle: {
    fontSize: 12,
    fontFamily: AppFonts.semibold,
    fontWeight: '700',
    color: baseColors.theme,
  },
  checkDelivery: {
    fontSize: 14,
    fontFamily: AppFonts.semibold,
    fontWeight: '700',
    color: baseColors.theme,
  },
  inputOuter: {
    height: hp(6),
    maxHeight: 45,
    borderWidth: 1,
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: hp(1),
    borderColor: baseColors.borderColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(2),
  },
  input: {
    height: '100%',
    width: '70%',
    fontFamily: AppFonts.medium,
    fontSize: 12,
    color: baseColors.theme,
  },
  check: {
    fontSize: 12,
    fontFamily: AppFonts.medium,
    fontWeight: '400',
    textDecorationLine: 'underline',
    color: baseColors.themeLight,
  },
  tabTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: baseColors.white,
    fontFamily: AppFonts.medium,
    textDecorationLine: 'underline',
    marginTop: hp(2),
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
    color: baseColors.theme,
    fontFamily: AppFonts.medium,
    marginTop: hp(1),
  },
});
