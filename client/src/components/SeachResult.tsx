import { useDispatch, useSelector } from "react-redux";
import { Root_State } from "../store/store";
import { getReceiverInit } from "../store/actions/getRecever";
import { Recevier, User } from "../types/Types";
import { Link } from "react-router-dom";
import { UseSocket } from "../context/SocketContext";

// interface User {
//   name: string;
//   email: string;
//   _id: string;
//   profile_pic: string;
//   blockedUsers: string;
// }
interface SearchUserProps {
  user: User;
  onClose: () => void;
}
const SeachResult: React.FC<SearchUserProps> = ({ onClose, user }) => {
  const logedInUser = useSelector(
    (state: Root_State) => state.UserReducers._id
  );
  const dispatch = useDispatch();
  const onlineUser: string[] = UseSocket().onlineUsers;
  const isOnline = onlineUser.includes(user._id);
  const handleStartChat = (payload: Recevier) => {
    console.log(payload);
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
        })
      }
      to={"#"}
      className="hover:bg-blue-400 cursor-pointer shadow rounded-md py-3  max-w-sm w-full mx-auto mb-2"
    >
      <div className=" flex space-x-4 items-center justify-between px-2">
        <div className="rounded-[100%]  flex items-center gap-2">
          {logedInUser === user._id ? (
            <img
              className="w-[25%] rounded-full"
              src={`/savedmessage.jpg`}
              alt="buna chat"
            />
          ) : (
            <>
              {user.profile_pic ? (
                <>
                  <img
                    className="w-[25%] rounded-full"
                    src={`${user.profile_pic}`}
                    alt="buna chat"
                  />
                </>
              ) : (
                <>
                  <img
                    className="w-[25%] rounded-full"
                    src="/userpic.png"
                    alt="buna chat"
                  />
                </>
              )}
            </>
          )}

          <div className="block">
            <p>
              {logedInUser === user._id ? (
                <>
                  <span className="text-lg">Saved Message</span>
                </>
              ) : (
                <>{user.name}</>
              )}
            </p>
            <>
              {logedInUser !== user._id && (
                <>
                  {isOnline ? (
                    <>
                      <div className="bg-green-600 w-fit px-2  mt-0 rounded">
                        <p className="text-[12px] text-white">online</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-red-600 w-fit rounded">
                        <p className="text-[12px] text-white">offline</p>
                      </div>
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
