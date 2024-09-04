import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
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
import axios, { AxiosResponse } from "axios";
import { SetUserInfo } from "../store/actions/UserAction";
import EditUserName from "../components/Modals/EditUserName";
import DeleteAccount from "../components/Modals/DeleteAccount";
const Home = () => {
  const { setSocket, setOnlineUsers, clearSocketState } = UseSocket();
  const location = useLocation();
  const Recever = useSelector((state: Root_State) => state.receiverReducer);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const token = localStorage.getItem("token");
  const loginStatus = useSelector(
    (state: Root_State) => state.LoginReducer.LoginStatus
  );
  //redired the usre to login page if not loged in
  useEffect(() => {
    if (!loginStatus && !token) {
      navigateTo("/");
    }
  }, []);
  //start socket connetion if the user has loged in
  useEffect(() => {
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
  }, [token]);

  useEffect(() => {
    dispatch(getUserDetail());
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response: AxiosResponse = await axios.get(
          `${import.meta.env.VITE_BACK_END_URL}/api/check-auth`,
          { withCredentials: true }
        );
        if (response.data?.status === 1) {
          dispatch(SetUserInfo(response?.data?.user));
        } else {
          navigateTo("/");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuth();
  }, []);

  const basePath = location.pathname === "/chat";

  return (
    <>
      <div className=" h-96   flex w-full">
        <MenuLayout />
        <section
          className={`h-screen  w-[25%] bg-[var(--hard-dark)] ${
            !basePath && "hidden"
          } lg:block`}
        >
          <Sidebar />
        </section>

        {/* message box component */}

        {Recever.recever_id.trim().length === 0 ? (
          <>
            <section className={`bg-[var(--light-dark-color)] w-[75%]`}>
              <div className="h-screen bg-[var(--light-dark-color)] w-full flex justify-center items-center">
                <h1 className="text-xl text-white font-light">
                  select a chat to start messaging
                </h1>
              </div>
            </section>
          </>
        ) : (
          <>
            <section className={`bg-[var(--light-dark-color)] w-[75%]`}>
              <ChatBox />
            </section>
          </>
        )}
        {/* Modal Components  */}
        <ContactInfo />
        <EditName />
        <EditYourNumber />
        <EditUserName />
        <DeleteAccount />
      </div>
    </>
  );
};

export default Home;
