import { all, fork } from "redux-saga/effects";
import loginSaga from "./sagas/loginSaga";
import getUserInfoSaga from "./sagas/getUserDetalSaga";

export default function* RootSaga() {
  yield all([fork(loginSaga), fork(getUserInfoSaga)]);
}
