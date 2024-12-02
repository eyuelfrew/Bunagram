import { Socket } from "dgram";
//login form types
export interface LoginForm {
  email: string;
  password: string;
}

// loged in uer types
export interface User {
  _id: string;
  name: string;
  email: string;
  isVerified: null;
  profile_pic: string;
  user_name: string;
  bio: string;
  hint: string;
  phone_number: string;
  blockedUsers: string[];
  public_id: string;
  lastSeen: string;
  twoStepVerification: boolean;
  createdAt: string;
  deletedAccount: boolean;
  banded: boolean;
}
export interface UserState {
  user: User;
  isLoading: boolean;
  error: string;
}

export interface LogingState {
  isLoading: boolean;
  error: string;
  login: boolean;
  socket: null;
}

// recevier type
export interface RecevierType {
  full_name: string;
  rece_email: string;
  conversation_id: string;
  messageByUser: string;
  profile_pic: string;
  user_name: string;
  recever_id: string;
  phone_number: string;
  sender_id: string;
  bio: string;
  lastSeen: string;
  blockedUsers: string[];
  deletedAccount: boolean;
  createdAt: string;
}

export interface SocketState {
  socket: Socket | null;
  connected: boolean;
  onlineUsers: string[];
}

export interface Message {
  text: string;
  createdAt: string;
  msgByUserId: string;
  seen: boolean;
  updatedAt: string;
  imageURL: string;
  videoURL: string;
  __v: number;
  _id: string;
}

export interface Conversation {
  lastMessage: Message;
  receiver: User;
  sender: User;
  unseenMessages: number;
  _id: string;
}

export interface MenuBar {
  isView: boolean;
}

export interface ContactMenu {
  isContactOpen: boolean;
  isEditNameOpen: boolean;
  isPhoneEdit: boolean;
  isUserNameEdit: boolean;
  isDeleteAccount: boolean;
}
export interface ThemeState {
  darkMode: boolean;
}
