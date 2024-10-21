import { IoMenu } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Root_State } from "../store/store";
import { ChangeEvent, useEffect, useState } from "react";
import { FiArrowUpLeft } from "react-icons/fi";
import { clearReciver, getReceiverInit } from "../store/actions/getRecever";
import { Conversation, Recevier, User } from "../types/Types";
import axios, { AxiosResponse } from "axios";
import SeachResult from "./SeachResult";
import { ViewMenu } from "../store/actions/MenuControllers";
import { UseSocket } from "../context/SocketContext";
import LoadingConversation from "./LoadingConversation";
import { FaCheck } from "react-icons/fa6";
import { BiCheckDouble } from "react-icons/bi";
import { FetchConversations } from "../services/API";
import EncryptinService from "../utils/EncryptionService";

interface ConversationWithUserDetails extends Conversation {
  userDetails: User;
}
const Sidebar = () => {
  const darkMode = useSelector((state: Root_State) => state.theme.darkMode);
  const loggedInUser = useSelector((state: Root_State) => state.UserReducers);
  const [isLoading, setIsLoading] = useState(false);
  const audio = new Audio(
    "https://bunagram.vercel.app/discord_notification.mp3"
  );
  const URL = import.meta.env.VITE_BACK_END_URL;
  const Recever = useSelector((state: Root_State) => state.receiverReducer);
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
  const EncService = new EncryptinService(
    import.meta.env.VITE_TRANSIT_KEY,
    import.meta.env.VITE_STORAGE_KEY,
    import.meta.env.VITE_INCOMING_MESSAGE_KEY
  );
  const handleSearchUser = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValue({ ...searchUser, [name]: value });
    setViewSearchResult(true);
    if (!e.target.value) {
      setViewSearchResult(false);
      return;
    }

    setLoading(true);
    try {
      const response: AxiosResponse = await axios.post(`${URL}/api/search`, {
        query: e.target.value,
      });
      setLoading(false);
      setUsers(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  /*
  --- Fetch Conversation
  */
  const fetchAllConversation = async () => {
    setIsLoading(true);
    const conversation = await FetchConversations();
    const conversationUserData: ConversationWithUserDetails[] =
      conversation?.map((conversationUser: Conversation) => {
        if (
          // menu side bar controller function
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
              // menu side bar controller function
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

  const handleStartChat = (payload: Recevier) => {
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
            className="text-[var(--menu-button)]"
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
              // onFocus={(e) => e.target.removeAttribute("readonly")}
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
                          {user._id.trim() != loggedInUser._id.trim() && (
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
          {allUsers && allUsers.length === 0 && (
            <div>
              <div className="flex justify-center mt-10 text-slate-400">
                <FiArrowUpLeft size={40} />
              </div>
              <p className="text-lg text-center text-slate-400">
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
                        <Link
                          key={index}
                          className="text-white "
                          onClick={() =>
                            handleStartChat({
                              full_name: conv?.userDetails.name,
                              rece_email: conv?.userDetails.email,
                              profile_pic: conv?.userDetails.profile_pic,
                              messageByUser: conv?.lastMessage?.msgByUserId,
                              conversation_id: conv?._id || "",
                              recever_id: conv?.userDetails._id,
                              sender_id: "",
                              bio: conv?.userDetails.bio || "",
                              phone_number: conv?.userDetails.phone_number,
                              user_name: conv?.userDetails.user_name,
                              blockedUsers: conv?.userDetails.blockedUsers,
                              lastSeen: conv?.userDetails?.lastSeen || "",
                              createdAt: conv?.userDetails?.createdAt || "",
                              deletedAccount: conv?.userDetails?.deletedAccount,
                            })
                          }
                          to={"#"}
                        >
                          <div
                            className={`${
                              Recever.recever_id === conv?.userDetails?._id
                                ? ` ${
                                    darkMode
                                      ? "bg-[var(--light-dark-color)]"
                                      : "bg-[var(--brandeis-blue)]"
                                  } `
                                : ""
                            } ${
                              darkMode
                                ? "hover:bg-[var(--medium-dard)]"
                                : "hover:bg-[var(--blue-de-france)]"
                            }  flex px-2 py-1 justify-between items-center`}
                          >
                            <div className="flex">
                              <div className="flex px-2 py-1 relative">
                                {user._id === conv?.userDetails._id ? (
                                  <>
                                    <>
                                      <img
                                        className="w-16 h-16 rounded-full "
                                        src={`/savedmessage.jpg`}
                                        alt={`${Recever.full_name}`}
                                      />
                                    </>
                                  </>
                                ) : (
                                  <>
                                    {conv?.userDetails.deletedAccount ? (
                                      <>
                                        <img
                                          className="w-16 h-16 rounded-full"
                                          src={`/deletedccount.jpg`}
                                          alt=""
                                        />
                                      </>
                                    ) : (
                                      <>
                                        {conv?.userDetails.profile_pic.trim() ===
                                        "" ? (
                                          <>
                                            <img
                                              className="w-16 h-16 rounded-full"
                                              src={`/userpic.png`}
                                              alt=""
                                            />
                                          </>
                                        ) : (
                                          <>
                                            <img
                                              className="w-16 h-16 rounded-full"
                                              src={`${URL}${conv?.userDetails.profile_pic}`}
                                              alt=""
                                            />
                                          </>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                                {user._id !== conv?.userDetails._id && (
                                  <>
                                    {onlineUsers.includes(
                                      conv?.userDetails._id
                                    ) ? (
                                      <>
                                        <div className="absolute w-3 h-3 rounded-full bg-green-400 right-1 top-11 "></div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="absolute w-3 h-3 rounded-full bg-red-400 right-1 top-11  "></div>
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                              <div className="mt-2">
                                <p className="text-lg font-semibold">
                                  {user._id !== conv?.userDetails._id &&
                                  !conv?.userDetails?.deletedAccount ? (
                                    <>{conv?.userDetails?.name}</>
                                  ) : (
                                    <>Deleted Account</>
                                  )}
                                </p>
                                <p className="truncate w-36 text-sm">
                                  {conv?.lastMessage?.text ? (
                                    <>
                                      {" "}
                                      {EncService.DecryptMessage(
                                        conv.lastMessage.text
                                      )}
                                    </>
                                  ) : (
                                    <>say hi 👋</>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div>
                              {Recever.recever_id !== conv?.userDetails?._id ? (
                                <>
                                  {conv?.unseenMessages != 0 ? (
                                    <>
                                      <p className="rounded-full w-7 h-7 flex items-center justify-center text-center text-sm bg-red-500 text-white">
                                        {conv?.unseenMessages}
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      {conv?.lastMessage?.seen ? (
                                        <>
                                          <p className="rounded-full w-7 h-7 flex items-center justify-center text-center text-sm  text-white">
                                            <BiCheckDouble />
                                          </p>
                                        </>
                                      ) : (
                                        <>
                                          <p className="rounded-full w-7 h-7 flex items-center justify-center text-center text-sm  text-white">
                                            <FaCheck />
                                          </p>
                                        </>
                                      )}
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  {conv?.lastMessage?.seen ? (
                                    <>
                                      <p className="rounded-full w-7 h-7 flex items-center justify-center text-center text-sm  text-white">
                                        <BiCheckDouble />
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="rounded-full w-7 h-7 flex items-center justify-center text-center text-sm  text-white">
                                        <FaCheck />
                                      </p>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </Link>
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
// {
//   editUserInfo && (
//     <EditUser onClose={() => setEditUserInfo(false)} user={user} />
//   );
// }
