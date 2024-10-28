import React, { createContext, useContext, useState, ReactNode } from "react";
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
  onlineUsers: string[];
  sidebar: boolean;
  setOnlineUsers: React.Dispatch<React.SetStateAction<string[]>>;
  clearSocketState: () => void;
  toggleSideBar: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);
export const UseSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [sidebar, setSideBar] = useState<boolean>(false);

  const clearSocketState = () => {
    setSocket(null);
    setOnlineUsers([]);
  };
  const toggleSideBar = () => {
    console.log("Test");
    setSideBar(!sidebar);
  };
  return (
    <SocketContext.Provider
      value={{
        socket,
        setSocket,
        onlineUsers,
        setOnlineUsers,
        clearSocketState,
        sidebar,
        toggleSideBar,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
