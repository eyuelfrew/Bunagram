import { all, fork } from "redux-saga/effects";

import LoginSaga from "./sagas/loginSaga.tsx";

export function* RootSaga() {
  yield all([fork(LoginSaga)]);
}
