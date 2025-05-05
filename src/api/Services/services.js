import api from '../Manager/manager';
import { endpoints } from '../Services/endpoints';

export const get_user_detail = async token => {
  return api.get(endpoints.user_profile, {}, { headers: { Authorization: token, 'Content-Type': 'application/json' } });
};

export const joinBet = async (body, token, userId) => {
  const updatedBody = { ...body };
  return api.post(`${endpoints.joinBet}?user_id=${userId}`, updatedBody, { headers: { Authorization: token } });
};

export const getMyBets = async (userId, token) => {
  return api.get(`${endpoints.myBet}${userId??''}`, {}, { headers: { Authorization: token } });
};

export const update_profile = async (body, token) => {
  return api.put(`${endpoints.editProfile}`, body, { headers: { Authorization: token } });
};

export const addDevice = async (body, token) => {
  return api.post(`${endpoints.addDevice}`, body, { headers: { Authorization: token } });
};

export const getSavedDevices = async (userId, token) => {
  return api.get(`${`profile/${userId}/devices`}`, {}, { headers: { Authorization: token } });
};

export const saveDeviceActivity = async (body, token) => {
  return api.post('login/data', body, {
    headers: { Authorization: token },
  });
};

// Stats
export const getUserActivity = async (userId, token) => {
  return api.get(
    `profile/user_activity/${userId}`,
    {},
    {
      headers: { Authorization: token },
    },
  );
};

// Wallet
export const wallet = async (userId, token) => {
  return api.get(
    `wallet/${userId}`,
    {},
    {
      headers: { Authorization: token },
    },
  );
};

// Cash Transaction
export const CashTransaction = async token => {
  try {
    const response = await api.get(
      '/wallet/transactions',
      {},
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      },
    );

    // Add debug logging

    if (response?.data?.data) {
      return {
        data: response.data.data,
      };
    } else {
      console.log('Unexpected API response structure:', response);
      return { data: [] };
    }
  } catch (error) {
    console.error('CashTransaction API Error:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
    });
    throw error;
  }
};
// Track order
export const getTrackingStatus = async (userId, token) => {
  try {
    if (!userId) {
      console.error('userId is missing or invalid');
      return;
    }

    const response = await api.get(`shop/track/${userId}`, {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tracking status:', error);
    throw error;
  }
};

// Recharge Wallet

export const recharge_wallet = async (body, token) => {
  return api.post(`${endpoints.recharge_wallet}`, body, { headers: { Authorization: `${token}` } });
};

// Pick of the Day

export const pickOfTheDay = async token => {
  return api.get(
    `bets/pick-of-the-day`,
    {},
    {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    },
  );
};

//Ecommerce

export const getAllProducts = async token => {
  return api.get(endpoints?.productList, {}, { headers: { Authorization: token } });
};

export const getProduct_detail = async (id, token) => {
  return api.get(`${endpoints?.productList}/${id}`, {}, { headers: { Authorization: token } });
};

export const getCoupons = async token => {
  return api.get(`${endpoints?.coupons}`, {}, { headers: { Authorization: token } });
};

export const addToCart = async (body, token) => {
  return api.post(`${endpoints.addCart}`, body, { headers: { Authorization: token } });
};

export const checkout = async (body, token) => {
  return api.post(`${endpoints.checkout}`, body, { headers: { Authorization: token } });
};

export const getRecommended_bet = async token => {
  return api.get(`${endpoints?.recommendedBets}`, {}, { headers: { Authorization: token } });
};

export const getBet_detail = async (bet_id, token) => {
  return api.get(`${endpoints.bets}/${bet_id}`, {}, { headers: { Authorization: token } });
};
export const getBet_detail_LeaderBoard = async (bet_id, token) => {
  return api.get(`${endpoints.leaderboard}/${bet_id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
};


export const getHealth = async (userId,date, token) => {
  return api.get(`profile/${userId}/health-data?activity_date=${date}`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

// Authentication SEND OTP
export const sendOTP = async body => {
  return api.post('/login/send-otp', body, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// export const login = async (body) => {
//   return api.post(endpoints.login, body);
// };

// export const change_password = async (body,token) => {
//   return api.post(endpoints.change_password, body,{ headers: { Authorization: 'Bearer ' + token } });
// };

// export const update_profile = async (body, token) => {
//   const formdata = new FormData();
//   formdata.append('first_name', body?.first_name)
//   formdata.append('last_name', body?.last_name)
//   formdata.append('user_name', body?.user_name)
//   formdata.append('phone_number', body?.phone_num??'')
//   formdata.append('country_code', body?.country_code)
//   if (typeof (body?.profile_pic) == 'object') {
//     formdata.append('profile_pic', {
//       name:
//         body?.profile_pic?.filename == null
//           ? Date.now() + 'omgitsme.jpg'
//           : body?.profile_pic.filename ?? '',
//       uri: body?.profile_pic?.path ?? '',
//       type: body?.profile_pic?.mime ?? "",
//     });
//   }
//   return api.post(endpoints.update_profile, formdata, { headers: { Authorization: 'Bearer ' + token, 'content-type': 'multipart/form-data' }, });
// };



// ******************* boosters ******************
export const getAllBoosters = async (token) => {
  return api.get(`${endpoints.booster}`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

export const buyBooster = async (body, token) => {
  return api.post(`${endpoints.purchase_booster}`, body, { headers: { Authorization: token, 'Content-Type': 'application/json' } });
};

// export const kycSendotp = async (body, token) => {
//   const formdata = new FormData();
//   formdata.append('first_name', body?.name)
//   formdata.append('last_name', body?.last_name)
//   formdata.append('user_name', body?.user_name)
//   formdata.append('phone_number', body?.phone_num ?? '')
//   formdata.append('country_code', body?.country_code)
//   if (typeof (body?.profile_pic) == 'object') {
//     formdata.append('profile_pic', {
//       name:
//         body?.profile_pic?.filename == null
//           ? Date.now() + 'omgitsme.jpg'
//           : body?.profile_pic.filename ?? '',
//       uri: body?.profile_pic?.path ?? '',
//       type: body?.profile_pic?.mime ?? "",
//     });
//   }
//   return api.post(endpoints.update_profile, formdata, { headers: { Authorization: 'Bearer ' + token, 'content-type': 'multipart/form-data' }, });
// };



// ****************** kyc api's *******************
export const genertate_aadharOtp = async (body, token) => {
  return api.post(`${endpoints.generateAadharOtp}`, body, { headers: { Authorization: token, 'Content-Type': 'application/json' } });
};

export const submitAadharOtp = async (body, token) => {
  return api.post(`${endpoints.submitAadharOtp}`, body, { headers: { Authorization: token, 'Content-Type': 'application/json' } });
};

export const verifyPAN = async (body, token) => {
  return api.post(`${endpoints.verifyPan}`, body, { headers: { Authorization: token, 'Content-Type': 'application/json' } });
};

export const verifyBank = async (body, token) => {
  return api.post(`${endpoints.verifyBank}`, body, { headers: { Authorization: token, 'Content-Type': 'application/json' } });
};

export const withdraw_winnings = async (body, token) => {
  return api.post(`${endpoints.withdraw_winnings}`, body, { headers: { Authorization: token, 'Content-Type': 'application/json' } });
};

export const getAll_bets = async (user_id, token) => {
  return api.get(`${endpoints.all_bets}?user_id=${user_id??''}`, {}, { headers: { Authorization: token, 'Content-Type': 'application/json' } });
};

export const saveFcm = async (body, token) => {
  return api.post(`${endpoints.send_fcm}`, body, { headers: { Authorization: token, 'Content-Type': 'application/json' } });
};
export const getVersion = async ( ) => {
  return api.get(`${endpoints.appVersion}`, {}, {headers: { 'Content-Type': 'application/json' }} );
};

export const updateAppVersion = async (body ) => {
  return api.post(`${endpoints.appVersion}`, body, {headers: { 'Content-Type': 'application/json' }} );
};
