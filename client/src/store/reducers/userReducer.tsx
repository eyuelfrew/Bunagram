import { User } from "../../types/Types";
import { SET_USER, RESET_USER } from "../actionTypes/actionTypes";

const initState: User = {
  _id: "",
  name: "",
  email: "",
  isVerified: null,
  profile_pic: "",
  user_name: "",
  bio: "",
  phone_number: "",
  blockedUsers: [],
  public_id: "",
  lastSeen: "",
  twoStepVerification: false,
};
const UserReducers = (
  state = initState,
  action: { type: string; payload: User }
) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, ...action.payload };
    case RESET_USER:
      return { ...initState };
    default:
      return state;
  }
};
export default UserReducers;
