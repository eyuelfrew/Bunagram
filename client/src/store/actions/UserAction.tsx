import { User } from "../../types/Types";
import { SET_USER, RESET_USER } from "../actionTypes/actionTypes";

export const SetUserInfo = (payload: User) => {
  return { type: SET_USER, payload: payload };
};
export const ResetUserInfo = () => {
  return { type: RESET_USER };
};
