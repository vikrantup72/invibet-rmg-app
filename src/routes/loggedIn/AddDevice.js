import {hp, wp} from '../../Utils/dimension';
import CustomBtn from '../../components/CustomBtn';
import AppImages from '../../constants/AppImages';
import {baseColors} from '../../constants/colors';
import AppFonts from '../../constants/fonts';
import userData from '../../redux/Reducers/userData';
import {setIsSkipped, setAuthRedux} from '../../redux/Reducers/userData';
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch} from 'react-redux';

const AddDevice = ({navigation}) => {
  console.log('i am at add device***********');
  //Redux
  const dispatch = useDispatch();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [productList] = useState([
    {
      id: '1',
      name: 'Devices',
      image: AppImages.AppWatch,
      category:
        'Start tracking your activity and unlocking rewards effortlessly',
    },
  ]);

  const filteredProducts =
    selectedFilter === 'All'
      ? productList
      : productList.filter(product => product.category === selectedFilter);

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
        <View style={styles.ImgContainer}>
          <Image source={item.image} style={styles.image} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>
      </View>
      <Pressable
        style={styles.btn_Container}
        onPress={() => {
          navigation.navigate('DeviceSetup');
        }}>
        <Text style={styles.Btn}>Add device</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Setup Your Device</Text>
      </View>
      {/* Product List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
      />
      <CustomBtn
        btnName={'Buy a New Device'}
        textStyle={{
          color: baseColors.theme,
          fontFamily: AppFonts.bold,
          fontWeight: '600',
        }}
        btnStyle={{
          marginVertical: hp(1),
          backgroundColor: baseColors.white,
          borderColor: baseColors.theme,
          borderWidth: 1,
        }}
        onPress={() => {
          dispatch(setAuthRedux(true));
          dispatch(setIsSkipped(false));
          console.log('Redux Update===>===>===>', userData);
          setTimeout(() => {
            navigation.navigate('bettingTabs', {screen: 'betting/shop'});
          }, 100);
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: hp(3),
        }}>
        <CustomBtn
          btnName={'Skip for now '}
          textStyle={{
            color: baseColors.theme,
            fontFamily: AppFonts.bold,
            fontWeight: '600',
          }}
          btnStyle={{
            marginVertical: hp(1),
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderWidth: 1,
            width: wp(80),
          }}
          icon_right={AppImages.arrow_right}
          imgStyle_right={{width: wp(3.2), height: wp(3.2)}}
          onPress={() => {
            setTimeout(() => {
              dispatch(setAuthRedux(true));
              navigation.navigate('bettingTabs');
            }, 100);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddDevice;

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp(1),
    paddingHorizontal: 16,
  },
  main: {
    flex: 1,
    backgroundColor: baseColors.white,
    paddingHorizontal: wp(5),
    paddingTop: hp(3),
  },
  title: {
    fontSize: RFValue(16),
    color: baseColors.black,
    fontFamily: AppFonts.medium,
    fontWeight: '600',
    marginBottom: hp(2),
  },
  selectedButton: {
    backgroundColor: baseColors.theme,
  },
  filterText: {
    color: baseColors.theme,
    fontSize: RFValue(14),
    fontWeight: '600',
    fontFamily: AppFonts.medium,
  },
  selectedText: {
    color: baseColors.white,
  },
  productList: {
    paddingBottom: hp(3),
  },
  card: {
    backgroundColor: '#FAF7FC',
    borderRadius: 8,
    paddingVertical: hp(2.5),
    paddingHorizontal: wp(2),
  },
  ImgContainer: {
    paddingVertical: wp(3),
  },
  image: {
    width: wp(15),
    height: wp(15),
    marginRight: wp(2),
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    paddingVertical: wp(3),
  },
  btn_Container: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    alignSelf: 'flex-end',
  },
  Btn: {
    color: baseColors.theme,
    fontSize: RFValue(10),
    fontFamily: AppFonts.semibold,
    backgroundColor: baseColors.white,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    borderRadius: 8,
  },
  productName: {
    fontSize: RFValue(13),
    color: baseColors.black,
    fontFamily: AppFonts.bold,
  },
  category: {
    fontSize: RFValue(11.5),
    color: baseColors.gray,
    fontFamily: AppFonts.regular,
  },
  arrow: {
    height: wp(3),
    width: wp(3),
    maxHeight: 20,
    maxWidth: 20,
    tintColor: baseColors.themeLight,
    resizeMode: 'contain',
    marginTop: -5,
  },
});
