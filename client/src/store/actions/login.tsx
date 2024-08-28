import {
  LOGIN_USER_FAILD,
  LOGIN_USER_INIT,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
} from "./actionTypes";
import { LoginForm } from "../../types/Types";
export const login = (Form: LoginForm) => {
  return {
    type: LOGIN_USER_INIT,
    payload: Form,
  };
};
export const loginSuccess = (payload: unknown) => {
  return { type: LOGIN_USER_SUCCESS, payload: payload };
};
export const loginFaild = (payload: unknown) => {
  return { type: LOGIN_USER_FAILD, payload: payload };
};

//
// * Logout User
//
export const logoutAction = () => {
  return { type: LOGOUT_USER };
};
