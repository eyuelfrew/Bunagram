import { all, fork } from "redux-saga/effects";

import getUserInfoSaga from "./sagas/getUserDetalSaga";
import LoginSaga from "./sagas/LoginSaga";

export default function* RootSaga() {
  yield all([fork(LoginSaga), fork(getUserInfoSaga)]);
}
