import { hp, wp } from '../../../Utils/dimension';
import { getAllProducts } from '../../../api/Services/services';
import { useSetAuthValue } from '../../../atoms/auth';
import CustomBtn from '../../../components/CustomBtn';
import { BettingTopBar } from '../../../components/betting/topBar';
import SingleProduct from '../../../components/shop/SingleProduct';
import SingleProductWebview from '../../../components/shop/SingleProductWebview';
import AppImages from '../../../constants/AppImages';
import { baseColors } from '../../../constants/colors';
import { useAsyncStorage } from '../../../hooks/useAsyncStorage';
import { setLoader } from '../../../redux/Reducers/tempData';
import { setAuthRedux, setToken } from '../../../redux/Reducers/userData';
import { LoggedInBettingTabsParamsList } from '../../types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Div } from 'react-native-magnus';
import { useDispatch, useSelector } from 'react-redux';

export function Shop({ navigation }: BottomTabScreenProps<LoggedInBettingTabsParamsList, 'betting/shop'>) {
  const { deviceAddress, auth, token, user, deviceActivity } = useSelector(state => state?.userData);
  const setAuth = useSetAuthValue();
  const { getString } = useAsyncStorage();
  const dispatch = useDispatch();
  const data = [1, 2, 3, 4, 5, 6, 6, 78, 9];
  const [product_list, setProduct_list] = useState([]);

  async function GetProducts() {
    if (!token) {
      // setAuth(prev => ({ ...prev, isAuthenticated: false }));
      // dispatch(setToken(''));
      // dispatch(setAuthRedux(false));
      // // @ts-ignore
      // // navigation.navigate({ key: 'welcome', name: 'welcome' });
      // console.log('Navgation $$$$$$$ ====>')
      // return;
      console.log('No Navigation ===> ***********') 
    }
    dispatch(setLoader(true));
    try {
      const res = await getAllProducts(token);
      console.log('products list', res?.data);
      dispatch(setLoader(false));
      if (res?.status == 200) {
        setProduct_list(res?.data);
      }
    } catch (err) {
      dispatch(setLoader(false));
      console.log('error while getting product list', err);
    }
  }

  useFocusEffect(
    useCallback(() => {
      GetProducts();
    }, []),
  );

  const products = [
    { icon: AppImages.smartwatch1, link: "https://www.limeroad.com/champagne-black-silicone-snapup-p21316581?imgIdx=0&src_id=fromsearch__0&utm_source=google&utm_medium=email&utm_campaign=sale" },
    { icon: AppImages.smartwatch2, link: "https://www.limeroad.com/products/21316580?utm_source=google&utm_medium=email&utm_campaign=sale" },
    { icon: AppImages.smartwatch3, link: "https://www.limeroad.com/products/21316579?utm_source=google&utm_medium=email&utm_campaign=sale" },
    { icon: AppImages.smartwatch4, link: "https://www.limeroad.com/products/21316578?utm_source=google&utm_medium=email&utm_campaign=sale" },
    { icon:  AppImages.smartwatch5, link: "https://www.limeroad.com/products/21568206?utm_source=google&utm_medium=email&utm_campaign=sale" },
    { icon:  AppImages.smartwatch6, link: "https://www.limeroad.com/products/21568207?utm_source=google&utm_medium=email&utm_campaign=sale" },
    { icon:  AppImages.smartwatch7, link: "https://www.limeroad.com/products/21568208?utm_source=google&utm_medium=email&utm_campaign=sale" },
    { icon:  AppImages.smartwatch8, link: "https://www.limeroad.com/products/21568203?utm_source=google&utm_medium=email&utm_campaign=sale" },
    { icon:  AppImages.smartwatch9, link: "https://www.limeroad.com/products/21568204?utm_source=google&utm_medium=email&utm_campaign=sale" },
    { icon:  AppImages.smartwatch10, link: "https://www.limeroad.com/products/21568205?utm_source=google&utm_medium=email&utm_campaign=sale" },
    { icon:  AppImages.smartwatch11, link: "https://www.limeroad.com/products/21568323?utm_source=google&utm_medium=email&utm_campaign=sale" }
  ];
  
  console.log(products);
  

  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar title="Shop" noBackBtn />
      <View style={styles.main}>
        {/* <FlatList
          data={product_list}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: wp(1), paddingBottom: hp(9) }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => <SingleProduct item={item} index={index} />}
        /> */}



<FlatList
          data={products}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: wp(1), paddingBottom: hp(9) }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => <SingleProductWebview item={item} index={index} />}
          />
      </View>
    </Div>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 50,
    width: '70%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOuter: {
    marginTop: hp(6),
  },
  main: {
    flex: 1,
    backgroundColor: baseColors.white,
    paddingHorizontal: wp(4),
  },
});
