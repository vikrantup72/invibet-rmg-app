import { get_user_detail, recharge_wallet, saveDeviceActivity, saveFcm, wallet } from '../../api/Services/services';
import { createSlice } from '@reduxjs/toolkit';
import { store } from '../Store/store';

export const userDataSlice = createSlice({
  name: 'userData',
  initialState: {
    auth: false,
    token: '',
    user: {},
    deviceAddress: '', //connected watch id ,
    deviceActivity: { step: -1, distance: -1, calories: -1 },
    isConnnected: false,
    isSkipped: false,
    wallet: {},
    currentAppVersion: 8
  },
  reducers: {
    setAuthRedux: (state, action) => {
      state.auth = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setDeviceAddress: (state, action) => {
      state.deviceAddress = action.payload;
    },
    setDeviceActivity: (state, action) => {
      state.deviceActivity = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnnected = action.payload;
    },
    setIsSkipped: (state, action) => {
      state.isSkipped = action.payload;
    },
    setWallet: (state, action) => {
      state.wallet = action.payload;
    },
    setCurrentAppVersion: (state, action) => {
      state.currentAppVersion = action.payload;
    },
  },
});
export const { setAuthRedux, setUser, setToken, setDeviceAddress, setDeviceActivity, setIsConnected, setIsSkipped, setWallet, setCurrentAppVersion } = userDataSlice.actions;

export default userDataSlice.reducer;

//*********** get user profile ****************
export const Get_user_detail = () => {
  return async dispatch => {
    try {
      let { token } = store.getState().userData
      get_user_detail(token).then(res => {
        // console.log('userdetilal toiken response==>',token)
        // console.log('userData res-==-', res)
        if (res?.status == 200) {
          dispatch(setUser(res?.data?.data));
          return res?.data?.data
        }
      });
    } catch (error) {
      console.log('error while gettting user input redux-=-==', error)
    } finally {
    }
  };
};

//*********** get wallet detail ****************
export const Get_wallet = (user_id, token) => {
  return async dispatch => {
    try {
      wallet(user_id, token).then((res) => {
        // console.log('response-= get wallet redux====', res);
        if (res?.status == 200) {
          dispatch(setWallet(res?.data?.wallet))
        }
      });
    } catch (error) {
    } finally {
    }
  }
};


export const SaveFcm = (fcmToken) => {
  return async dispatch => {
    try {
      console.log('thunk -=-', fcmToken)
      let { token } = store.getState().userData
      const body = {
        fcm_token: fcmToken
      }
      let res = await saveFcm(body, token)
      console.log('response save fcm-=->', res)
    }
    catch (error) {
      console.log('error while saving fcm api', error)
    }
  }
}