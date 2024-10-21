import {
  ACCOUNT_NOT_FOUND,
  RESET_LOGIN_STATE,
  ACCOUNT_LOCKED,
  TWO_STEP_ENABLED,
} from "../actionTypes/actionTypes";

export const NoAccountError = () => {
  return { type: ACCOUNT_NOT_FOUND };
};

export const ResetLoginState = () => {
  return { type: RESET_LOGIN_STATE };
};
export const AccountLocked = () => {
  return { type: ACCOUNT_LOCKED };
};

export const TwoStepVerification = () => {
  return { type: TWO_STEP_ENABLED };
};
