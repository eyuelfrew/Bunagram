import { combineReducers } from "@reduxjs/toolkit";
import setLoginReducer from "./reducers/loginReducer";
import userReducer from "./reducers/userReducer";
import receiverReducer from "./reducers/reciverReducer";
import socketReducer from "./slices/socketSlice";
import menuReducer from "./reducers/menuReducer";
const RootReducer = combineReducers({
  setLoginReducer,
  userReducer,
  receiverReducer,
  menuReducer,
  socket: socketReducer,
});

export default RootReducer;
