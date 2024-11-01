// import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
// import { getUserDetail } from "../store/actions/getUserDetail";
import { io } from "socket.io-client";

import { Root_State } from "../store/store";
import MenuLayout from "../layout/MenuLayout";
import { UseSocket } from "../context/SocketContext";
import ChatBox from "../components/ChatBox";
import ContactInfo from "../layout/ContactInfo";
import EditName from "../components/Modals/EditName";
import EditYourNumber from "../components/Modals/EditPhone";
import axios, { AxiosResponse } from "axios";
import { SetUserInfo } from "../store/actions/UserAction";
import EditUserName from "../components/Modals/EditUserName";
import DeleteAccount from "../components/Modals/DeleteAccount";
import Profile from "../layout/Profile";
import Setting from "../layout/Setting";
import TwoStepVerification from "../auth/TwoStepVerification";
import { useNavigate } from "react-router-dom";
import ProtectedAnimation from "../components/animations/ProtectedAnimation";
const Home = () => {
  const navigateTo = useNavigate();
  const darkMode = useSelector((state: Root_State) => state.theme.darkMode);
  const { setSocket, setOnlineUsers } = UseSocket();
  const Recever = useSelector((state: Root_State) => state.receiverReducer);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const logout = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACK_END_URL}/api/logout`,
        {
          withCredentials: true,
        }
      );

      if (response.data?.status === 1) {
        localStorage.clear();
        navigateTo("/");
      }
    };
    if (!token) {
      logout();
    }
    if (token) {
      const socketConnection = io(`${import.meta.env.VITE_BACK_END_URL}`, {
        auth: { token },
      });

      socketConnection.on("connect", () => {
        setSocket(socketConnection);
      });

      socketConnection.on("onlineuser", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [token]);
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        await axios.get(`${import.meta.env.VITE_BACK_END_URL}/api/logout`, {
          withCredentials: true,
        });
        navigateTo("/");
      }
      try {
        const response: AxiosResponse = await axios.get(
          `${import.meta.env.VITE_BACK_END_URL}/api/check-auth`,
          { withCredentials: true }
        );
        if (response.data?.status === 1) {
          localStorage.setItem("token", response.data?.token);
          dispatch(SetUserInfo(response?.data?.user));
          navigateTo("/chat");
        } else {
          console.log(response);
          navigateTo("/");
        }
      } catch (error) {
        console.error(error);
      }
    };
    checkAuth();
  }, []);

  return (
    <>
      <div className="flex w-[100%] h-screen  ">
        <MenuLayout />

        {/* Sidebar for Chat List */}
        <section
          className={`${
            Recever.full_name
              ? "w-[0%] md:w-[40%] lg:w-[30%]"
              : "w-[100%] md:w-[30%]"
          } h-screen transition-all duration-500 ease-in-out ${
            darkMode
              ? "bg-gradient-to-t from-gray-800 via-gray-600 to-gray-900"
              : "bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400"
          } `}
        >
          <Sidebar />
        </section>

        {Recever.recever_id.trim().length === 0 ? (
          <section
            className={`hidden md:block lg:block transition-all duration-500 ease-in-out  justify-center items-center ${
              darkMode
                ? "bg-gradient-to-t from-gray-800 via-gray-600 to-gray-900"
                : "bg-gradient-to-t from-blue-300 via-blue-200 to-blue-100"
            } md:w-[70%] lg:w-[70%]`}
          >
            <div className="flex justify-center items-center flex-col h-full">
              <ProtectedAnimation />
              <h1
                className={`text-2xl font-light ${
                  darkMode ? "text-gray-300" : "text-slate-600"
                }`}
              >
                Select a chat to start messaging!
              </h1>
            </div>
          </section>
        ) : (
          <section
            className={`bg-red-600 ${
              Recever.full_name
                ? "translate-x-0 block w-full"
                : "-translate-x-full"
            } transition-transform duration-1000 ease-in-out relative w-full  md:w-[60%] lg:w-[70%]`}
          >
            <ChatBox />
          </section>
        )}

        {/* Additional Modal Components */}
        <ContactInfo />
        <EditName />
        <EditYourNumber />
        <EditUserName />
        <DeleteAccount />
        <Profile />
        <Setting />
        <TwoStepVerification />
      </div>
    </>
  );
};

export default Home;
