import { ContactMenu } from "../../types/Types";
import {
  OPEN_CONTACT_INFO,
  CLOSE_CONTACT_INFO,
  OPEN_EDIT_NAME,
  CLOSE_EDIT_NAME,
  OPEN_EDIT_PHONE,
  CLOSE_EDIT_PHONE,
  OPEN_USERNAME_EDIT,
  CLOSE_USERNAME_EDIT,
  OPEN_DELETE_ACCOUNT,
  CLOSE_DELETE_ACCOUNT,
} from "../actionTypes/actionTypes";

const initState: ContactMenu = {
  isContactOpen: false,
  isEditNameOpen: false,
  isPhoneEdit: false,
  isUserNameEdit: false,
  isDeleteAccount: false,
};
const ContactMenuReducer = (state = initState, action: { type: string }) => {
  switch (action.type) {
    case OPEN_CONTACT_INFO:
      return { ...state, isContactOpen: true };
    case CLOSE_CONTACT_INFO:
      return { ...state, isContactOpen: false };
    case OPEN_EDIT_NAME:
      return { ...state, isEditNameOpen: true };
    case CLOSE_EDIT_NAME:
      return { ...state, isEditNameOpen: false };
    case OPEN_EDIT_PHONE:
      return { ...state, isPhoneEdit: true };
    case CLOSE_EDIT_PHONE:
      return { ...state, isPhoneEdit: false };
    case OPEN_USERNAME_EDIT:
      return { ...state, isUserNameEdit: true };
    case CLOSE_USERNAME_EDIT:
      return { ...state, isUserNameEdit: false };
    case OPEN_DELETE_ACCOUNT:
      return { ...state, isDeleteAccount: true };
    case CLOSE_DELETE_ACCOUNT:
      return { ...state, isDeleteAccount: false };
    default:
      return state;
  }
};

export default ContactMenuReducer;
