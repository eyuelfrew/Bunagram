import { useDispatch, useSelector } from "react-redux";
import { Root_State } from "../store/store";
import { CloseViewProfile } from "../store/actions/ViewProfile";
import { CiAt } from "react-icons/ci";
import { FaTimes, FaUserCircle, FaPhoneSquareAlt } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { UseSocket } from "../context/SocketContext";

const Profile = () => {
  const dispatch = useDispatch();
  const Reciver = useSelector((state: Root_State) => state.receiverReducer);
  const isProfileview = useSelector(
    (state: Root_State) => state.ProfileReducer.isviewProfile
  );
  const onlineUsers = UseSocket().onlineUsers;
  const isOnline = onlineUsers.includes(Reciver.recever_id);
  return (
    <>
      {isProfileview && (
        <div
          onClick={() => dispatch(CloseViewProfile())}
          className="fixed bg-black opacity-60 h-screen w-full flex justify-center items-center z-[2000]  inset-0"
        ></div>
      )}

      <div
        className={`${
          isProfileview ? "" : "hidden"
        } absolute flex w-full justify-center items-center `}
      >
        <div className="bg-[var(--light-dark-color)] rounded-xl mt-6  w-[69%] lg:w-[25%] flex flex-col z-[2400]">
          <div className="flex items-center justify-between p-4">
            <div>
              <button
                onClick={() => dispatch(CloseViewProfile())}
                className="flex items-center gap-2 text-xl text-slate-300 hover:text-slate-400"
              >
                <FaArrowLeft />
                back
              </button>
            </div>
            <div>
              <button
                className="text-xl "
                onClick={() => dispatch(CloseViewProfile())}
              >
                <FaTimes
                  size={20}
                  className="text-slate-300 hover:text-slate-400"
                />
              </button>
            </div>
          </div>
          <div className="flex px-2 py-1  justify-center mb-4 ">
            <div className="text-center relative">
              <div className=" flex justify-center relative">
                {Reciver?.profile_pic.trim() == "" ? (
                  <>
                    <img
                      className="w-24 h-24 rounded-full "
                      src="/userpic.png"
                      alt=""
                    />
                  </>
                ) : (
                  <>
                    <img
                      className="w-20 h-20 rounded-full "
                      src={`${Reciver.profile_pic}`}
                      alt=""
                    />
                  </>
                )}
              </div>

              <div>
                <span className="text-md text-slate-300 ">
                  {Reciver.full_name}
                </span>
              </div>
              <div>
                {isOnline ? (
                  <>
                    <span className="text-green-300 text-sm">online</span>
                  </>
                ) : (
                  <>
                    <span className="text-red-300 text-sm">offline</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 w-full  px-2">
            <span className="w-full p-2  bg-transparent focus:outline-none text-white mb-4 border-b">
              {Reciver?.bio}
            </span>
          </div>
          <div>
            <div className="flex justify-between px-3 items-center hover:bg-[var(--medium-dard)] cursor-pointer py-2">
              <span className="flex gap-4 text-md text-gray-300 items-center font-thin">
                {" "}
                <FaUserCircle size={25} className="" /> Name
              </span>
              <span className="text-md text-gray-300 font-thin ">
                {Reciver.full_name}
              </span>
            </div>
            <div className="flex justify-between px-3 items-center hover:bg-[var(--medium-dard)] cursor-pointer py-2">
              <span className="flex gap-4 text-md text-gray-300 items-center font-thin">
                {" "}
                <FaPhoneSquareAlt size={25} className="" /> Phone number
              </span>
              <span className="text-md text-gray-300">
                {Reciver?.phone_number}
              </span>
            </div>
            <div className="flex justify-between px-3 items-center hover:bg-[var(--medium-dard)] cursor-pointer py-2">
              <span className="flex gap-4 text-md text-gray-300 items-center font-thin">
                {" "}
                <CiAt size={25} className="" />
                username
              </span>
              <span className="text-md text-gray-300 font-thin">
                {Reciver?.user_name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
