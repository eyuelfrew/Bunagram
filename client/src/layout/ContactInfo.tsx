import { useDispatch, useSelector } from "react-redux";

import {
  FaArrowLeft,
  FaCamera,
  FaPhoneSquareAlt,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { CiAt } from "react-icons/ci";
import { SetUserInfo } from "../store/actions/UserAction";
import { Root_State } from "../store/store";
import {
  CloseContactInfo,
  OpenDeleteAccount,
  OpenEditName,
  OpenEditPhone,
  OpenEditUserName,
} from "../store/actions/AccountAction";
import { ViewMenu } from "../store/actions/MenuControllers";

const ContactInfo = () => {
  const { name, phone_number, user_name, bio, _id } = useSelector(
    (state: Root_State) => state.UserReducers
  );
  console.log("Test 1 = ", bio);
  const [bioUser, setBio] = useState<string>(bio);
  console.log("Test 2 = ", bioUser);
  const [debouncedBio, setDebouncedBio] = useState<string>("");

  const isContactInfo = useSelector(
    (state: Root_State) => state.ContactMenuReducer.isContactOpen
  );
  const dispatch = useDispatch();
  console.log(bioUser);
  const handleBackButton = () => {
    dispatch(CloseContactInfo());
    dispatch(ViewMenu());
  };
  useEffect(() => {
    // Update debounced bio value after a delay
    const handler = setTimeout(() => {
      setDebouncedBio(bioUser);
    }, 500); // 500ms delay

    // Cleanup the timeout if the bio changes before the delay
    return () => {
      clearTimeout(handler);
    };
  }, [bioUser]);
  useEffect(() => {
    // Send the debounced bio to the backend
    const updateBio = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACK_END_URL}/api/update-bio`,
          { bio: debouncedBio, user_id: _id },
          { withCredentials: true }
        );
        console.log(response.data);
        dispatch(SetUserInfo(response?.data?.user));
      } catch (error) {
        console.error("Failed to update bio", error);
      }
    };

    if (debouncedBio) {
      updateBio();
    }
  }, [debouncedBio]);
  useEffect(() => {
    setBio(bio);
  }, [bio]);
  return (
    <>
      {isContactInfo && (
        <div
          onClick={() => dispatch(CloseContactInfo())}
          className="fixed bg-black opacity-60 h-screen w-full flex justify-center items-center z-[2000]  inset-0"
        ></div>
      )}

      <div
        className={`${
          isContactInfo ? "" : "hidden"
        } absolute flex w-full justify-center items-center h-screen`}
      >
        <div className="bg-[var(--light-dark-color)] rounded-xl h-[90%] w-[25%] flex flex-col z-[2400]">
          <div className="flex items-center justify-between p-4">
            <div>
              <button
                onClick={handleBackButton}
                className="flex items-center gap-2 text-xl text-slate-300 hover:text-slate-400"
              >
                <FaArrowLeft />
                back
              </button>
            </div>
            <div>
              <button
                className="text-xl "
                onClick={() => dispatch(CloseContactInfo())}
              >
                <FaTimes
                  size={20}
                  className="text-slate-300 hover:text-slate-400"
                />
              </button>
            </div>
          </div>
          <div className="flex px-2 py-1  justify-center mb-4">
            <div className="text-center b">
              <div className=" flex justify-center relative">
                <img
                  className="w-24 h-24 rounded-full "
                  src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOtu74pEiq7ofeQeTsco0migV16zZoBwSlGg&s`}
                  alt=""
                />
                <div className="absolute bottom-5 -right-3">
                  <FaCamera size={25} className="text-slate-300 " />
                </div>
              </div>
              <div>
                <span className="text-xl text-slate-300">Eyuel Frew</span>
              </div>
              <div>
                <span className="text-green-300">online</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 w-full  ">
            <div>
              <input
                value={bioUser}
                onChange={(e) => setBio(e.target.value)}
                placeholder="bio"
                className="w-full p-2 border-0 rounded bg-transparent focus:outline-none text-white"
              />
              <div className="bg-black opacity-40 inset-1 px-2 w-full">
                <div>
                  <p className="text-gray-500">
                    Any details such as age, occupation or city. <br />
                    Example:23 y.o dev form addis
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div
              onClick={() => dispatch(OpenEditName())}
              className="flex justify-between px-3 items-center hover:bg-[var(--medium-dard)] cursor-pointer py-2"
            >
              <span className="flex gap-4 text-lg text-gray-300 items-center font-thin">
                {" "}
                <FaUserCircle size={25} className="" /> Name
              </span>
              <span className="text-lg text-gray-300 font-thin">{name}</span>
            </div>
            <div
              onClick={() => dispatch(OpenEditPhone())}
              className="flex justify-between px-3 items-center hover:bg-[var(--medium-dard)] cursor-pointer py-2"
            >
              <span className="flex gap-4 text-lg text-gray-300 items-center font-thin">
                {" "}
                <FaPhoneSquareAlt size={25} className="" /> Phone number
              </span>
              <span className="text-lg text-gray-300">{phone_number}</span>
            </div>
            <div
              onClick={() => dispatch(OpenEditUserName())}
              className="flex justify-between px-3 items-center hover:bg-[var(--medium-dard)] cursor-pointer py-2"
            >
              <span className="flex gap-4 text-lg text-gray-300 items-center font-thin">
                {" "}
                <CiAt size={25} className="" /> Name
              </span>
              <span className="text-xl text-gray-300 font-thin">
                {user_name}
              </span>
            </div>
          </div>
          <div className=" flex flex-col justify-center mt-5">
            <div className="bg-black opacity-40 inset-1 px-2 w-full">
              <div>
                <p className="text-gray-500">
                  Deleteing account may result in total removal from the
                  application. This action can not be undone
                </p>
              </div>
            </div>{" "}
            <div className="flex justify-center mt-3">
              <button
                onClick={() => dispatch(OpenDeleteAccount())}
                className="bottom-0 text-red-500  w-fit p-2 rounded"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactInfo;
