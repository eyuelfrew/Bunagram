import { User, UserState } from "../../types/Types";
import {
  GET_USER_DETAIL_INT,
  GET_USER_DETAIL_SUCCESS,
  SET_SOCKET_CONNECTION_SUCCESS,
} from "../actionTypes/actionTypes";

const initialUserState: User = {
  _id: "",
  name: "",
  email: "",
  profile_pic: "",
  token: "",
  onLineUsers: [],
  SocketConnection: null,
};
const initialState: UserState = {
  user: initialUserState,
  isLoading: false,
  error: "",
};
const userReducer = (
  state = initialState,
  action: { type: string; payload: User }
) => {
  switch (action.type) {
    case GET_USER_DETAIL_INT:
      return { ...state, isLoading: true };
    case GET_USER_DETAIL_SUCCESS:
      return { ...state, user: action.payload, isLoading: false };
    case SET_SOCKET_CONNECTION_SUCCESS:
      return { ...state, SocketConnection: action.payload };
    default:
      return state;
  }
};
export default userReducer;
