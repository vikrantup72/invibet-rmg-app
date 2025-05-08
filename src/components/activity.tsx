import {
  GoalFireIcon,
  GoalWalkingIcon,
} from "../routes/loggedIn/bettingTabs/icons";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Div, Text } from "react-native-magnus";
import { getHealthData } from "../api/Services/services";

export function Label(props: { Icon: any; value: any; label: any }) {
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
export function Activity({ token }) {
  const [activityData, setActivityData] = useState(null);

  const getHealthStepsData = async () => {
    const result = await getHealthData(token);
    if (result?.data) {
      setActivityData(result?.data?.data);
    }
  };

  useEffect(() => {
    if (token) {
      getHealthStepsData();
    }
  }, []);

  return (
    <View>
      <Div row mt={25} justifyContent="space-around">
        <Label
          Icon={GoalWalkingIcon}
          label="Steps"
          value={activityData?.steps || 0}
        />
        <Label
          Icon={GoalFireIcon}
          label="Calories"
          value={activityData?.calories || 0}
        />
      </Div>
    </View>
  );
}
