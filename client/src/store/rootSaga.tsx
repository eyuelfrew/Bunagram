import { all, fork } from "redux-saga/effects";

import LoginSaga from "./sagas/LoginSaga";

export function* RootSaga() {
  yield all([fork(LoginSaga)]);
}
