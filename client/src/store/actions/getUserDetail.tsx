import { User } from "../../types/Types";
import {
  GET_USER_DETAIL_SUCCESS,
  GET_USER_DETAIL_INT,
  SET_SOCKET_CONNECTION_SUCCESS,
} from "../actionTypes/actionTypes";

export const getUserDetail = () => {
  return { type: GET_USER_DETAIL_INT };
};
export const userDetaiSuccess = (payload: User) => {
  return { type: GET_USER_DETAIL_SUCCESS, payload: payload };
};
export const getSocketConnection = (payload: unknown) => {
  return { type: SET_SOCKET_CONNECTION_SUCCESS, payload: payload };
};
