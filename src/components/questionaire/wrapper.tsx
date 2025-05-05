import { useDispatch } from 'react-redux';
import { useSetAuthValue } from '../../atoms/auth';
import { ProfileData, useProfileDataValue } from '../../atoms/profileData';
import { AppConstant } from '../../constants/AppConstants';
import { baseColors } from '../../constants/colors';
import { useAsyncStorage } from '../../hooks/useAsyncStorage';
import { Spinner } from '../spinner';
import { Dots } from './dots';
import { IndexTop } from './indexTop';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { createRef, PropsWithChildren, useEffect, useState } from 'react';
import { Button, Div, Snackbar, Text } from 'react-native-magnus';
import Feather from 'react-native-vector-icons/Feather';
import { setAuthRedux, setIsSkipped, setToken } from '../../redux/Reducers/userData';

export type QuestionireWrapperProps = PropsWithChildren & {
  index: number;
  title: string;
};

const routesList = ['questionOne', 'questionTwo', 'questionThree', 'questionFour', 'questionFive', 'questionSix'] as const;
type Route = (typeof routesList)[number];

type RouteDataMap = Record<keyof ProfileData, Route>;
const dataToRouteMap: RouteDataMap = {
  gender: 'questionOne',
  age: 'questionTwo',
  height: 'questionThree',
  heightIndex: 'questionThree',
  weight: 'questionFour',
  weightIndex: 'questionFour',
  health_issues: 'questionFive',
  howActive: 'questionSix',
};

const MAX_QUESTIONS = 6;
export function QuestionireWrapper(props: QuestionireWrapperProps) {
  const snackbarRef = createRef<Snackbar>();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const profile = useProfileDataValue();
  const { getString } = useAsyncStorage();
  const setAuth = useSetAuthValue();
  const dispatch = useDispatch()

  useEffect(() => {
    async function getInitialUserSettingsData() {
      try {
        const token = await getString('token');
        if (!token) {
          // console.log('token not found');
          setAuth(prev => ({ ...prev, isAuthenticated: false }));
          // @ts-ignore
          navigation.navigate({ key: 'welcome', name: 'welcome' });
        }

        const res = await axios.get(`https://invibet-backend-280569053519.asia-south1.run.app/user-settings`, {
          headers: { Authorization: token },
        });
        if (res.data) {
          // console.log(res.data.settings);
          // @ts-ignore
          // navigation.navigate({ key: 'product/whatSettingUp', name: 'product/whatSettingUp' });
        }
      } catch (err: any) {
      } finally {
        setLoading(false);
      }
    }
    getInitialUserSettingsData();
  }, []);

  async function handleNext() {

    if (props.index === MAX_QUESTIONS) {
      // handle submit
      for (const key in profile) {
        const val = profile[key as keyof ProfileData];
        if (!val) {
          const nextRouteName = dataToRouteMap[key as keyof ProfileData];
          // @ts-ignore
          navigation.navigate({ key: nextRouteName, name: nextRouteName });
          return;
        }
      }

      const token = await getString('token');
      // if (!token) {
      //   // console.log('token not found');
      //   setAuth(prev => ({ ...prev, isAuthenticated: false }));
      //   dispatch(setToken(''));
      //   dispatch(setAuthRedux(false));
      //   // @ts-ignore
      //   navigation.navigate({ key: 'welcome', name: 'welcome' });
      //   return;
      // }

      try {
        const res = await axios.post(
          `${AppConstant.baseurl}login/user-profile`,
          {
            age: profile.age,
            gender: profile.gender,
            // height: profile.height,
            height: 170, // TODO: FIX After next deployment
            weight: isNaN(Number(profile.weight)) ? 70 : Number(profile.weight),
            health_issues: profile.health_issues.join(','),
            active: profile.howActive === 'active',
            name: profile?.name ?? '',
            user_activity: profile?.howActive,
            email: ""
          },
          { headers: { Authorization: token, 'Content-Type': 'application/json' } },
        );
        snackbarRef.current?.show('User profile created successfully');
        dispatch(setIsSkipped(false))
        navigation.navigate('product/tnc')
        dispatch(setAuthRedux(true))
        // console.log(res.data);
      } catch (err: any) {
        // console.log(err);
        snackbarRef.current?.show('Something went wrong');
      }
    } else {
      const nextRouteName = routesList[props.index];
      // @ts-ignore
      navigation.navigate({ key: nextRouteName, name: nextRouteName });
    }
  }

  if (loading) {
    return (
      <Div bg={baseColors.theme} h="100%" alignItems="center" justifyContent="center">
        <Div flexDir="column" bg={baseColors.themeLight} w={200} rounded="lg" p={20} alignItems="center" justifyContent="center">
          <Text mb={16} fontWeight="600" fontSize="lg" color={baseColors.white}>
            Loading . . .
          </Text>
          <Spinner />
        </Div>
      </Div>
    );
  }

  return (
    <Div bg={baseColors.theme} h="100%" pt={100}>
      <Div w="100%" alignItems="center" justifyContent="center" mt={150}>
        <IndexTop index={props.index} max={MAX_QUESTIONS} />
      </Div>

      <Text m={30} fontSize={30} fontWeight="500" textAlign="center" color={baseColors.white}>
        {props.title}
      </Text>

      <Div w="100%" px={20} alignItems="center" bg='red' >
        {props.children}
      </Div>

      <Div position="absolute" bottom={100} left={0} w="100%" >
        <Div mx={4100} flexDir="row" alignItems="center" justifyContent="space-between">
          <Dots index={props.index} max={MAX_QUESTIONS} />

          <Button
            p={0}
            h={33}
            w={47}
            borderWidth={1}
            bg="transparent"
            alignItems="center"
            onPress={handleNext}
            justifyContent="center"
            borderColor={baseColors.themeLight}>
            <Feather size={16} name="arrow-right" color={baseColors.themeLight} style={{ margin: 0, padding: 0 }} />
          </Button>




        </Div>
      </Div>

      <Snackbar mb={80} duration={5000} ref={snackbarRef} color={baseColors.white} bg={baseColors.themeLight} />
    </Div>
  );
}

