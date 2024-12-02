import { RecevierType } from "../../types/Types";
import {
  CLEAR_RECEVIER_STATE,
  GET_RECEVER_INIT,
  UPDATE_RECIVER_INFO,
} from "../actionTypes/actionTypes";

export const getReceiverInit = (payload: RecevierType) => {
  return { type: GET_RECEVER_INIT, payload: payload };
};
export const updateReceiver = (payload: string) => {
  return {
    type: UPDATE_RECIVER_INFO,
    payload: payload,
  };
};
export const clearReciver = () => {
  return { type: CLEAR_RECEVIER_STATE };
};
