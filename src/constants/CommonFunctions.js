import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { useAsyncStorage } from "../hooks/useAsyncStorage";
import { useSetAuthValue } from "../atoms/auth";
import { setAuthRedux, setToken } from "../redux/Reducers/userData";
import { useNavigation } from "@react-navigation/native";



export const HandleJoinPool = () => {
    // Show confirmation alert
    Alert.alert(
        'Confirm Pool Join',
        'Are you sure you want to join this pool?',
        [
            {
                text: 'Cancel',
                onPress: () => console.log('Join canceled'),
                style: 'cancel',
            },
            {
                text: 'Yes',
                onPress: () => {
                    console.log('User joined the pool');
                    // Here you can add logic to actually join the pool
                },
            },
        ],
        { cancelable: false }
    );
};


export const HandlePress = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch();
    const { getString } = useAsyncStorage();
    const setAuth = useSetAuthValue();
    const asyncStorage = useAsyncStorage();
    setAuth(prev => ({ ...prev, isAuthenticated: false }));
    dispatch(setToken(''));
    dispatch(setAuthRedux(false));
    // @ts-ignore
    navigation.navigate({ key: 'mobileInput', name: 'mobileInput' });
}

export const maskNumber = (number) => {
    if (!number || number.length < 4) return '-'; // Handle invalid inputs
    return `${number.slice(0, 2)}XXXXXX${number.slice(-2)}`;
};


export const CalculateWinningPrice = (price, member) => {
    let totalPrice = parseInt(member * price)
    let deduction = parseInt((price * member * 15) / 100)
    let winningAmount = parseInt(totalPrice - deduction)

    return { totalPrice, deduction, winningAmount }
}