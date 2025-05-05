import { hp, wp } from '../../../Utils/dimension';
import { ConfirmModal } from '../../../components/confirmModal';
import { Description } from '../../../components/loginFlow/helpers';
import { RoundedTopBar } from '../../../components/loginFlow/roundedTopBar';
import { enableStepAutoUpdate, listenToDeviceScans, onStartConnect } from '../../../components/native';
import { Connection, WatchConnectionModal } from '../../../components/native/watchConnectionModal';
import AppImages from '../../../constants/AppImages';
import { baseColors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import { setConnection_status } from '../../../redux/Reducers/tempData';
import { setAuthRedux, setIsSkipped } from '../../../redux/Reducers/userData';
import { LoggedInStackParamsList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createRef, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { View } from 'react-native-animatable';
import { Button, Div, Icon, ScrollDiv, Snackbar, Text } from 'react-native-magnus';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch } from 'react-redux';

export function WatchTermsAndConditions({ navigation, route }: NativeStackScreenProps<LoggedInStackParamsList, 'product/tnc'>) {
  const snackbarRef = createRef<Snackbar>();
  // const [connection, setConnection] = useState<Connection>({ isConnected: false, isConnecting: false });
  const [modalOpen, setModalOpen] = useState<'prompt' | 'connect' | null>(null);
  const dispatch = useDispatch();
const {deviceInfo} = route.params;
  // Product data from route params
  const product = route?.params?.product || {
    image: 'No Image',
    name: 'No Device Found',
    title: 'No Description Available',
  };

  // useEffect(() => {
  //   console.log('Product Data:', product);
  //   onStartConnect();
  // }, []);

  const closeModal = () => setModalOpen(null);

  return (
    <Div bg={baseColors.white} h="100%">
      <View style={styles.main}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image source={AppImages.back} style={styles.decline_img} resizeMode="contain" />
          </Pressable>
          <Text style={styles.title}>Connect Device</Text>
        </View>

        {/* Product Details */}
        <View style={styles.titleContainer}>
          <View style={styles.productImageCon}>
            <Image source={product.image} style={styles.productImage} resizeMode="contain" />
          </View>
          <View style={styles.productDetails}>
            <Text style={styles.productHeading}>Connect {product?.name} to this App?</Text>
          </View>
        </View>

        <ScrollView style={{ paddingHorizontal: wp(5) }} showsVerticalScrollIndicator={false}>
          <Text mb={8} lineHeight={20} style={styles.termsText}>
            How it Works
          </Text>
          <Text mb={8} lineHeight={25} style={styles.termsTextDes}>
            When you connect your smartwatch to the app, it collects data to enhance your experience and help you reach your goals. The collected data
            may include: {'\n'}
          </Text>
          <Text mb={8} lineHeight={20} style={styles.termsTextDesli}>
            {'\u2022'} Activity and fitness metrics such as steps, {'\n'}
            {'   '}calories burned, and distance traveled.{'\n'} {'\n'}
            {'\u2022'} Wellness data, including heart rate monitoring.{'\n'} {'\n'}
            {'\u2022'} Device-specific information, like battery
            {'\n'}
            {'  '} level and sensor updates.{'\n'}
          </Text>
          <Text mb={8} lineHeight={20} style={styles.termsTextDes}>
            This data is used to provide insights and personalise your rewards. Some features may require additional permissions. {'\n'} {'\n'}
            Managing Your Device {'\n'}
            You can disconnect the device anytime via settings. Once disconnected, the app will no longer sync new data, but your previously synced
            information remains unaffected.
          </Text>
        </ScrollView>

        <Div my={10} w="100%" bottom={7}>
          <Button
            w="95%"
            mx="auto"
            px={36}
            py={12}
            fontSize="lg"
            fontWeight="500"
            bg={baseColors.theme}
            color={baseColors.white}
            onPress={() => {
              console.log('Navigating to ConnectingDevice...');
              navigation.navigate('ConnectingDevice', { product,deviceInfo });
            }}>
            I agree
          </Button>
        </Div>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1),
    paddingTop:hp(2)
  },
  decline_img: {
    width: wp(6),
    height: hp(6),
    tintColor: baseColors.theme,
  },
  title: {
    fontSize: RFValue(16),
    color: baseColors.black,
    fontFamily: AppFonts.medium,
    fontWeight: '600',
    marginLeft: wp(3),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
  },
  productImageCon: {
    borderRadius: wp(10),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: wp(13),
    height: wp(13),
    resizeMode: 'contain',
  },
  productDetails: {
    flex: 1,
    marginLeft: wp(1),
  },
  productHeading: {
    fontSize: RFValue(16),
    color: baseColors.black,
    fontFamily: AppFonts.extraBold,
  },
  termsText: {
    fontSize: RFValue(14),
    color: baseColors.black,
    fontFamily: AppFonts.bold,
  },
  termsTextDes: {
    fontSize: RFValue(12),
    color: baseColors.black,
    fontFamily: AppFonts.medium,
  },
  termsTextDesli: {
    fontSize: RFValue(11.5),
    color: baseColors.black,
    fontFamily: AppFonts.medium,
    paddingHorizontal: wp(5),
  },
  bottomNote: {
    fontSize: RFValue(12),
    color: baseColors.btn_disable,
    fontFamily: AppFonts.light,
  },
});
