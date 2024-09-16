import {
  CLOSE_SETTING,
  CLOSE_TWO_STEP_VERIFIATION,
  OPEN_SETTING,
  OPEN_TWO_STEP_VERIFIATION,
} from "../actionTypes/actionTypes";

export const OpenSetting = () => {
  return { type: OPEN_SETTING };
};
export const CloseSetting = () => {
  return { type: CLOSE_SETTING };
};

export const OpenTwoStepVerification = () => {
  return { type: OPEN_TWO_STEP_VERIFIATION };
};
export const CloseTwoStepVerification = () => {
  return { type: CLOSE_TWO_STEP_VERIFIATION };
};
