import {
  INIT_LOGIN_REQUEST,
  LOGIN_FAILD,
  LOGIN_SUCCESS,
  LOGOUT_REQUEST,
  ACCOUNT_NOT_FOUND,
  RESET_LOGIN_STATE,
  ACCOUNT_LOCKED,
  TWO_STEP_ENABLED,
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
  return { type: RESET_LOGIN_STATE };
};
export const AccountLocked = () => {
  return { type: ACCOUNT_LOCKED };
};

export const TwoStepVerification = () => {
  return { type: TWO_STEP_ENABLED };
};
