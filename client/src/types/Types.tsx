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
  profile_pic: string;
  token: string;
  onLineUsers: string[];
  SocketConnection: Socket | null;
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
export interface Recevier {
  full_name: string;
  rece_email: string;
  conversation_id: string;
  messageByUser: string;
  profile_pic: string;
  recever_id: string;
  sender_id: string;
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
