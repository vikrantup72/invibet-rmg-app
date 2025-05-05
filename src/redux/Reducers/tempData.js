import { getMyBets } from '../../api/Services/services';
import AppImages from '../../constants/AppImages';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { store } from '../Store/store';
import moment from 'moment';

let currentTime = moment()

const initialState = {
  loader: false,
  saved_devices: '',
  cartData: { productImg: AppImages.product, quantity: 1, name: '', price: '', id: 1, coupon_code: '', coupon_amount: '', coupon_id: '' },
  dehliveryAddress: { flat: '', landmark: '', pincode: '', city: '', state: '' },
  connection_status: { isConnected: false, isConnecting: false },
  myBets: [],
  currentStepData: { step: 0, time: '' }
};

const tempDataSlice = createSlice({
  name: 'tempData',
  initialState,
  reducers: {
    setLoader: (state, action) => {
      state.loader = action.payload;
    },
    setCartData: (state, action) => {
      state.cartData = action.payload;
    },
    setDehliveryAddress: (state, action) => {
      state.dehliveryAddress = action.payload;
    },
    setConnection_status: (state, action) => {
      state.connection_status = action.payload;
    },
    setMyBets: (state, action) => {
      state.myBets = action.payload;
    },
    setCurrentStepData: (state, action) => {
      state.currentStepData = action.payload;
    },
  },
});

export const { setLoader, setCartData, setDehliveryAddress, setConnection_status, setMyBets, setCurrentStepData } = tempDataSlice.actions;

export default tempDataSlice.reducer;

//*********** get saved device ****************
// export const Get_saved_devices = (token) => {
//   return async dispatch => {
//       try {
//           get_user_detail(token).then((res) => {
//               console.log('response-= get profile',res);
//               return
//               if (res?.status==200) {
//                   dispatch(setUser(res?.data?.data))
//               } else {

//               }
//           });
//       } catch (error) {
//       } finally {
//       }
//   }
// };

//*********** get saved device ****************
export const Get_myBets = (user_id, token) => {
  return async dispatch => {
    // console.log('insdide getmybets======')
    try {
      // const users_id = getState()?.user?.id; 
      let { user, token } = store.getState().userData
      getMyBets(user?.id ?? '', token).then((res) => {
        if (res?.status == 200) {
          dispatch(setMyBets(res?.data));
        }
      });
    } catch (error) {
      console.log('error in getting userBets===', error)
    } finally {
    }
  }
};
