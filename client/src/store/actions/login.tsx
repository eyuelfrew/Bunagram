import {
  INIT_LOGIN_REQUEST,
  LOGIN_FAILD,
  LOGIN_SUCCESS,
  LOGOUT_REQUEST,
  ACCOUNT_NOT_FOUND,
  RESET_LOGIN_STATE,
} from "../actionTypes/actionTypes";

export const LoginRequest = (payload: { email: string; password: string }) => {
  return { type: INIT_LOGIN_REQUEST, payload: payload };
};
export const LoginSuccess = () => {
  return { type: LOGIN_SUCCESS };
};

export const LogoutReq = () => {
  return { type: LOGOUT_REQUEST };
};

export const LoginError = (payload: unknown) => {
  return { type: LOGIN_FAILD, payload: payload };
};

export const NoAccountError = () => {
  return { type: ACCOUNT_NOT_FOUND };
};

export const ResetLoginState = () => {
  console.log("RESTED!");
  return { type: RESET_LOGIN_STATE };
};
