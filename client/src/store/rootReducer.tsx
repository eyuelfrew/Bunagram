import { combineReducers } from "@reduxjs/toolkit";
import LoginReducer from "./reducers/loginReducer";
import menuReducer from "./reducers/menuReducer";
import UserReducers from "./reducers/userReducer";
import ContactMenuReducer from "./reducers/ContactMenuReducer";
import ProfileReducer from "./reducers/profileReducer";
import SetingReducer from "./reducers/settingReducer";
import themeSlice from "./themes/themeSlice";
import ReceiverReducer from "./reducers/reciverReducer.tsx";
export const RootReducer = combineReducers({
  LoginReducer,
  UserReducers,
  ReceiverReducer,
  menuReducer,
  ContactMenuReducer,
  ProfileReducer,
  SetingReducer,
  theme: themeSlice,
});
