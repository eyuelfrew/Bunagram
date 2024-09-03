import { all, fork } from "redux-saga/effects";

import LoginSaga from "./sagas/LoginSaga.tsx";

export function* RootSaga() {
  yield all([fork(LoginSaga)]);
}
