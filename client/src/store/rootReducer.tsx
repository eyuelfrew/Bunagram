import { combineReducers } from "@reduxjs/toolkit";
import LoginReducer from "./reducers/loginReducer";

import receiverReducer from "./reducers/reciverReducer";

import menuReducer from "./reducers/menuReducer";
import UserReducers from "./reducers/UserReducer";
import ContactMenuReducer from "./reducers/ContactMenuReducer";
export const RootReducer = combineReducers({
  LoginReducer,
  UserReducers,
  receiverReducer,
  menuReducer,
  ContactMenuReducer,
});
