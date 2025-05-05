import Toast from 'react-native-toast-message';

const AppUtils = {
  //Phone validation
  validatePhone: (phone) => {
    var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  },

  //Email validation
  validateEmail: (email) => {
    const regexp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
  },

  // Toast
  showToast: (text) => {
    Toast.show(text);
  },

  // LOG
  showLog: (message, ...optionalParams) => {
   console.log(message, ...optionalParams);
  },

    showToast: message => {
      Toast.show({
        type: 'success',
        text1: message,
      });
    },
    showToast_error: (message,message2) => {
      Toast.show({
        type: 'error',
        text1: message,
        text2:message2??''
      });
    },


};

export default AppUtils;
