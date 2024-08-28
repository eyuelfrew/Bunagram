import { useDispatch, useSelector } from "react-redux";
import { Root_State } from "../store/store";
import { getReceiverInit } from "../store/actions/getRecever";
import { Recevier } from "../types/Types";
import { Link } from "react-router-dom";

interface User {
  name: string;
  email: string;
  _id: string;
  profile_pic: string;
}
interface SearchUserProps {
  user: User;
  onClose: () => void;
}
const SeachResult: React.FC<SearchUserProps> = ({ onClose, user }) => {
  const lodedInUser = useSelector(
    (state: Root_State) => state.userReducer.user._id
  );
  const dispatch = useDispatch();
  const onlineUser: string[] = useSelector(
    (state: Root_State) => state?.socket.onlineUsers
  );
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
          conversation_id: "conv._id",
          recever_id: user._id,
          sender_id: lodedInUser,
        })
      }
      to={"/chat/message"}
      className="hover:bg-blue-400 cursor-pointer shadow rounded-md py-3  max-w-sm w-full mx-auto mb-2"
    >
      <div className=" flex space-x-4 items-center justify-between px-2">
        <div className="rounded-[100%]  flex items-center gap-2">
          <img
            className="w-[25%] rounded-full"
            src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOtu74pEiq7ofeQeTsco0migV16zZoBwSlGg&s`}
            alt="buna chat"
          />
          <div className="block">
            <p>{user.name}</p>
            {isOnline ? (
              <>
                <div className="bg-green-600 w-fit px-2  mt-0">
                  <p className="text-[12px] text-white">online</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-red-600 w-fit">
                  <p className="text-[12px] text-white">offline</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SeachResult;
