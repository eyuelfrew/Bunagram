import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { RootReducer } from "./rootReducer";
import { RootSaga } from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: RootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["your/action/type"],
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        ignoredPaths: ["items.dates"],
      },
    }).concat(sagaMiddleware),
});
sagaMiddleware.run(RootSaga);
export type Root_State = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
