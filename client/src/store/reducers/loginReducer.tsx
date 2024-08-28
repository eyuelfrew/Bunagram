import { LogingState } from "../../types/Types";
import {
  LOGIN_USER_FAILD,
  LOGIN_USER_INIT,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
} from "../actions/actionTypes";

const initialState: LogingState = {
  isLoading: false,
  error: "",
  login: false,
  socket: null,
};
const setLoginReducer = (
  state = initialState,
  action: { type: string; payload: unknown }
) => {
  switch (action.type) {
    case LOGIN_USER_INIT:
      return { ...state, isLoading: true };
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        login: true,
      };
    case LOGIN_USER_FAILD:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case LOGOUT_USER:
      return { ...state, login: false };
    default:
      return state;
  }
};
export default setLoginReducer;
