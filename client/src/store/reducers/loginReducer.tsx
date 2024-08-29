import {
  ACCOUNT_NOT_FOUND,
  INIT_LOGIN_REQUEST,
  LOGIN_FAILD,
  LOGIN_SUCCESS,
  LOGOUT_REQUEST,
  RESET_LOGIN_STATE,
} from "../actionTypes/actionTypes";

const init_State = {
  isLoading: false,
  user: null,
  error: null,
  LoginStatus: null,
  errorMsg: "",
  account_not_found: null,
};
const LoginReducer = (
  state = init_State,
  action: { type: string; payload: unknown }
) => {
  switch (action.type) {
    case INIT_LOGIN_REQUEST:
      return { ...state, isLoading: true, error: null };
    case LOGIN_FAILD:
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: action.payload,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
        LoginStatus: true,
      };
    case LOGOUT_REQUEST:
      return { ...state, isLoading: false, LoginStatus: false };
    case ACCOUNT_NOT_FOUND:
      return {
        ...state,
        isLoading: false,
        LoginStatus: false,
        account_not_found: true,
      };
    case RESET_LOGIN_STATE:
      console.log("Some thng is wrong");
      return {
        ...state,
        isLoading: false,
        LoginStatus: false,
        account_not_found: false,
      };
    default:
      return state;
  }
};
export default LoginReducer;
