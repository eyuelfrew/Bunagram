import { MdCancel, MdManageAccounts } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Root_State } from "../store/store";
import { CloseMenu } from "../store/actions/MenuControllers";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ResetLoginState } from "../store/actions/login";
import { clearReciver } from "../store/actions/getRecever";
import { OpenConactInfo } from "../store/actions/AccountAction";
import { ResetUserInfo } from "../store/actions/UserAction";
import { OpenSetting } from "../store/actions/SettingActions";
import { FaRegMoon, FaSun } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { initializeTheme, toggleTheme } from "../store/themes/themeSlice";
import { IoMdLogOut } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import BlockedUsers from "../components/Modals/BlockedUsers";
import { FaHandPaper } from "react-icons/fa";
const MenuLayout = () => {
  const URI = import.meta.env.VITE_BACK_END_URL;
  const darkMode = useSelector((state: Root_State) => state.theme.darkMode);
  const user = useSelector((state: Root_State) => state.UserReducers);
  const navigateTo = useNavigate();
  const [blockedUsers, setBlockedUsers] = useState(false);
  const menuBar = useSelector((state: Root_State) => state.menuReducer.isView);
  const dispatch = useDispatch();
  // Load theme from localStorage on component mount

  const handleMenuCancel = () => {
    dispatch(CloseMenu());
  };
  const HandleLogout = async () => {
    dispatch(ResetLoginState());
    localStorage.clear();
    const response = await axios.get(
      `${import.meta.env.VITE_BACK_END_URL}/api/logout`,
      {
        withCredentials: true,
      }
    );

    if (response.data?.status === 1) {
      localStorage.clear();
      navigateTo("/");
    }
    dispatch(ResetUserInfo());

    dispatch(CloseMenu());
    dispatch(clearReciver());
  };

  const handleContactInfo = () => {
    dispatch(CloseMenu());
    dispatch(OpenConactInfo());
  };
  const handleSetting = (): void => {
    dispatch(CloseMenu());
    dispatch(OpenSetting());
  };
  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);
  const handleBlockedUsersModal = () => {
    dispatch(CloseMenu());
    setBlockedUsers(true);
  };
  return (
    <>
      {menuBar && (
        <div
          onClick={handleMenuCancel}
          className="z-[3000] fixed inset-0 bg-black opacity-60"
        ></div>
      )}
      <div
        className={`${
          menuBar ? "translate-x-0" : "-translate-x-full"
        } duration-500  absolute z-[3000] ${
          darkMode ? "bg-[var(--medium-dard)]" : "bg-[var(--blue-de-france)]"
        } w-[50%] lg:w-[25%]  h-screen p-3 text-white transition  `}
      >
        <div className="flex justify-between items-center">
          <div>
            {user ? (
              user?.profile_pic ? (
                <>
                  <img
                    className="w-20 h-20  rounded-full"
                    src={`${URI}${user.profile_pic}`}
                    alt={`${user.profile_pic}`}
                  />
                </>
              ) : (
                <>
                  <img
                    className="w-16 h-16 lg:w-20 lg:h-20  rounded-full"
                    src={"./userpic.png"}
                    alt={`${user.profile_pic}`}
                  />
                </>
              )
            ) : (
              <></>
            )}
            <p className="text-xl">{user.name}</p>
            <p className="text-sm text-slate-300  w-full truncate ...">
              {user.email}
            </p>
          </div>

          <div>
            <button onClick={handleMenuCancel}>
              {" "}
              <MdCancel size={20} />
            </button>
          </div>
        </div>
        <div className="mx-5 mt-11 flex flex-col gap-5">
          <button
            className="flex  items-center  gap-4 rounded-full"
            onClick={handleContactInfo}
          >
            <MdManageAccounts size={20} />
            Account
          </button>{" "}
          <button
            className="flex  items-center  gap-4 rounded-full"
            onClick={handleBlockedUsersModal}
          >
            <FaHandPaper size={20} />
            Blocked Users
          </button>
          <button
            className="flex  items-center  gap-4 rounded-full"
            onClick={handleSetting}
          >
            <IoSettings size={20} />
            Setting
          </button>
          <button
            className="flex  items-center  gap-4 rounded-full"
            onClick={HandleLogout}
          >
            <IoMdLogOut size={20} /> Logout
          </button>
          <button
            onClick={handleThemeToggle}
            className={`flex  items-center  gap-4 rounded-full  transition duration-500`}
          >
            {darkMode ? <FaSun size={20} /> : <FaRegMoon size={20} />}
            {darkMode ? <span>Light Mode</span> : <span>Night Mode</span>}
          </button>
        </div>
        <div
          className={`fixed bottom-0 ${
            darkMode ? "text-slate-400 " : "text-slate-300"
          }  flex flex-col font-light text-center w-full`}
        >
          <span className="">Coffegram Web</span>
          <span>Version 0.0.1</span>
        </div>
      </div>
      <BlockedUsers
        blockedUsers={blockedUsers}
        handleToggle={setBlockedUsers}
      />
    </>
  );
};

export default MenuLayout;
