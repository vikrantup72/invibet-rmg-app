import { useSelector } from 'react-redux';
import { hp, wp } from '../../Utils/dimension';
import { getTrackingStatus } from '../../api/Services/services';
import { BettingTopBar } from '../../components/betting/topBar';
import { baseColors } from '../../constants/colors';
import AppFonts from '../../constants/fonts';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Div } from 'react-native-magnus';
import { RFValue } from 'react-native-responsive-fontsize';
import StepIndicator from 'react-native-step-indicator';
import moment from 'moment';
const labels = [
  {
    label: 'Order Placed',
    description: 'Your order has been successfully placed!',
    date: `${new Date()}`,
  },
  {
    label: 'Processing',
    description: ' Our team is currently working on processing of packing your items.',
    date: '',
  },
  {
    label: 'Processed',
    description: 'our order has been successfully processed and is now being prepared for Out for Delivery',
    date: '',
  },
  {
    label: 'Out for Delivery',
    description: 'Great news! Your order is now out for delivery.',
    date: '',
  },
  {
    label: 'Successfully Delivered',
    description: 'Your order has been successfully delivered. Thanks for choosing us.',
    date: '',
  },
];

const customStyles = {
  stepIndicatorSize: wp(6),
  currentStepIndicatorSize: wp(6),
  separatorStrokeWidth: wp(0.8),
  currentStepStrokeWidth: wp(3.1),
  stepStrokeCurrentColor: baseColors.theme,
  stepStrokeWidth: wp(0.5),
  stepStrokeFinishedColor: baseColors.theme,
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: baseColors.theme,
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: baseColors.theme,
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  currentStepIndicatorLabelFontSize: RFValue(13),
  stepIndicatorLabelCurrentColor: baseColors.theme,
  stepIndicatorLabelFinishedColor: baseColors.theme,
  stepIndicatorLabelUnFinishedColor: '#ffffff',
  labelColor: baseColors.theme,
  labelSize: RFValue(13),
  currentStepLabelColor: baseColors.theme,
  labelAlign: 'flex-start',
  finishedLabelColor: baseColors.theme,
  stepSpacing: hp(8),
};

const TrackJourney = ({ route }) => {
  const userId = useSelector((state) => state.userData.user?.id);
  const token = useSelector((state) => state.userData.token);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Token by Rdx:', token);
    console.log('User ID from Redux:', userId);

    if (!userId || !token) {
      console.error('Missing userId or token in Redux state');
      return;
    }

    const fetchTrackingStatus = async () => {
      try {
        setIsLoading(true);
        const response = await getTrackingStatus(userId, token);
        console.log('track response==>>', response)
        const status = response?.status;
        setIsLoading(false);
        if (!status) {
          console.error('API response does not include a valid status field');
          return;
        }

        console.log('API Status:', status);

        const position = labels.findIndex(
          (item) => item.label.toLowerCase() === status.toLowerCase()
        );

        if (position === -1) {
          console.warn(`Status "${status}" not found in labels.`);
          setCurrentPosition(0);
        } else {
          setCurrentPosition(position);
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Error fetching tracking status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrackingStatus();
  }, [userId, token]);

  const renderLabel = ({ position }) => (
    <View>
      <Text style={styles.labelText}>{labels[position].label}</Text>
      <Text style={styles.descriptionText}>{labels[position].description}</Text>
      <Text style={styles.dateText}>{labels[position].date}</Text>
    </View>
  );

  return (
    <Div bg={baseColors.white} h="100%">
      <BettingTopBar title="Track Journey" noIcons />
      <View style={styles.container}>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <StepIndicator
            customStyles={customStyles}
            currentPosition={currentPosition}
            labels={labels.map((item) => item.label)}
            stepCount={labels.length}
            direction="vertical"
            renderLabel={renderLabel}
          />
        )}
      </View>
    </Div>
  );
};





export default TrackJourney;




const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  labelText: {
    color: baseColors.theme,
    fontSize: RFValue(12),
    marginTop: hp(6.5),
    fontFamily: AppFonts.medium,
    fontWeight: '500',
    paddingHorizontal: wp(2),
  },
  descriptionText: {
    color: baseColors.lightGray,
    fontSize: RFValue(10),
    flexWrap: 'wrap',
    width: wp(80),
    paddingHorizontal: wp(2),
  },
  dateText: {
    color: baseColors.lightGray,
    fontSize: RFValue(11),
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
  },
  loadingText: {
    fontSize: RFValue(14),
    color: baseColors.gray,
    textAlign: 'center',
    marginTop: hp(20),
  },
});

