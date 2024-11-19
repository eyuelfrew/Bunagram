import { Link } from "react-router-dom";
import { BiCheckDouble } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";
import { Conversation, Recevier, User } from "../types/Types";
interface ConversationWithUserDetails extends Conversation {
  userDetails: User;
}
interface ConversationsProps {
  conv: ConversationWithUserDetails;
  user: User;
  recever: Recevier;
  darkMode: boolean;
  onlineUsers: string[];
  handleStartChat: (chatDetails: {
    full_name: string;
    rece_email: string;
    profile_pic: string;
    messageByUser: string;
    conversation_id: string;
    recever_id: string;
    sender_id: string;
    bio: string;
    phone_number: string;
    user_name: string;
    blockedUsers: string[];
    lastSeen: string;
    createdAt: string;
    deletedAccount: boolean;
  }) => void;
  DecryptAllMessage: (encryptedMessage: string) => string;
  URL: string;
}
const Conversations: React.FC<ConversationsProps> = ({
  conv,
  user,
  recever,
  darkMode,
  onlineUsers,
  handleStartChat,
  DecryptAllMessage,
  URL,
}) => {
  const isCurrentUser = user._id === conv.userDetails._id;
  const isDeletedAccount = conv.userDetails.deletedAccount;
  const isSelected = recever.recever_id === conv.userDetails._id;
  const isOnline = onlineUsers.includes(conv.userDetails._id);

  const handleClick = () => {
    handleStartChat({
      full_name: conv.userDetails.name,
      rece_email: conv.userDetails.email,
      profile_pic: conv.userDetails.profile_pic,
      messageByUser: conv.lastMessage?.msgByUserId,
      conversation_id: conv._id || "",
      recever_id: conv.userDetails._id,
      sender_id: "",
      bio: conv.userDetails.bio || "",
      phone_number: conv.userDetails.phone_number,
      user_name: conv.userDetails.user_name,
      blockedUsers: conv.userDetails.blockedUsers,
      lastSeen: conv.userDetails?.lastSeen || "",
      createdAt: conv.userDetails?.createdAt || "",
      deletedAccount: conv.userDetails?.deletedAccount,
    });
  };

  return (
    <Link
      onClick={handleClick}
      to="#"
      className={`text-white flex px-2 py-1 justify-between items-center ${
        isSelected
          ? darkMode
            ? "bg-[var(--light-dark-color)]"
            : "bg-gray-700"
          : ""
      } ${darkMode ? "hover:bg-[var(--medium-dard)]" : "hover:bg-gray-600"}`}
    >
      <div className="flex items-center">
        <div className="relative flex px-2 py-1">
          <img
            className="w-16 md:w-10 lg:w-16 rounded-full"
            src={
              isDeletedAccount
                ? "./deletedccount.jpg"
                : conv.userDetails.profile_pic?.trim()
                ? `${URL}${conv.userDetails.profile_pic}`
                : "./userpic.png"
            }
            alt={isDeletedAccount ? "Deleted Account" : conv.userDetails.name}
          />
          {!isCurrentUser && (
            <div
              className={`absolute w-3 h-3 rounded-full ${
                isOnline ? "bg-green-400" : "bg-red-400"
              } right-1 top-11 md:top-4 lg:top-11`}
            ></div>
          )}
        </div>
        <div className="mt-2">
          <p className="md:text-sm lg:text-lg font-semibold">
            {isDeletedAccount ? "Deleted Account" : conv.userDetails.name}
          </p>
          <p className="truncate w-36 text-sm">
            {conv.lastMessage?.text
              ? DecryptAllMessage(conv.lastMessage.text)
              : "say hi 👋"}
          </p>
        </div>
      </div>
      <div>
        {recever.recever_id !== conv.userDetails._id ? (
          <>
            {conv.unseenMessages !== 0 ? (
              <p className="rounded-full w-7 h-7 flex items-center justify-center text-center text-sm bg-red-500 text-white">
                {conv.unseenMessages}
              </p>
            ) : conv.lastMessage?.seen ? (
              <p className="rounded-full w-7 h-7 flex items-center justify-center text-center text-sm text-white">
                <BiCheckDouble />
              </p>
            ) : (
              <p className="rounded-full w-7 h-7 flex items-center justify-center text-center text-sm text-white">
                <FaCheck />
              </p>
            )}
          </>
        ) : conv.lastMessage?.seen ? (
          <p className="rounded-full w-7 h-7 flex items-center justify-center text-center text-sm text-white">
            <BiCheckDouble />
          </p>
        ) : (
          <p className="rounded-full w-7 h-7 flex items-center justify-center text-center text-sm text-white">
            <FaCheck />
          </p>
        )}
      </div>
    </Link>
  );
};

export default Conversations;
