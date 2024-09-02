import { useDispatch, useSelector } from "react-redux";

import {
  FaArrowLeft,
  FaCamera,
  FaPhoneSquareAlt,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
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
import uploadFile from "../helpers/UploadImage";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";

const ContactInfo = () => {
  const [loading, setLoading] = useState(false);
  const { name, phone_number, user_name, bio, _id, profile_pic } = useSelector(
    (state: Root_State) => state.UserReducers
  );
  const [bioUser, setBioUser] = useState<string>(bio);

  const isContactInfo = useSelector(
    (state: Root_State) => state.ContactMenuReducer.isContactOpen
  );
  const dispatch = useDispatch();
  const handleBackButton = () => {
    dispatch(CloseContactInfo());
    dispatch(ViewMenu());
  };
  useEffect(() => {
    setBioUser(bio);
  }, [bio]);
  useEffect(() => {
    const delay = 500; // Delay in milliseconds
    const handler = setTimeout(() => {
      if (bioUser !== bio) {
        // Only send the request if the bio has changed
        updateBio();
      }
    }, delay);

    // Cleanup function to cancel the timeout if the user types again before the delay
    return () => {
      clearTimeout(handler);
    };
  }, [bioUser]);
  const updateBio = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACK_END_URL}/api/update-bio`,
        { bio: bioUser, user_id: _id },
        { withCredentials: true }
      );
      console.log("Bio updated successfully");
      dispatch(SetUserInfo(response.data.user)); // Update the global state with the new bio
    } catch (error) {
      console.error("Failed to update bio", error);
    }
  };
  const handleUploadPhoto = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoading(true);
    if (!(event.target instanceof HTMLInputElement)) {
      throw new Error("Invalid event target");
    }

    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.item(0);

    if (!file) {
      throw new Error("No file selected");
    }

    const uploadPhoto = await uploadFile(file);
    if (uploadPhoto) {
      const payload = {
        pic_url: uploadPhoto.secure_url,
        user_id: _id,
        public_id: uploadPhoto.public_id,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_BACK_END_URL}/api/update-pp`,
        payload,
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.data.status === 1) {
        toast.success("Profile Changed!");
        setLoading(false);
        dispatch(SetUserInfo(response.data.user));
      }
    }
  };
  const handleDeleteProfile = async () => {
    try {
      const user_id = _id;
      const response: AxiosResponse = await axios.delete(
        `${import.meta.env.VITE_BACK_END_URL}/api/delete-profile/${user_id}`,
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.data.status === 1) {
        dispatch(SetUserInfo(response?.data?.user));
      }
    } catch (error) {
      return console.log(error);
    }
  };
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
          <div className="flex px-2 py-1  justify-center mb-4 ">
            <div className="text-center relative">
              {loading && (
                <div className=" w-24 h-24 rounded-full bg-black opacity-60 flex justify-center items-center z-[2000]  inset-0">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                </div>
              )}
              {!loading && (
                <div className=" flex justify-center relative">
                  {profile_pic.trim() == "" ? (
                    <>
                      <img
                        className="w-24 h-24 rounded-full "
                        src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOtu74pEiq7ofeQeTsco0migV16zZoBwSlGg&s`}
                        alt=""
                      />
                    </>
                  ) : (
                    <>
                      <img
                        className="w-24 h-24 rounded-full "
                        src={`${profile_pic}`}
                        alt=""
                      />
                    </>
                  )}
                  {profile_pic.trim() == "" ? (
                    <>
                      <label
                        htmlFor="profilepic"
                        className="absolute bottom-5 -right-3 cursor-pointer"
                      >
                        <FaCamera size={25} className="text-slate-300 " />
                        <input
                          id="profilepic"
                          type="file"
                          className="hidden"
                          onChange={handleUploadPhoto}
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <label
                        htmlFor="profilepic"
                        className="absolute bottom-5 -right-3 cursor-pointer"
                        onClick={handleDeleteProfile}
                      >
                        <MdDelete size={25} className="text-red-500 " />
                      </label>
                    </>
                  )}
                </div>
              )}

              <div>
                <span className="text-xl text-slate-300">{name}</span>
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
                onChange={(e) => setBioUser(e.target.value)}
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
