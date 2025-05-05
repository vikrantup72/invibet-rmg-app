import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppUtils from '../../../Utils/appUtils';
import { hp, wp } from '../../../Utils/dimension';
import { useSetAuthValue } from '../../../atoms/auth';
import CommanTextInput from '../../../components/CommanTextInput';
import CustomBtn from '../../../components/CustomBtn';
import { BettingTopBar } from '../../../components/betting/topBar';
import AppImages from '../../../constants/AppImages';
import { baseColors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import { useAsyncStorage } from '../../../hooks/useAsyncStorage';
import { setCartData, setDehliveryAddress } from '../../../redux/Reducers/tempData';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Div } from 'react-native-magnus';
import { disabledProps } from 'react-native-magnus/lib/typescript/src/types';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';

export function AddAddress({ navigation }) {
  const { deviceAddress, auth, token, user, deviceActivity } = useSelector(state => state?.userData);
  const [flatDetail, setFlatDetail] = useState('');
  const [landmark, setLandmark] = useState('');
  const [Pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const dispatch = useDispatch();

  const verify=()=>{
    if (flatDetail && landmark && Pincode && city && state) {
    }
    if(flatDetail?.trim()?.length==0){
      AppUtils.showToast_error('Please enter flat detail')
    }
    else if(landmark?.trim()?.length==0){
      AppUtils.showToast_error('Please enter landmark')
    }
    else if(Pincode?.trim()?.length==0){
      AppUtils.showToast_error('Please enter pincode')
    }
    else if(city?.trim()?.length==0){
      AppUtils.showToast_error('Please enter city')
    }
    else if(state?.trim()?.length==0){
      AppUtils.showToast_error('Please enter state')
    }
    else{
      dispatch(setDehliveryAddress({ flat: flatDetail, landmark: landmark, pincode: Pincode, city: city, state: state }));
     setTimeout(() => {
       navigation.goBack()
     }, 300);
    }

  }

  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar title="Add Address" noIcons />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, }}>
      <View style={styles.main}>
        <CommanTextInput
          titleTxt={'Flat/Apartment Details*'}
          onChangeText={t => setFlatDetail(t)}
          placeholder={'Enter Flat/Apartment'}
          value={flatDetail}
        />

        <CommanTextInput titleTxt={'Landmark'} onChangeText={t => setLandmark(t)} placeholder={'Enter Landmark'} value={landmark} />

        <CommanTextInput
          maxLength={6}
          titleTxt={'Pincode*'}
          onChangeText={t => setPincode(t)}
          placeholder={'Enter Pincode'}
          value={Pincode}
          keyboardType="number-pad"
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <CommanTextInput
            titleTxt={'City'}
            onChangeText={t => setCity(t)}
            placeholder={'Enter City'}
            value={city}
            containerStyle={{ width: '47%' }}
          />
          <CommanTextInput
            titleTxt={'State'}
            onChangeText={t => setState(t)}
            placeholder={'Enter State'}
            value={state}
            containerStyle={{ width: '47%' }}
          />
        </View>

        <CustomBtn
          onPress={() => {
            verify()
          }}
          btnName={`Add Address`}
          textStyle={{ color: baseColors.white }}
          btnStyle={{ marginTop: hp(8) }}
        />
      </View>
      </KeyboardAwareScrollView>
    </Div>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: baseColors.white,
    paddingHorizontal: wp(4),
  },
  productView: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: baseColors.borderColor,
    marginTop: hp(2),
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productImg: {
    height: hp(18),
    width: '35%',
  },
  img: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 4,
  },
  rightview: {
    height: hp(18),
    width: '64%',
    paddingHorizontal: wp(2),
    paddingVertical: hp(1.2),
    justifyContent: 'space-between',
  },
  productname: {
    fontSize: RFValue(10),
    fontFamily: AppFonts.semibold,
    fontWeight: '400',
    color: baseColors.theme,
    textTransform: 'capitalize',
    width: '80%',
  },
  cross: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
  },
  nameCrossView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: RFValue(12),
    fontFamily: AppFonts.bold,
    fontWeight: '700',
    color: baseColors.theme,
    textTransform: 'capitalize',
  },
  qty: {
    fontSize: RFValue(12),
    fontFamily: AppFonts.medium,
    fontWeight: '400',
    color: baseColors.theme,
    textTransform: 'capitalize',
    marginRight: wp(2),
  },
  qtyMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtn: {
    height: wp(6),
    width: wp(6),
    borderRadius: 0.5,
    borderWidth: 1,
    borderColor: baseColors.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: '18%',
    width: '60%',
    resizeMode: 'contain',
  },
  quantity: {
    fontSize: RFValue(11),
    fontWeight: '700',
    fontFamily: AppFonts.bold,
    color: baseColors.theme,
    marginHorizontal: wp(4),
  },
  AddressMain: {
    paddingVertical: hp(2),
    backgroundColor: 'rgba(123, 96, 134, 0.1)',
    borderRadius: 4,
    marginTop: hp(2),
    paddingHorizontal: wp(3),
  },

  upper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dehliveryAdd: {
    fontSize: RFValue(10),
    fontWeight: '500',
    fontFamily: AppFonts.bold,
    color: baseColors.theme,
  },
  addAddress: {
    fontSize: RFValue(10),
    fontWeight: '500',
    fontFamily: AppFonts.semibold,
    color: baseColors.theme,
    textDecorationLine: 'underline',
  },
  seperator: {
    height: 1,
    width: '100%',
    backgroundColor: baseColors.borderColor,
    marginVertical: hp(1),
  },
});
