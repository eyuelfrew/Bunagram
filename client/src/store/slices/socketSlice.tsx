// src/store/slices/socketSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { SocketState } from "../../types/Types";

const initialState: SocketState = {
  socket: null,
  connected: false,
  onlineUsers: [],
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket(state, action) {
      state.socket = action.payload;
      state.connected = true;
    },
    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
    clearSocket(state) {
      state.socket = null;
      state.connected = false;
      state.onlineUsers = [];
    },
  },
});

export const { setSocket, setOnlineUsers, clearSocket } = socketSlice.actions;
export default socketSlice.reducer;
