import axios, { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { GET_USER_DETAIL_INT } from "../actions/actionTypes";
import { userDetaiSuccess } from "../actions/getUserDetail";

export default function* getUserInfoSaga() {
  yield takeLatest(GET_USER_DETAIL_INT, getUserInfo);
}
function* getUserInfo() {
  try {
    const response: AxiosResponse = yield call(
      axios.get,
      `${import.meta.env.VITE_BACK_END_URL}/api/user-detail`,
      { withCredentials: true }
    );
    if (response.status == 200) {
      yield put(userDetaiSuccess(response.data.data));
    }
  } catch (error) {
    console.log(error);
  }
}
