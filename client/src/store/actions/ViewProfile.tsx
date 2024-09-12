import {
  CLOSE_VIEW_PROFILE,
  OPEN_VIEW_PROFILE,
} from "../actionTypes/actionTypes";

export const ViewProfile = () => {
  return { type: OPEN_VIEW_PROFILE };
};

export const CloseViewProfile = () => {
  return { type: CLOSE_VIEW_PROFILE };
};
