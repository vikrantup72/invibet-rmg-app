import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

export type AuthData = {
  mobileNumber: string;
  name: string;
  otp: string;
};

const authDataDefaultState: AuthData = {
  mobileNumber: '',
  name: '',
  otp: '',
};

export const authDataAtom = atom<AuthData>({
  key: 'authDataAtom',
  default: authDataDefaultState,
});

export const useAuthDataValue = () => useRecoilValue(authDataAtom);

export const useSetAuthDataValue = () => useSetRecoilState(authDataAtom);

export const useAuthDataState = () => useRecoilState(authDataAtom);
