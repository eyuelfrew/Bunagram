import { call, put, takeLatest } from "redux-saga/effects";

import axios, { AxiosResponse } from "axios";

import { SetUserInfo } from "../actions/UserAction";
import { LoginSuccess, NoAccountError, LoginError } from "../actions/login";
import { INIT_LOGIN_REQUEST } from "../actionTypes/actionTypes";

export interface LoginAction {
  type: string;
  payload: { email: string; password: string };
}
function* login(action: LoginAction) {
  try {
    const response: AxiosResponse = yield call(
      axios.post,
      `${import.meta.env.VITE_BACK_END_URL}/api/login`,
      action.payload,
      { withCredentials: true }
    );
    if (response.data?.status === 1) {
      localStorage.setItem("token", response.data?.token);
      yield put(LoginSuccess());
      yield put(SetUserInfo(response.data?.user));
    } else if (response.data?.notFound) {
      yield put(NoAccountError());
    } else if (response.data?.status === 0) {
      yield put(LoginError(response.data?.message));
    }
  } catch (error) {
    yield console.log(error);
  }
}

export default function* LoginSaga() {
  yield takeLatest(INIT_LOGIN_REQUEST, login);
}
