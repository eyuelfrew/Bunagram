import { all, fork } from "redux-saga/effects";

import LoginSaga from "./sagas/LoginSaga";

export default function* RootSaga() {
  yield all([fork(LoginSaga)]);
}
