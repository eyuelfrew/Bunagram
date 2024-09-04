import { IoMenu } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Root_State } from "../store/store";
import { ChangeEvent, useEffect, useState } from "react";
import { FiArrowUpLeft } from "react-icons/fi";
import { getReceiverInit } from "../store/actions/getRecever";
import { Conversation, Recevier, User } from "../types/Types";
import axios, { AxiosResponse } from "axios";
import SeachResult from "./SeachResult";
import { ViewMenu } from "../store/actions/MenuControllers";
import { UseSocket } from "../context/SocketContext";

interface ConversationWithUserDetails extends Conversation {
  userDetails: User;
}
const Sidebar = () => {
  const notificationSound = new Audio("/discord_notification.mp3");
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
  const params = useParams();
  const [allUsers, setAllUsers] = useState<
    ConversationWithUserDetails[] | null
  >(null);
  const user = useSelector((state: Root_State) => state.UserReducers);
  // const [editUserInfo, setEditUserInfo] = useState(false);

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
  useEffect(() => {
    if (SocketConnection && user?._id) {
      SocketConnection.emit("sidebar", user._id);
      SocketConnection.on("notif", () => {
        console.log("Notification Test ==", user?._id);
        console.log("Notification Test ==", Recever?.recever_id);

        if (user?._id && Recever?.recever_id) {
          if (user._id.trim() !== Recever.recever_id.trim()) {
            notificationSound.play().catch((error) => {
              console.log("Error playing notification sound:", error);
            });
          }
        } else {
          console.log("User ID or Receiver ID is undefined");
        }
      });
      SocketConnection.on("conversation", (data) => {
        const conversationUserData: ConversationWithUserDetails[] = data?.map(
          (conversationUser: Conversation) => {
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
          }
        );
        setAllUsers(conversationUserData);
      });
    }
  }, [Recever.recever_id, SocketConnection, user._id]);

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
              type="text"
              name="usre_search_key_word"
              value={searchUser.usre_search_key_word}
              onChange={handleSearchUser}
              className="w-[100%] bg-[var(--light-dark-color)] rounded-full border border-[var(--medium-dard)]  p-2 pr-10 focus:outline-none focus:ring-0 "
              placeholder="Search users..."
            />
            {viewResult && (
              <button
                onMouseDown={handleClearInput} // Using onMouseDown to prevent losing focus before clearing
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
                className="z-[1000] rounded-t-2xl p-1 absolute h-[400px] w-full bg-[var(--search-result-bg)] flex flex-col"
              >
                {users.length !== 0 &&
                  users.map((user, index) => (
                    <div key={index}>
                      {loading ? (
                        <>loading...</>
                      ) : (
                        <>
                          <SeachResult
                            onClose={() => setViewSearchResult(false)}
                            user={user}
                          />
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

          {allUsers &&
            allUsers.map((conv, index) => (
              <Link
                className="  text-white"
                onClick={() =>
                  handleStartChat({
                    full_name: conv?.userDetails.name,
                    rece_email: conv?.userDetails.email,
                    profile_pic: conv?.userDetails.profile_pic,
                    messageByUser: conv?.lastMessage?.msgByUserId,
                    conversation_id: conv._id,
                    recever_id: conv?.userDetails._id,
                    sender_id: "",
                    blockedUsers: conv?.userDetails.blockedUsers,
                  })
                }
                to={"#"}
                key={index}
              >
                <div
                  className={`${
                    Recever.recever_id === conv?.userDetails?._id
                      ? "bg-[var(--light-dark-color)] "
                      : ""
                  } hover:bg-[var(--medium-dard)] flex px-2 py-1 justify-between items-center`}
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
                          {conv?.userDetails.profile_pic.trim() === "" ? (
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
                                src={`${conv?.userDetails.profile_pic}`}
                                alt=""
                              />
                            </>
                          )}
                        </>
                      )}
                      {user._id !== conv?.userDetails._id && (
                        <>
                          {onlineUsers.includes(conv?.userDetails._id) ? (
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
                        {user._id !== conv?.userDetails._id ? (
                          <>{conv?.userDetails?.name}</>
                        ) : (
                          <>Saved Message</>
                        )}
                      </p>
                      <p className="truncate w-36 text-sm">
                        {conv?.lastMessage?.text ? (
                          conv.lastMessage.text
                        ) : (
                          <>say hi 👋</>
                        )}
                      </p>
                    </div>
                  </div>
                  <div>
                    {params.userId !== conv?.userDetails?._id ? (
                      <>
                        {conv?.unseenMessages != 0 ? (
                          <>
                            <p className="rounded-full w-7 h-7 flex items-center justify-center text-center text-sm bg-red-500 text-white">
                              {conv?.unseenMessages}
                            </p>
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </Link>
            ))}
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
