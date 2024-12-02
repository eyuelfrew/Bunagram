import { IoMenu } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";

import { Root_State } from "../store/store";
import { ChangeEvent, useEffect, useState } from "react";
import { FiArrowUpLeft } from "react-icons/fi";
import { clearReciver, getReceiverInit } from "../store/actions/getRecever";
import { Conversation, RecevierType, User } from "../types/Types";
import SeachResult from "../components/SeachResult";
import { ViewMenu } from "../store/actions/MenuControllers";
import { UseSocket } from "../context/SocketContext";
import LoadingConversation from "../components/LoadingConversation";

import { DecryptAllMessage } from "../utils/EncryptionService";
import { SearchUsers } from "../apis/UserApi";
import { FetchConversations } from "../apis/Chat";
import Conversations from "../components/Conversations";

interface ConversationWithUserDetails extends Conversation {
  userDetails: User;
}
const Sidebar = () => {
  const darkMode = useSelector((state: Root_State) => state.theme.darkMode);
  const loggedInUser = useSelector((state: Root_State) => state.UserReducers);
  const [isLoading, setIsLoading] = useState(false);
  const audio = new Audio("./discord_notification.mp3");
  const URL = import.meta.env.VITE_BACK_END_URL;
  const ricever = useSelector((state: Root_State) => state.ReceiverReducer);
  const [viewResult, setViewSearchResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [searchUser, setInputValue] = useState({
    usre_search_key_word: "",
  });
  const { socket, onlineUsers } = UseSocket();
  const SocketConnection = socket;
  const dispatch = useDispatch();
  const [allUsers, setAllUsers] = useState<
    ConversationWithUserDetails[] | null
  >(null);
  const user = useSelector((state: Root_State) => state.UserReducers);
  const handleSearchUser = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValue({ ...searchUser, [name]: value });
    setViewSearchResult(true);
    if (!e.target.value) {
      setViewSearchResult(false);
      return;
    }

    setLoading(true);
    const response = await SearchUsers(e.target.value);
    setLoading(false);
    setUsers(response?.data);
  };
  /*
  --- Fetch Conversation
  */
  const fetchAllConversation = async () => {
    setIsLoading(true);
    const conversation = await FetchConversations();
    const conversationUserData: ConversationWithUserDetails[] =
      await Promise.all(
        conversation?.map(async (conversationUser: Conversation) => {
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        }) || []
      );
    setAllUsers(conversationUserData);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchAllConversation();
    if (socket && user?._id) {
      socket.on("notif", () => {
        audio.play();
      });

      setIsLoading(true);
      socket.on("conversation", async () => {
        const conversation = await FetchConversations();
        const conversationUserData: ConversationWithUserDetails[] =
          conversation?.map((conversationUser: Conversation) => {
            if (
              conversationUser?.sender?._id === conversationUser?.receiver?._id
            ) {
              return {
                ...conversationUser,
                userDetails: conversationUser?.sender,
              };
            } else if (conversationUser?.receiver?._id !== user?._id) {
              return {
                ...conversationUser,
                userDetails: conversationUser.receiver,
              };
            } else {
              return {
                ...conversationUser,
                userDetails: conversationUser.sender,
              };
            }
          });
        setAllUsers(conversationUserData);
      });
      socket.on("con-del", (data) => {
        setAllUsers(
          (prevUsers) =>
            prevUsers &&
            prevUsers.filter(
              (conversation) => conversation._id !== data?.conversation_id
            )
        );
        dispatch(clearReciver());
      });
      socket.on("del-conversation", (data) => {
        setAllUsers(
          (prevUsers) =>
            prevUsers &&
            prevUsers.filter(
              (conversation) => conversation._id !== data?.conversation_id
            )
        );
      });
    }
  }, [SocketConnection]);

  const handleStartChat = (payload: RecevierType) => {
    dispatch(getReceiverInit(payload));
  };

  const handleClearInput = () => {
    setViewSearchResult(false);
    setInputValue({ usre_search_key_word: "" });
  };

  const handleBlur = () => {
    setViewSearchResult(false);
  };

  const handleSideNavBar = () => {
    dispatch(ViewMenu());
  };

  return (
    <>
      <div className="w-full border-r-2 border-gray-700 ">
        <div className="flex p-4 items-center gap-1 text-white ">
          <button
            onClick={handleSideNavBar}
            className={`${darkMode ? "text-slate-300" : "text-white"}`}
          >
            <IoMenu size={35} />
          </button>

          <div className="relative w-[80%]  mx-auto rounded-full">
            <input
              // readOnly
              aria-label="Search users"
              inputMode="text"
              autoComplete="off"
              type="text"
              name="usre_search_key_word"
              value={searchUser.usre_search_key_word}
              onChange={handleSearchUser}
              className={`w-[100%] ${
                darkMode
                  ? "bg-[var(--light-dark-color)]"
                  : "bg-[var(--blue-de-france)]"
              } rounded-full border ${
                darkMode ? "border-[var(--medium-dard)]" : "border-blue-500"
              }  p-2 pr-10 focus:outline-none focus:ring-0  placeholder-gray-300`}
              placeholder="Search users..."
            />
            {viewResult && (
              <button
                onMouseDown={handleClearInput}
                className=" -ml-3 mt-2 absolute inset-y-0 h-8 right-0 flex items-center justify-center  w-8"
              >
                <svg
                  className=" text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.293 4.293a1 1 0 011.414 0L10 6.586l2.293-2.293a1 1 0 111.414 1.414L11.414 8l2.293 2.293a1 1 0 01-1.414 1.414L10 9.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 8 6.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
            {viewResult && (
              <div
                onBlur={handleBlur}
                className={`${
                  darkMode
                    ? "bg-[var(--light-dark-color)]"
                    : "bg-[var(--blue-grotto)]"
                } z-[1000] overflow-scroll emoji-scroll-bar overflow-x-hidden rounded-t-2xl p-1 absolute h-[400px] w-full  flex flex-col gap-3`}
              >
                {users.length !== 0 &&
                  users.map((user, index) => (
                    <div key={index}>
                      {loading ? (
                        <>
                          <div className="flex px-2 py-1 justify-between items-center animate-pulse">
                            <div className="flex">
                              <div className="flex px-2 py-1 relative">
                                <div className="w-16 h-16 rounded-full bg-gray-600"></div>
                                <div className="absolute w-3 h-3 rounded-full bg-gray-300 right-1 top-11"></div>
                              </div>
                              <div className="mt-2">
                                <p className="h-4 bg-gray-600 rounded w-32 mb-2"></p>
                                <p className="h-3 bg-gray-600 rounded w-11"></p>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {user._id.trim() != loggedInUser._id.trim() &&
                            !user.deletedAccount && (
                              <SeachResult
                                onClose={() => setViewSearchResult(false)}
                                user={user}
                              />
                            )}
                        </>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
        <div className="h-[calc(100vh-74px)] overflow-x-hidden overflow-y-auto scrollbar">
          {!isLoading && allUsers && allUsers.length === 0 && (
            <div className="">
              <div className="flex justify-center mt-10 text-slate-200">
                <FiArrowUpLeft size={40} />
              </div>
              <p className="text-lg text-center text-slate-200">
                explore users to start conversation!
              </p>
            </div>
          )}
          <>
            {isLoading ? (
              <>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index}>
                    <LoadingConversation />
                  </div>
                ))}
              </>
            ) : (
              <>
                {allUsers &&
                  allUsers.map((conv, index) => (
                    <div key={index}>
                      {user._id !== conv.userDetails._id && (
                        <Conversations
                          key={index}
                          conv={conv}
                          user={user}
                          recever={ricever}
                          darkMode={darkMode}
                          onlineUsers={onlineUsers}
                          handleStartChat={handleStartChat}
                          DecryptAllMessage={DecryptAllMessage}
                          URL={URL}
                        />
                      )}
                    </div>
                  ))}
              </>
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
