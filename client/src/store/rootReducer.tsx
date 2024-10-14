import { combineReducers } from "@reduxjs/toolkit";
import LoginReducer from "./reducers/loginReducer";
import receiverReducer from "./reducers/reciverReducer";
import menuReducer from "./reducers/menuReducer";
import UserReducers from "./reducers/userReducer";
import ContactMenuReducer from "./reducers/ContactMenuReducer";
import ProfileReducer from "./reducers/profileReducer";
import SetingReducer from "./reducers/settingReducer";
import themeSlice from "./themes/themeSlice";
export const RootReducer = combineReducers({
  LoginReducer,
  UserReducers,
  receiverReducer,
  menuReducer,
  ContactMenuReducer,
  ProfileReducer,
  SetingReducer,
  theme: themeSlice,
});
