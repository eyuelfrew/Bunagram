import { useState, useRef, useEffect } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { GiBroom } from "react-icons/gi";
import { MdOutlineBlock } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Root_State } from "../store/store";
import { SetUserInfo } from "../store/actions/UserAction";
import { UseSocket } from "../context/SocketContext";
import { getReceiverInit } from "../store/actions/getRecever";
import { CgProfile } from "react-icons/cg";
import { ViewProfile } from "../store/actions/ViewProfile";
import { RiChatDeleteFill } from "react-icons/ri";
import toast from "react-hot-toast";
import { BlockUser, UnblockUser } from "../apis/UserApi";
import { ClearChats, DeleteConversation } from "../apis/Chat";

const ChatMenu: React.FC = () => {
  const darkMode = useSelector((state: Root_State) => state.theme.darkMode);
  const { socket } = UseSocket();
  const user = useSelector((state: Root_State) => state.UserReducers);
  const dispatch = useDispatch();
  const reciverFetch = useSelector(
    (state: Root_State) => state.ReceiverReducer
  );
  const conversation_id = reciverFetch.conversation_id.toString();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleOpenMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
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
      blocked_id: reciverFetch.recever_id,
    };
    const response = await BlockUser(payload);

    if (response?.status === 1) {
      dispatch(SetUserInfo(response?.user));
      const payload = {
        blocker: user._id,
        blocked: reciverFetch.recever_id,
      };
      socket?.emit("blockuser", payload);
    }
  };

  const isBlocked = user.blockedUsers.includes(reciverFetch.recever_id);
  const handleUnblockUser = async () => {
    const payload = {
      blocker_id: user._id,
      blocked_id: reciverFetch.recever_id,
    };
    const response = await UnblockUser(payload);
    if (response?.status === 1) {
      dispatch(SetUserInfo(response?.user));
    }
  };

  const handleDeleteConversation = async () => {
    const payload = {
      reciver_id: reciverFetch.recever_id,
      conversation_id: conversation_id,
    };
    await DeleteConversation(payload);
  };
  useEffect(() => {
    const recid = String(reciverFetch.recever_id).trim();
    const handleBlockedBy = (data: {
      _id: string;
      name: string;
      email: string;
      profile_pic: string;
      user_name: string;
      phone_number: string;
      blockedUsers: string[];
      bio: string;
      deletedAccount: boolean;
    }) => {
      const check = recid === String(data._id).trim();
      if (check) {
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
      } else {
        return;
      }
    };

    const handleUnBlockedBy = (data: {
      _id: any;
      name: any;
      email: any;
      profile_pic: any;
      bio: any;
      user_name: any;
      phone_number: any;
      blockedUsers: any;
      deletedAccount: any;
    }) => {
      const check = recid === String(data._id).trim();
      if (check) {
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
      } else {
        return;
      }
    };
    socket?.on("blockedby", handleBlockedBy);
    socket?.on("unblockedby", handleUnBlockedBy);
    return () => {
      socket?.off("blockedby", handleBlockedBy);
      socket?.off("unblockedby", handleUnBlockedBy);
    };
  }, [reciverFetch.recever_id, socket, dispatch]);

  const handleClearChat = async () => {
    const response = await ClearChats(reciverFetch?.conversation_id.toString());
    if (response.status == 1) {
      toast.success(response.message);
    }
  };
  return (
    <div className="relative z-[2000]">
      <button onClick={handleOpenMenu} className="text-slate-400 text-2xl">
        <CiMenuKebab />
      </button>
      {openMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          ref={menuRef}
          className={`${
            darkMode ? "bg-gray-700 " : "bg-[var(--blue-de-france)]"
          } absolute h-fit -ml-32  p-3 flex flex-col gap-3 w-36 text-white`}
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
                className="flex items-center gap-2 "
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
