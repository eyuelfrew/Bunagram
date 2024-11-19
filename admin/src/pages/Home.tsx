import { Routes, Route } from "react-router-dom";
import Statistics from "./Statistics";
import Graphs from "./Graphs";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { UseSocket } from "../context/SocketProvider";
import ComplientList from "../components/ComplientList";
import Complaint from "./Complaint";
import Users from "./Users";

const Home = () => {
  const { setSocket, setOnlineUsers, clearSocketState, toggleSideBar } =
    UseSocket();
  const token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");
  useEffect(() => {
    const socketConnection = io(`${import.meta.env.VITE_BACK_END}`, {
      auth: { token },
    });
    socketConnection.on("connect", () => {
      setSocket(socketConnection);
    });
    socketConnection.on("onlineuser", (data) => {
      const filteredUsers = data.filter((id: string | null) => id !== adminId);
      setOnlineUsers(filteredUsers);
    });
    return () => {
      socketConnection.disconnect();
      clearSocketState();
    };
  }, []);
  return (
    <>
      <button
        onClick={() => toggleSideBar()}
        aria-controls="logo-sidebar"
        type="button"
        className="sticky top-0 inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns=""
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>
      <Sidebar />

      <Routes>
        <Route path="/" element={<Statistics />} />
        <Route path="stat" element={<Statistics />} />
        <Route path="graphs" element={<Graphs />} />
        <Route path="support" element={<ComplientList />}></Route>
        <Route path="comp/:id" element={<Complaint />}></Route>
        <Route path="users" element={<Users />}></Route>
      </Routes>
    </>
  );
};

export default Home;
