import {
  CLOSE_VIEW_PROFILE,
  OPEN_VIEW_PROFILE,
} from "../actionTypes/actionTypes";

const initState = {
  isviewProfile: false,
};
const ProfileReducer = (state = initState, action: { type: string }) => {
  switch (action.type) {
    case OPEN_VIEW_PROFILE:
      return { ...state, isviewProfile: true };
    case CLOSE_VIEW_PROFILE:
      return { ...state, isviewProfile: false };
    default:
      return state;
  }
};

export default ProfileReducer;
