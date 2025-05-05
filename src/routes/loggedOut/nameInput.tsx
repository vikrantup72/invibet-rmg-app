import AppUtils from '../../Utils/appUtils';
import { hp, wp } from '../../Utils/dimension';
import { useProfileDataState } from '../../atoms/profileData';
import CommanTextInput from '../../components/CommanTextInput';
import CustomBtn from '../../components/CustomBtn';
import { BrandLogo, Description } from '../../components/loginFlow/helpers';
import { LoginFlowTopBar } from '../../components/loginFlow/topBar';
import { baseColors } from '../../constants/colors';
import AppFonts from '../../constants/fonts';
import { setAuthRedux } from '../../redux/Reducers/userData';
import { LoggedOutStackParamsList } from '../types';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Div, Input, Text } from 'react-native-magnus';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

export function NameInput({ navigation }: NativeStackScreenProps<LoggedOutStackParamsList, 'nameInput'>) {
  const { user, isSkipped } = useSelector(state => state?.userData);
  const [profile, setProfile] = useProfileDataState();
  const [name, setName] = useState('');
  const dispatch = useDispatch();


  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: baseColors.white }}>
      {/* <LoginFlowTopBar /> */}
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ flex: 1, paddingHorizontal: wp(5), marginTop: hp(5) }}>
          {/* <Div bg={baseColors.white} h="100%">
      <LoginFlowTopBar />
      <Div alignItems="center" p="lg" pt={80} px={20}>
        <BrandLogo />
        <Div my={5} />
        <Description
          title="Good Afternoon!"
          description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          textProps={{ color: baseColors.theme }}
        />
      </Div>

      <Div px={20}>
        <Text color="gray" mb="md">
          Name
        </Text>
        <Input py={6} placeholder="Enter your Name" mb={20}  value={name} onChangeText={(i)=>{
          setName(i)
          setProfile(prev => ({ ...prev, name: i }))
        }} />
      </Div>

      <Button
        mx="md"
        w="95%"
        fontSize="lg"
        fontWeight="500"
        bg={baseColors.theme}
        color={baseColors.white}
        onPress={() => navigation.navigate({ key: 'termsAndConditions', name: 'termsAndConditions' })}>
        Next
      </Button>
    </Div> */}

          {/* <View style={styles.imgOuter}></View> */}
          <Text style={styles.brandName}>Fuel Your Fitness Rewards🏆</Text>
          <Text style={styles.desc}>Complete your profile to stay active and earn rewards</Text>

          <View style={styles.inputOuter}>
            <CommanTextInput
              titleTxt={'Name'}
              placeholder={'Enter your Name'}
              value={name}
              onChangeText={i => {
                setName(i);
                setProfile(prev => ({ ...prev, name: i }));
              }}
            />
          </View>

          <View style={styles.btnOuter}>
            <CustomBtn
              onPress={() => {
                if (name?.trim()?.length == 0) {
                  AppUtils.showToast_error('Please enter name');
                  return;
                }
                navigation.navigate({ key: 'Questions', name: 'Questions' });
              }}
              btnName={'Save & Continue'}
              textStyle={{ color: baseColors.white, fontWeight: '600', fontFamily: AppFonts.bold }}
              btnStyle={{ marginTop: hp(3), width: '100%' }}
            />
            <CustomBtn
              onPress={() => {
                if (user?.hasOwnProperty('device_id') &&(user?.device_id != null) ) {
                  dispatch(setAuthRedux(true))
                }
                else {
                  // navigation.navigate('AddDevice');
                  navigation.navigate({ key: 'Questions', name: 'Questions' })
                }
              }}
              btnName={'Skip for Now'}
              textStyle={{ color: baseColors.theme, fontWeight: '600', fontFamily: AppFonts.bold }}
              btnStyle={{
                marginTop: hp(3), width: '100%', backgroundColor: baseColors.white,
                borderColor: baseColors.theme, borderWidth: 1
              }}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  brandName: {
    fontSize: RFValue(16),
    fontFamily: AppFonts.extraBold,
    color: baseColors.black,
    marginTop: hp(5),
    // fontWeight: '700',
  },
  desc: {
    fontSize: RFValue(12.5),
    fontFamily: AppFonts.medium,
    color: baseColors.black,
    marginTop: hp(1),
    lineHeight: hp(2.5),
  },
  inputOuter: {
    marginTop: hp(2),
  },
  btnOuter: {
    width: '100%',
  },
});
