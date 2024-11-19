import { useDispatch, useSelector } from "react-redux";
import { Root_State } from "../store/store";
import { getReceiverInit } from "../store/actions/getRecever";
import { Recevier, User } from "../types/Types";
import { Link } from "react-router-dom";
import { UseSocket } from "../context/SocketContext";
interface SearchUserProps {
  user: User;
  onClose: () => void;
}
const SeachResult: React.FC<SearchUserProps> = ({ onClose, user }) => {
  const URI = import.meta.env.VITE_BACK_END_URL;
  const logedInUser = useSelector(
    (state: Root_State) => state.UserReducers._id
  );
  const dispatch = useDispatch();
  const onlineUser: string[] = UseSocket().onlineUsers;
  const isOnline = onlineUser.includes(user._id);
  const handleStartChat = (payload: Recevier) => {
    onClose();
    dispatch(getReceiverInit(payload));
  };
  return (
    <Link
      onClick={() =>
        handleStartChat({
          full_name: user?.name,
          rece_email: user.email,
          profile_pic: user.profile_pic,
          messageByUser: "",
          conversation_id: "",
          recever_id: user._id,
          sender_id: logedInUser,
          bio: user.bio,
          phone_number: user.phone_number,
          user_name: user.user_name,
          blockedUsers: user.blockedUsers,
          lastSeen: "",
          createdAt: "",
          deletedAccount: false,
        })
      }
      to={"#"}
      className="hover:bg-blue-400 cursor-pointer shadow rounded-md py-3  max-w-sm w-full mx-auto mb-2"
    >
      <div className=" flex space-x-4 items-center justify-between px-2">
        <div className="rounded-[100%]  flex items-center gap-2">
          {logedInUser !== user._id && (
            <>
              {user.profile_pic ? (
                <>
                  <img
                    className="w-[58px] h-[58px] md:w-[77px] md:h-[77px] lg:w-[60px] lg:h-[60px] rounded-full object-cover"
                    src={`${URI}${user.profile_pic}`}
                    alt="buna chat"
                  />
                </>
              ) : (
                <>
                  <img
                    className="w-[58px] h-[58px] md:w-[77px] md:h-[77px] lg:w-[60px] lg:h-[60px] rounded-full"
                    src="./userpic.png"
                    alt="buna chat"
                  />
                </>
              )}
            </>
          )}

          <div className="block relative">
            <p>{logedInUser !== user._id && <>{user.name}</>}</p>
            <>
              {logedInUser !== user._id && (
                <>
                  {isOnline ? (
                    <>
                      <div className="absolute -left-5 bg-green-600 w-3 h-3 px-2  mt-0 rounded"></div>
                    </>
                  ) : (
                    <>
                      <div className="absolute -left-5 bg-red-600 w-3 h-3 rounded-full"></div>
                    </>
                  )}
                </>
              )}
            </>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SeachResult;
