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
const Home = () => {
  const navigateTo = useNavigate();
  const darkMode = useSelector((state: Root_State) => state.theme.darkMode);
  const { setSocket, setOnlineUsers, clearSocketState } = UseSocket();
  const Recever = useSelector((state: Root_State) => state.receiverReducer);
  const user = useSelector((state: Root_State) => state.UserReducers);
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

      return () => {
        socketConnection.disconnect();
        clearSocketState();
      };
    }
  }, [token, user]);

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
          dispatch(SetUserInfo(response?.data?.user));
          navigateTo("/chat");
        } else {
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
      <>
        <div className=" h-96   flex w-full">
          <MenuLayout />
          <section
            className={`${
              Recever.full_name ? "hidden lg:flex " : "w-[100%]"
            } h-screen   lg:w-[25%]  ${
              darkMode
                ? "bg-[var(--hard-dark)]"
                : "bg-[var(--royale-blue)] transition duration-500"
            }`}
          >
            <Sidebar />
          </section>
          {/* message box component */}
          {Recever.recever_id.trim().length === 0 ? (
            <>
              <section
                className={`hidden lg:block bg-[var(--light-dark-color)] lg:w-[75%]`}
              >
                <div
                  className={`h-screen ${
                    darkMode
                      ? "bg-[var(--light-dark-color)]"
                      : "bg-[var(--blue-grotto)]"
                  } w-full flex justify-center items-center`}
                >
                  <h1 className="text-xl text-white font-light">
                    select a chat to start messaging
                  </h1>
                </div>
              </section>
            </>
          ) : (
            <>
              <section
                className={`${
                  Recever.full_name
                    ? "translate-x-0 block w-[100%] lg:block"
                    : "-translate-x-full"
                } transition-transform duration-1000 ease-in-out bg-[var(--light-dark-color)] lg:block lg:w-[75%] relative `}
              >
                <ChatBox />
              </section>
            </>
          )}
          {/* Modal Components  */} <ContactInfo />
          <EditName />
          <EditYourNumber />
          <EditUserName />
          <DeleteAccount />
          <Profile />
          <Setting />
          <TwoStepVerification />
        </div>
      </>
    </>
  );
};

export default Home;
