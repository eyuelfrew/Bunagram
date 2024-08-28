import { call, takeEvery, put } from "redux-saga/effects";
import { LOGIN_USER_INIT, LoginUserInitAction } from "../actions/actionTypes";
import axios, { AxiosResponse } from "axios";
import { loginFaild, loginSuccess } from "../actions/login";

function* loginUser(action: LoginUserInitAction) {
  try {
    const response: AxiosResponse = yield call(
      axios.post,
      `${import.meta.env.VITE_BACK_END_URL}/api/login`,
      action.payload,
      { withCredentials: true }
    );
    if (response.data?.success) {
      localStorage.setItem("token", response.data?.token);
      yield put(loginSuccess(response.data?.user));
    }
    if (response.data?.notFound) {
      yield put(loginFaild(response.data?.message));
    }
    if (response.data?.notVerified) {
      yield put(loginFaild(response.data?.message));
    }
  } catch (error) {
    return console.log(error);
  }
}

export default function* loginSaga() {
  yield takeEvery<LoginUserInitAction>(LOGIN_USER_INIT, loginUser);
}
// const response: AxiosResponse = await axios.post(`${URL}/api/login`, Form);
// console.log(response);
// if (response.data.notVerified) {
//   return alert("Wrong Password");
// }
// if (response.data.success) {
//   localStorage.setItem("token", response?.data?.success);
//   return alert("Login Success");
// }
// if (response.data.notFound) {
//   return alert("User Not Found");
// }
