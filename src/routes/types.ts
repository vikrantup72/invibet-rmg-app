export type LoggedInStackParamsList = {
  questionOne: {};
  questionTwo: {};
  questionThree: {};
  questionFour: {};
  questionFive: {};
  questionSix: {};
  questionWhatToDo: {};
  Setup: {};
  ConnectingDevice: { product: any }; 
  DeviceSetup: undefined;

  'product/detail': {};
  'product/whatSettingUp': {};
  'product/tnc': {};

  bettingTabs: {};
  betDetail: { betId: string };
  EditProfile: {  };
};

export type LoggedInBettingTabsParamsList = {
  'betting/home': {};
  'betting/myBets': {};
  'betting/shop': {};
  'betting/profile': {};
  'betting/add': {};
};

export type LoggedOutStackParamsList = {
  mobileInput: {};
  mobileInputUserRegister: {};
  nameInput: {};
  otp: {};
  termsAndConditions: {};
  welcome: {};
};
