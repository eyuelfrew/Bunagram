// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import { getUserDetail } from "../store/actions/getUserDetail";
import { io } from "socket.io-client";

import { Root_State } from "../store/store";
import MenuLayout from "../layout/MenuLayout";
import { UseSocket } from "../context/SocketContext";
import ChatBox from "../components/ChatBox";
import ContactInfo from "../layout/ContactInfo";
import EditName from "../components/Modals/EditName";
import EditYourNumber from "../components/Modals/EditPhone";
// import axios, { AxiosResponse } from "axios";
// import { SetUserInfo } from "../store/actions/UserAction";
import EditUserName from "../components/Modals/EditUserName";
import DeleteAccount from "../components/Modals/DeleteAccount";
import Profile from "../layout/Profile";
import Setting from "../layout/Setting";
import TwoStepVerification from "../auth/TwoStepVerification";
// import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { SetUserInfo } from "../store/actions/UserAction";
const Home = () => {
  const [isAutenticating, setIsAutenticaing] = useState(false);
  // const navigateTo = useNavigate();
  const { setSocket, setOnlineUsers, clearSocketState } = UseSocket();
  const Recever = useSelector((state: Root_State) => state.receiverReducer);
  const user = useSelector((state: Root_State) => state.UserReducers);
  const dispatch = useDispatch();
  // const navigateTo = useNavigate();
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
        alert("loged out");
        // navigateTo("/");
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
    dispatch(getUserDetail());
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      setIsAutenticaing(true);
      const token = localStorage.getItem("token");
      if (!token) {
        await axios.get(`${import.meta.env.VITE_BACK_END_URL}/api/logout`, {
          withCredentials: true,
        });
        // navigateTo("/");
      }
      try {
        const response: AxiosResponse = await axios.get(
          `${import.meta.env.VITE_BACK_END_URL}/api/check-auth`,
          { withCredentials: true }
        );
        if (response.data?.status === 1) {
          setIsAutenticaing(false);
          dispatch(SetUserInfo(response?.data?.user));
        } else {
          alert(response.data);
          // navigateTo("/");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuth();
  }, []);

  return (
    <>
      {isAutenticating ? (
        <>
          <div className="flex justify-center items-center h-screen bg-[var(--light-dark-color)]">
            <div className="rounded-full h-20 w-20 bg-violet-800 animate-ping"></div>
          </div>
        </>
      ) : (
        <>
          <div className=" h-96   flex w-full">
            <MenuLayout />
            <section
              className={`${
                Recever.full_name ? "hidden lg:flex " : "w-[100%]"
              } h-screen   lg:w-[25%] bg-[var(--hard-dark)] `}
            >
              <Sidebar />
            </section>
            {/* message box component */}
            {Recever.recever_id.trim().length === 0 ? (
              <>
                <section
                  className={`hidden lg:block bg-[var(--light-dark-color)] lg:w-[75%]`}
                >
                  <div className="h-screen bg-[var(--light-dark-color)] w-full flex justify-center items-center">
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
      )}
    </>
  );
};

export default Home;
