import {
  ACCOUNT_LOCKED,
  ACCOUNT_NOT_FOUND,
  INIT_LOGIN_REQUEST,
  LOGIN_FAILD,
  LOGIN_SUCCESS,
  LOGOUT_REQUEST,
  RESET_LOGIN_STATE,
  TWO_STEP_ENABLED,
} from "../actionTypes/actionTypes";

const init_State = {
  isLoading: false,
  user: null,
  error: null,
  LoginStatus: null,
  errorMsg: "",
  account_not_found: null,
  isLocked: false,
  isTwoStep: false,
};
const LoginReducer = (
  state = init_State,
  action: { type: string; payload: unknown }
) => {
  switch (action.type) {
    case INIT_LOGIN_REQUEST:
      return { ...state, isLoading: true, error: null, isLocked: false };
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
      return {
        ...state,
        isLoading: false,
        LoginStatus: false,
        account_not_found: false,
        isLocked: false,
        isTwoStep: false,
      };
    case ACCOUNT_LOCKED:
      return {
        ...state,
        isLoading: false,
        LoginStatus: false,
        account_not_found: false,
        isLocked: true,
      };
    case TWO_STEP_ENABLED:
      return {
        ...state,
        isLoading: false,
        LoginStatus: false,
        account_not_found: false,
        isTwoStep: true,
      };
    default:
      return state;
  }
};
export default LoginReducer;
