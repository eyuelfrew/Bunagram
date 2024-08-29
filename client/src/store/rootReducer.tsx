import { combineReducers } from "@reduxjs/toolkit";
import LoginReducer from "./reducers/LoginReducer";
import userReducer from "./reducers/userReducer";
import receiverReducer from "./reducers/reciverReducer";
import socketReducer from "./slices/socketSlice";
import menuReducer from "./reducers/menuReducer";
const RootReducer = combineReducers({
  LoginReducer,
  userReducer,
  receiverReducer,
  menuReducer,
  socket: socketReducer,
});

export default RootReducer;
