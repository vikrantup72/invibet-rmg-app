import {getUserActivity, saveDeviceActivity} from '../api/Services/services';
import {
  UploadDeviceActivity,
  setDeviceActivity,
} from '../redux/Reducers/userData';
import {RootState} from '../redux/store';
import {
  GoalFireIcon,
  GoalWalkingIcon,
} from '../routes/loggedIn/bettingTabs/icons';
import {watchSdkEmitter} from './native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Pressable, View} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import {Div, Text} from 'react-native-magnus';
import {useDispatch, useSelector} from 'react-redux';
import {setCurrentStepData} from '../redux/Reducers/tempData';
import moment from 'moment';

type StepData = {
  step: number;
  distance: number;
  calories: number;
};

export function Label(props: {
  Icon: any;
  value: string | number;
  label: string;
}) {
  return (
    <Div row alignItems="center">
      <props.Icon />
      <Div ml={10} justifyContent="center">
        <Text fontSize={28} fontWeight="700">
          {props.value}
        </Text>
        <Text mt={-4}>{props.label}</Text>
      </Div>
    </Div>
  );
}

async function getData() {
  const values = await AsyncStorage.getAllKeys();
  for (let i = 0; i < values.length; i++) {
    const value = await AsyncStorage.getItem(values[i]);
    console.log(i + 1 + ' async : ', values[i], value);
  }
}

export function Activity({token, deviceAddress}) {
  const {currentStepData} = useSelector(state => state.tempData);
  const currentStepDataRef = useRef(null);
  const [activityData, setActivityData] = useState<StepData>({
    step: 0,
    distance: 0,
    calories: 0,
  });
  const [lastResetDate, setLastResetDate] = useState<string>(
    new Date().toDateString(),
  );
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.userData.user?.id);

  useEffect(() => {
    currentStepDataRef.current = currentStepData;
  }, [currentStepData]);

  function adjustCalories(calories) {
    let calorie = calories;
    if (typeof calories !== 'number' || isNaN(calories)) {
      calorie = parseInt(calories);
    }

    // Adjust the value by dividing by 1000
    const adjustedValue = calories / 1000;

    // If the decimal part is less than 0.9, round down; otherwise, round normally
    if (adjustedValue % 1 < 0.9) {
      console.log('adjus value-=-', adjustedValue);
      return adjustedValue.toFixed(4); // Round down
      return Math.floor(adjustedValue); // Round down
    } else {
      return adjustedValue; // Round normally
      return Math.round(adjustedValue); // Round normally
    }
  }
  // Get API
  const fetchUserActivity = useCallback(async () => {
    if (!token || !userId) {
      console.log('Skipping fetch - missing token or userId');
      return null;
    }

    try {
      const response = await getUserActivity(userId, token);

      if (response?.data?.data) {
        // Add validation to ensure steps don't exceed watch data
        const watchSteps =
          activityData.step !== -1
            ? activityData.step
            : response.data.data.steps;
        const data = {
          step: Math.max(response.data.data.steps || 0, watchSteps),
          distance: 0,
          calories: response.data.data.calories || 0,
        };
        setActivityData(data);
        dispatch(setDeviceActivity(data));
        return data;
      }
    } catch (error) {
      console.error('Error fetching user activity:', error);
    }
    return null;
  }, [token, userId, dispatch, activityData.step]);

  const isSameDate = (date1, date2) => {
    return moment(date1).isSame(moment(date2), 'day');
  };

  function convertDecaCaloriesToWatchFormat(decaCalories) {
    // Convert decacalories to kcal
    const kcal = decaCalories / 1000;

    // Use Math.floor to always round down
    const roundedKcal = Math.floor(kcal);

    // Pad to 4 digits
    return roundedKcal.toString().padStart(4, '0');
  }
  useEffect(() => {
    // fetchUserActivity();

    if (deviceAddress) {
      watchSdkEmitter.addListener('stepChanged', async data => {
        console.log('Watch step change detected:', data);
        if (data?.step) {
          const currentDate = new Date().toDateString();
          setActivityData({
            ...data,
            calories: convertDecaCaloriesToWatchFormat(data?.calories),
          });
          if (
            currentStepDataRef.current?.step == data?.step &&
            isSameDate(data?.date, currentStepDataRef.current?.date)
          ) {
            return;
          }
          // Check if it's a new day
          else if (currentDate !== lastResetDate) {
            console.log('New day detected, resetting step count');
            setLastResetDate(currentDate);
            await saveActivityData({
              step: data.step,
              distance: 0,
              calories: data.calories || 0,
            });
            dispatch(setCurrentStepData(data));
            // await fetchUserActivity();
            return;
          }

          // Only update if watch steps are valid and different
          else if (data.step !== activityData.step && data.step >= 0) {
            const reasonableStepLimit = 100000; // Example limit
            const validSteps = Math.min(data.step, reasonableStepLimit);

            await saveActivityData({
              step: validSteps,
              distance: 0,
              calories: data.calories || 0,
            });
            dispatch(setCurrentStepData(data));
            // await fetchUserActivity();
          } else {
            console.log('Steps unchanged or invalid, skipping update');
          }
        }
      });

      // const syncTimer = BackgroundTimer.setInterval(fetchUserActivity, 1000);

      return () => {
        console.log('Cleaning up watch SDK listener and timer');
        watchSdkEmitter.removeAllListeners('stepChanged');
        // BackgroundTimer.clearInterval(syncTimer);
      };
    }
  }, [token, deviceAddress, activityData.step]);

  const saveActivityData = async (data: StepData) => {
    if (!token || !deviceAddress || !userId) {
      console.log('Skipping save - missing required data:', {
        token,
        deviceAddress,
        userId,
      });
      return;
    }

    try {
      const body = {
        steps: data.step,
        calories: data.calories,
        device_id: deviceAddress,
        user_id: userId,
      };

      // console.log('Saving activity data:', body);
      const response = await saveDeviceActivity(body, token);

      if (response?.status === 201) {
        console.log('Activity saved successfully:', response.data);
        dispatch(setDeviceActivity(data));
      } else {
        console.warn('Unexpected response status:', response?.status);
      }
    } catch (error) {
      console.error('Error saving activity data:', error);
    }
  };

  if (activityData.step === -1) return <Div></Div>;

  return (
    <View>
      <Div row mt={25} justifyContent="space-around">
        <Label Icon={GoalWalkingIcon} label="Steps" value={activityData.step} />
        <Label
          Icon={GoalFireIcon}
          label="Calories"
          value={activityData.calories}
        />
      </Div>
    </View>
  );
}
