import { Recevier } from "../../types/Types";
import {
  CLEAR_RECEVIER_STATE,
  GET_RECEVER_INIT,
  UPDATE_RECIVER_INFO,
} from "../actions/actionTypes";

const initState: Recevier = {
  full_name: "",
  rece_email: "",
  conversation_id: "",
  messageByUser: "",
  profile_pic: "",
  recever_id: "",
  sender_id: "",
};
const receiverReducer = (
  state = initState,
  action: { type: string; payload: Recevier }
) => {
  switch (action.type) {
    case GET_RECEVER_INIT:
      return { ...state, ...action.payload };
    case UPDATE_RECIVER_INFO:
      return { ...state, conversation_id: action.payload };
    case CLEAR_RECEVIER_STATE:
      return initState;
    default:
      return state;
  }
};
export default receiverReducer;
