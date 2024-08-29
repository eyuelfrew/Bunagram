import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import { getUserDetail } from "../store/actions/getUserDetail";
import { io } from "socket.io-client";
import ChatBox from "../components/ChatBox";

import { Root_State } from "../store/store";
import MenuLayout from "../layout/MenuLayout";
import { UseSocket } from "../context/SocketContext";
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
  }, [loginStatus, navigateTo, token]);
  useEffect(() => {}, []);
  //start socket connetion if the user has loged in
  useEffect(() => {
    if (token) {
      const socketConnection = io(import.meta.env.VITE_BACK_END_URL, {
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
  }, [dispatch, token]);

  useEffect(() => {
    dispatch(getUserDetail());
  }, [dispatch]);

  const basePath = location.pathname === "/chat";

  return (
    <div className=" h-96   flex w-full">
      <MenuLayout />
      <section
        className={`h-screen w-[100%] lg:w-[25%] bg-[var(--hard-dark)] ${
          !basePath && "hidden"
        } lg:block`}
      >
        <Sidebar />
      </section>

      {/* message box component */}

      {Recever.recever_id.trim().length === 0 ? (
        <>
          <section
            className={`bg-[var(--light-dark-color)] w-[100%] lg:w-[75%]`}
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
            className={`bg-[var(--light-dark-color)] w-[100%] lg:w-[75%]`}
          >
            <div className={`${basePath && "hidden"} `}>
              <ChatBox />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
