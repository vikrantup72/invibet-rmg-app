import { useEffect } from "react";
import { useAuthValue } from "../atoms/auth";
import Loader from "../components/Loader";
import { LoggedInStackRoutes } from "./loggedIn";
import { LoggedOutStackRoutes } from "./loggedOut";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import messaging, {
  AuthorizationStatus,
} from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";
import { SaveFcm } from "../redux/Reducers/userData";

export function Router(): React.JSX.Element {
  const { auth } = useSelector((state) => state?.userData);
  const { loader } = useSelector((state) => state?.tempData);
  const dispatch = useDispatch();

  async function requestPermission() {
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
      console.log("Notification permissions denied");
    } else if (
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED
    ) {
      console.log("Notification permissions already granted");
      GetFcmToken();
    }
  }

  useEffect(() => {
    requestPermission();
  }, []);

  const GetFcmToken = async () => {
    const authorizationStatus = await messaging().requestPermission();
    console.log("authoriztion ====", authorizationStatus);
    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      const token = await messaging().getToken();
      console.log("fcmmm token-=-", token);
      if (token && auth && token) {
        // AsyncStorage.setItem("fcmToken", token);
        // setDeviceToken(token);
        dispatch(SaveFcm(token));
      }
    } else {
      return "";
    }
  };
  return (
    <NavigationContainer>
      {auth ? <LoggedInStackRoutes /> : <LoggedOutStackRoutes />}
      {loader && <Loader />}
      <Toast />
    </NavigationContainer>
  );
}
