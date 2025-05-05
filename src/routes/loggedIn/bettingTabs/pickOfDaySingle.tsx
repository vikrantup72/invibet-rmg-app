import { baseColors } from '../../../constants/colors';
import { GoalBothIcon, GoalFireIcon, GoalWalkingIcon } from './icons';
import { ActivebetSingleData, Goal, PickOfTheDaySingleData, PreviousBetSingleData } from './sampleData';
import { PropsWithChildren, ReactNode } from 'react';
import { Dimensions } from 'react-native';
import { Button, Div, Text } from 'react-native-magnus';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export const goalMap: Record<Goal, ReactNode> = {
  fire: <GoalFireIcon />,
  walking: <GoalWalkingIcon />,
  both: <GoalBothIcon />,
};

function BetWrapper(props: PropsWithChildren<{ colorType: Goal; goal: string }>) {
  const screenWidth = Dimensions.get('window').width;

  return (
    <Div flexDir="row" alignItems="center" justifyContent="space-between" my={8}>
      <Div flexDir="row" alignItems="center">
        <Div maxW={60} alignItems="center" justifyContent="center" mr={16}>
          {goalMap[props.colorType]}
          <Text fontWeight="500" mt={2} textAlign="center" fontSize={8}>
            {props.goal}
          </Text>
        </Div>

        <Div borderRightColor={baseColors.theme} borderRightWidth={1} h={60} />
      </Div>

      <Div flexDir="row" alignItems="center" justifyContent="space-around" w={screenWidth - 100}>
        {props.children}
      </Div>
    </Div>
  );
}

function Label(props: PropsWithChildren<{ title: string | number; subTitle: string | number }>) {
  return (
    <Div maxW={72} alignItems="center" justifyContent="center">
      {props.children}
      <Text textAlign="center" fontSize={12} fontWeight="700" mt={8}>
        {props.title}
      </Text>
      <Text textAlign="center" fontSize={8}>
        {props.subTitle}
      </Text>
    </Div>
  );
}

export function PickOfTheDaySingle(props: PickOfTheDaySingleData & { onPressJoin?: () => void }) {
  return (

    <BetWrapper colorType={'walking'} goal={props?.bet_declaration}>
      <Label title={`${props?.duration}/${props?.steps}`} subTitle={props?.timeframe}>
        <EvilIcons name="calendar" size={22} color={baseColors.theme} />
      </Label>

      <Label title={`PTs ${props.put_points??''}`} subTitle="You Give">
        <FontAwesome5 name="hand-holding-usd" size={20} color={baseColors.theme} />
      </Label>

      <Label title={`PTs ${props.get_points??''}`} subTitle="You Get">
        <AntDesign name="filetext1" size={22} color={baseColors.theme} />
      </Label>

      <Div alignItems="center" justifyContent="center">
      {props?.is_joined?  <Button pt={2} pb={3} px={12} fontSize="xs" bg={'grey'} >
        Joined
        </Button>
        :<Button pt={2} pb={3} px={12} fontSize="xs" bg={baseColors.theme} onPress={props.onPressJoin}>
          Joinss
        </Button>}

        {/* <Button pt={2} pb={3} px={12} fontSize="xs" bg={baseColors.theme} onPress={props.onPressJoin}>
          Join
        </Button> */}
      </Div>
    </BetWrapper>
  );
}

function ProgressRing(props: { progress: string; progressOutOf: string }) {
  return (
    <Div h={68} w={68} rounded={34}>
      <Div h={34} w={68} bg={baseColors.yellowPrimary} px={12} pt={12} roundedTop={34}>
        <Div h={22} w={44} bg={baseColors.white} roundedTop={21} alignItems="center" justifyContent="center" pt={5}>
          <Text fontWeight="700" fontSize={12} color={baseColors.black}>
            {props.progress}
          </Text>
        </Div>
      </Div>

      <Div h={34} w={68} bg={baseColors.yellowPrimary + '64'} px={12} pb={12} roundedBottom={34}>
        <Div h={22} w={44} bg={baseColors.white} roundedBottom={21} alignItems="center" justifyContent="center" pb={5}>
          <Text fontWeight="700" fontSize={12} color={baseColors.yellowPrimary}>
            {'/' + props.progressOutOf}
          </Text>
        </Div>
      </Div>
    </Div>
  );
}

export function ActivebetSingle(props: ActivebetSingleData) {
  return (
    <BetWrapper colorType={props.colorType} goal={props.goal}>
      <Label title={`PTs ${props.pointsYouPay}`} subTitle="You Paid">
        <FontAwesome5 name="hand-holding-usd" size={20} color={baseColors.theme} />
      </Label>

      <Label title={`PTs ${props.pointsYouGet}`} subTitle="You Get">
        <AntDesign name="filetext1" size={22} color={baseColors.theme} />
      </Label>

      <Div alignItems="center" justifyContent="center" flexDir="row">
        <Div borderRightColor={baseColors.theme} borderRightWidth={1} h={60} mr={32} />
        <ProgressRing progress={props.progress} progressOutOf={props.progressOutOf} />
      </Div>
    </BetWrapper>
  );
}

export function PreviousBetSingle(props: PreviousBetSingleData) {
  return (
    <BetWrapper colorType={props.colorType} goal={props.goal}>
      <Label title={props.goalNumber} subTitle="Completed 5 days">
        <FontAwesome5 name="hand-holding-usd" size={20} color={baseColors.theme} />
      </Label>

      <Label title={`PTs ${props.pointsYouPay}`} subTitle="You Gave">
        <FontAwesome5 name="hand-holding-usd" size={20} color={baseColors.theme} />
      </Label>

      <Label title={props.pointsYouGet} subTitle={props.result === 'win' ? 'You Won' : 'You Lost'}>
        <FontAwesome5 name="hand-holding-usd" size={20} color={baseColors.theme} />
      </Label>
    </BetWrapper>
  );
}
