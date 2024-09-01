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

/*
---- Open Contact info modal action
*/
export const OpenConactInfo = () => {
  return { type: OPEN_CONTACT_INFO };
};

/*
---- Close Contact info modal action
*/
export const CloseContactInfo = () => {
  return { type: CLOSE_CONTACT_INFO };
};

/* 
--- Open Edit Name Modal
*/
export const OpenEditName = () => {
  return { type: OPEN_EDIT_NAME };
};

/*
--- Close Edit Name Modal
*/

export const CloseEditName = () => {
  return { type: CLOSE_EDIT_NAME };
};

/*
--- Open Edit Phone Modal
*/
export const OpenEditPhone = () => {
  return { type: OPEN_EDIT_PHONE };
};

/*
--- Close Edit Phone Modal
*/
export const CloseEditPhone = () => {
  return { type: CLOSE_EDIT_PHONE };
};

/*
--- Open Edit User Name Modal
*/
export const OpenEditUserName = () => {
  return { type: OPEN_USERNAME_EDIT };
};

/*
--- Close Edit User Name Modal
*/
export const CloseEditUserName = () => {
  return { type: CLOSE_USERNAME_EDIT };
};

/*
--- Open Delete Account Modal
*/

export const OpenDeleteAccount = () => {
  return { type: OPEN_DELETE_ACCOUNT };
};

/*
-- Close Delete Account Modal
*/
export const CloseDeleteAccount = () => {
  return { type: CLOSE_DELETE_ACCOUNT };
};
