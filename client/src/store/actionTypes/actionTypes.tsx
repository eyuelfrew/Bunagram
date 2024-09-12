/*
----  User login action types
*/
export const INIT_LOGIN_REQUEST = "INIT_LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILD = "LOGIN_FAILD";
export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const ACCOUNT_NOT_FOUND = "ACCOUNT_NOT_FOUND";
export const RESET_LOGIN_STATE = "RESET_LOGIN_STATE";

/*
-- Loged in user state ations
*/
export const SET_USER = "SET_USER";
export const RESET_USER = "RESET_USER";

//get user detail
export const GET_USER_DETAIL_INT = "GET_USER_DETAIL_INT";
export const GET_USER_DETAIL_SUCCESS = "GET_USER_DETAIL_SUCCESS";

//connection type
export const SET_SOCKET_CONNECTION_INIT = "SET_SOCKET_CONNECTION_INIT";
export const SET_SOCKET_CONNECTION_SUCCESS = "SET_SOCKET_CONNECTION";

export interface SocketConnectionAction {
  type: typeof SET_SOCKET_CONNECTION_INIT;
  payload: string;
}
//test
export const GET_CHAT_USER = "GET_CHAT_USER";
export const SET_CHAT_USER = "SET_CHAT_USER";

// set reiver information action
export const GET_RECEVER_INIT = "GET_RECEVER_INIT";
export const GET_RECEVER_SUCCESS = "GET_RECEVER_SUCCESS";
export const GET_RECEVER_FAILD = "GET_RECEVER_FAILD";
export const UPDATE_RECIVER_INFO = "UPDATE_RECIVER_INFO";
export const CLEAR_RECEVIER_STATE = "CLEAR_RECEVIER_STATE";
//
export const VIEW_MENU_ENABLED = "VIEW_MENU_ENABLED";
export const VIEW_MENU_DISABLE = "VIEW_MENU_DISABLE";

/*
-- Account or Contact info related actions
*/
export const OPEN_CONTACT_INFO = "OPEN_CONTACT_INFO";
export const CLOSE_CONTACT_INFO = "CLOSE_CONTACT_INFO";
export const OPEN_EDIT_NAME = "OPEN_EDIT_NAME";
export const CLOSE_EDIT_NAME = "CLOSE_EDIT_NAME";
export const OPEN_EDIT_PHONE = "OPEN_EDIT_PHONE";
export const CLOSE_EDIT_PHONE = "CLOSE_EDIT_PHONE";
export const OPEN_USERNAME_EDIT = "OPEN_USERNAME_EDIT";
export const CLOSE_USERNAME_EDIT = "CLOSE_USERNAME_EDIT";
export const OPEN_DELETE_ACCOUNT = "OPEN_DELETE_ACCOUNT";
export const CLOSE_DELETE_ACCOUNT = "CLOSE_DELETE_ACCOUNT";

/*

---- View Profile Actions

*/

export const OPEN_VIEW_PROFILE = "OPEN_VIEW_PROFILE";
export const CLOSE_VIEW_PROFILE = "CLOSE_VIEW_PROFILE";
