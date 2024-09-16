import {
  CLOSE_SETTING,
  CLOSE_TWO_STEP_VERIFIATION,
  OPEN_SETTING,
  OPEN_TWO_STEP_VERIFIATION,
} from "../actionTypes/actionTypes";

const initState = {
  isSettingView: false,
  isTwoStepVerifiction: false,
};
const SetingReducer = (state = initState, action: { type: string }) => {
  switch (action.type) {
    case OPEN_SETTING:
      return { ...state, isSettingView: true };
    case CLOSE_SETTING:
      return { ...state, isSettingView: false };

    case OPEN_TWO_STEP_VERIFIATION:
      return { ...state, isTwoStepVerifiction: true };
    case CLOSE_TWO_STEP_VERIFIATION:
      return { ...state, isTwoStepVerifiction: false };
    default:
      return state;
  }
};
export default SetingReducer;
