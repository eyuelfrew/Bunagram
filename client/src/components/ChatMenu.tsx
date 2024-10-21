import { useState, useRef, useEffect } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { GiBroom } from "react-icons/gi";
import { MdOutlineBlock } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Root_State } from "../store/store";
import axios, { AxiosResponse } from "axios";
import { SetUserInfo } from "../store/actions/UserAction";
import { UseSocket } from "../context/SocketContext";
import { getReceiverInit } from "../store/actions/getRecever";
import { CgProfile } from "react-icons/cg";
import { ViewProfile } from "../store/actions/ViewProfile";
import { RiChatDeleteFill } from "react-icons/ri";
import { ClearChats, DeleteConversation } from "../services/API";
import toast from "react-hot-toast";

const ChatMenu: React.FC = () => {
  const darkMode = useSelector((state: Root_State) => state.theme.darkMode);
  const { socket } = UseSocket();
  const user = useSelector((state: Root_State) => state.UserReducers);
  const dispatch = useDispatch();
  const reciver = useSelector((state: Root_State) => state.receiverReducer);
  const conversation_id = reciver.conversation_id.toString();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleOpenMenu = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the event from bubbling up
    setOpenMenu(!openMenu);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpenMenu(false);
    }
  };

  useEffect(() => {
    if (openMenu) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openMenu]);
  const handleBlockUser = async () => {
    const payload = {
      blocked_id: reciver.recever_id,
    };
    const response: AxiosResponse = await axios.post(
      `${import.meta.env.VITE_BACK_END_URL}/api/block-user`,
      payload,
      { withCredentials: true }
    );

    if (response.data?.status === 1) {
      console.log(response.data?.user);
      dispatch(SetUserInfo(response.data?.user));
      const payload = {
        blocker: user._id,
        blocked: reciver.recever_id,
      };
      socket?.emit("blockuser", payload);
    }
  };

  const isBlocked = user.blockedUsers.includes(reciver.recever_id);
  const handleUnblockUser = async () => {
    const payload = {
      blocker_id: user._id,
      blocked_id: reciver.recever_id,
    };
    const response: AxiosResponse = await axios.post(
      `${import.meta.env.VITE_BACK_END_URL}/api/unblock-user`,
      payload,
      { withCredentials: true }
    );
    if (response.data?.status === 1) {
      dispatch(SetUserInfo(response.data?.user));
    }
  };

  const handleDeleteConversation = async () => {
    const payload = {
      reciver_id: reciver.recever_id,
      conversation_id: conversation_id,
    };
    await DeleteConversation(payload);
  };
  useEffect(() => {
    socket?.on("blockedby", (data) => {
      if (reciver.recever_id === data._id) {
        dispatch(
          getReceiverInit({
            full_name: data.name,
            rece_email: data.email,
            profile_pic: data.profile_pic,
            messageByUser: "",
            conversation_id: "",
            recever_id: data._id,
            sender_id: "",
            user_name: data.user_name || "",
            phone_number: data?.phone_number,
            blockedUsers: data.blockedUsers,
            bio: data.bio || "",
            lastSeen: "",
            createdAt: "",
            deletedAccount: data?.deletedAccount,
          })
        );
      }
    });
    socket?.on("unblockedby", (data) => {
      if (reciver.recever_id === data._id) {
        dispatch(
          getReceiverInit({
            full_name: data.name,
            rece_email: data.email,
            profile_pic: data.profile_pic,
            messageByUser: "",
            conversation_id: "",
            bio: data.bio || "",
            recever_id: data._id,
            sender_id: "",
            user_name: data?.user_name,
            phone_number: data?.phone_number,
            blockedUsers: data.blockedUsers,
            lastSeen: "",
            createdAt: "",
            deletedAccount: data?.deletedAccount,
          })
        );
      }
    });
  }, [socket]);

  const handleClearChat = async () => {
    const response = await ClearChats(reciver?.conversation_id.toString());
    if (response.status == 1) {
      toast.success(response.message);
    }
  };
  return (
    <div className="relative z-[2000]">
      <button onClick={handleOpenMenu} className="text-white text-2xl">
        <CiMenuKebab />
      </button>
      {openMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          ref={menuRef}
          className={`${
            darkMode ? "bg-gray-700 " : "bg-[var(--blue-de-france)]"
          } absolute h-fit -ml-32  p-3 flex flex-col gap-3 w-36`}
        >
          <button
            onClick={() => dispatch(ViewProfile())}
            className="flex items-center gap-2 "
          >
            <CgProfile />
            Profile
          </button>
          <button
            onClick={handleDeleteConversation}
            className="flex items-center gap-2 "
          >
            <RiChatDeleteFill />
            Delete chat
          </button>
          <button
            onClick={handleClearChat}
            className="flex items-center gap-2 "
          >
            <GiBroom />
            Clear chat
          </button>
          {isBlocked ? (
            <>
              <button
                onClick={handleUnblockUser}
                className="flex items-center gap-2 text-red-400"
              >
                <MdOutlineBlock />
                Unblock user
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleBlockUser}
                className="flex items-center gap-2 text-red-400"
              >
                <MdOutlineBlock />
                Block user
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default ChatMenu;
