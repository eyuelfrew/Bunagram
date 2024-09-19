import { useDispatch, useSelector } from "react-redux";
import { Root_State } from "../store/store";
import { FaTimes } from "react-icons/fa";
import { FaArrowLeft, FaKey } from "react-icons/fa6";
import {
  CloseSetting,
  OpenSetting,
  OpenTwoStepVerification,
} from "../store/actions/SettingActions";
import { ViewMenu } from "../store/actions/MenuControllers";
import { ChangeEvent, useState } from "react";
import { TiCancelOutline } from "react-icons/ti";
import { CiLock } from "react-icons/ci";
import axios from "axios";
import { SetUserInfo } from "../store/actions/UserAction";
import { GearIcon, VerificationMenuSVG } from "../components/svgs/Svgs";

const Setting = () => {
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [confirmDisable, setConfirmDisable] = useState(false);
  const [twoStepMenu, setTwoStepMenu] = useState(false);
  const { twoStepVerification } = useSelector(
    (state: Root_State) => state.UserReducers
  );
  const { isSettingView } = useSelector(
    (state: Root_State) => state.SetingReducer
  );
  const handelBack = () => {
    dispatch(CloseSetting());
    dispatch(ViewMenu());
  };
  const handleTwoStep = () => {
    if (twoStepVerification) {
      dispatch(CloseSetting());
      setTwoStepMenu(true);
      return;
    }
    dispatch(CloseSetting());
    dispatch(OpenTwoStepVerification());
  };
  const handleCloseTwoStepMenu = () => {
    setConfirmDisable(false);
    setTwoStepMenu(false);
  };
  const handleBackToSettings = () => {
    setTwoStepMenu(false);
    dispatch(OpenSetting());
  };
  const handleDisabeTwoStep = () => {
    setTwoStepMenu(false);
    setConfirmDisable(true);
  };
  const handleBackToTwoStepMenu = () => {
    setConfirmDisable(false);

    setTwoStepMenu(true);
  };
  const handleCloseAllMenu = () => {
    dispatch(CloseSetting());
    setTwoStepMenu(false);
    setConfirmDisable(false);
  };

  const handleDisableRequest = async () => {
    const payload = {
      cloud_password: password,
    };
    const response = await axios.post(
      `${import.meta.env.VITE_BACK_END_URL}/api/disable-two-step`,
      payload,
      { withCredentials: true }
    );
    if (response.data?.status === 1) {
      dispatch(SetUserInfo(response.data?.user));
      setTwoStepMenu(false);
      setConfirmDisable(false);
      dispatch(OpenSetting());
    }
    setError(response.data?.message);
    console.log(response.data);
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  return (
    <>
      {isSettingView && (
        <div
          onClick={() => dispatch(CloseSetting())}
          className="fixed bg-black opacity-60 h-screen w-full flex justify-center items-center z-[2000]  inset-0"
        ></div>
      )}

      <div
        className={`${
          isSettingView ? "" : "hidden"
        } absolute flex w-full justify-center items-center `}
      >
        <div className="bg-[var(--light-dark-color)] rounded-xl mt-6  w-[69%] lg:w-[25%] flex flex-col z-[2400]">
          <div className="flex items-center justify-between p-4">
            <div>
              <button
                onClick={handelBack}
                className="flex items-center gap-2 text-xl text-slate-300 hover:text-slate-400"
              >
                <FaArrowLeft />
                back
              </button>
            </div>
            <div>
              <button
                className="text-xl "
                onClick={() => dispatch(CloseSetting())}
              >
                <FaTimes
                  size={20}
                  className="text-slate-300 hover:text-slate-400"
                />
              </button>
            </div>
          </div>
          <div className="flex px-2 py-1  justify-center mb-4 flex-col">
            <div className="flex justify-center">
              <GearIcon />
            </div>
            <h2 className="text-slate-200 text-xl text-center">Settings</h2>
          </div>
          <div>
            <div
              onClick={handleTwoStep}
              className="flex justify-between px-3 items-center hover:bg-[var(--medium-dard)] rounded-lg cursor-pointer p-7"
            >
              <span className="flex gap-4 text-md text-gray-300 items-center font-thin">
                <FaKey size={19} className="" /> Two-Step Verification
              </span>
              <span className="text-gray-200 font-thin">
                {twoStepVerification ? (
                  <>
                    <span className="text-green-400">on</span>
                  </>
                ) : (
                  <>
                    <span className="text-red-500">off</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {twoStepMenu && (
        <div
          onClick={handleCloseTwoStepMenu}
          className="fixed bg-black opacity-60 h-screen w-full flex justify-center items-center z-[2000]  inset-0"
        ></div>
      )}
      <div
        className={`${
          twoStepMenu ? "" : "hidden"
        } absolute flex w-full justify-center items-center `}
      >
        <div className="bg-[var(--light-dark-color)] rounded-xl mt-6  w-[69%] lg:w-[25%] flex flex-col z-[2400]">
          <div className="flex items-center justify-between p-4">
            <div>
              <button
                onClick={handleBackToSettings}
                className="flex items-center gap-2 text-xl text-slate-300 hover:text-slate-400"
              >
                <FaArrowLeft />
                back
              </button>
            </div>
            <div>
              <button className="text-xl " onClick={handleCloseAllMenu}>
                <FaTimes
                  size={20}
                  className="text-slate-300 hover:text-slate-400"
                />
              </button>
            </div>
          </div>
          <div className="flex flex-col px-2 py-1  justify-center mb-4 ">
            <div className="flex justify-center">
              {" "}
              <VerificationMenuSVG />
            </div>
            <h2 className="text-slate-200 text-lg font-light text-center">
              Two-Step Verifcation Menu!
            </h2>
          </div>
          <div>
            <div className="flex  px-3 items-center  mt-4 py-2">
              <button
                type="submit"
                className="text-slate-300 hover:bg-[var(--hard-dark)] font-light text-lg px-4 gap-3 flex items-center   rounded-md hover:bg-gray-500-700 "
              >
                <CiLock size={25} />
                Chagne Cloud Password
              </button>
            </div>

            <div
              onClick={handleDisabeTwoStep}
              className="flex  px-3 items-center  mt-4 py-2"
            >
              <button
                type="submit"
                className="w-full hover:bg-[var(--hard-dark)] text-red-500 font-light text-lg px-4 gap-3 flex items-center   rounded-md "
              >
                <TiCancelOutline size={25} />
                Disble Two-Step
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Verfy Passoword When Disable */}
      {confirmDisable && (
        <div
          // onClick={handleBackToTwoStepe}
          className="fixed bg-black opacity-60 h-screen w-full flex justify-center items-center z-[2000]  inset-0"
        ></div>
      )}
      <div
        className={`${
          confirmDisable ? "" : "hidden"
        } absolute flex w-full justify-center items-center `}
      >
        <div className="bg-[var(--light-dark-color)] rounded-xl mt-6  w-[69%] lg:w-[25%] flex flex-col z-[2400]">
          <div className="flex items-center justify-between p-4">
            <div>
              <button
                onClick={handleBackToTwoStepMenu}
                className="flex items-center gap-2 text-xl text-slate-300 hover:text-slate-400"
              >
                <FaArrowLeft />
                back
              </button>
            </div>
            <div>
              <button className="text-xl " onClick={handleCloseAllMenu}>
                <FaTimes
                  size={20}
                  className="text-slate-300 hover:text-slate-400"
                />
              </button>
            </div>
          </div>
          <div className="flex flex-col px-2 py-1  justify-center mb-4 ">
            <div className="flex justify-center"></div>
            <h2 className="text-slate-300 text-lg font-light text-center">
              Two-Step Verifcation Disble!
            </h2>
          </div>
          <div>
            <div className="flex flex-col  px-3 items-center  mt-4 py-2">
              <input
                value={password}
                onChange={handlePasswordChange}
                type="password"
                className="text-slate-300 h-10 rounded-xl bg-[var(--dark-bg-color)] w-full focus:outline-none border-0"
              />
              <span className="text-red-500">{error}</span>
            </div>

            <div className="flex  px-3 items-center justify-center  mt-4 py-2">
              <button
                onClick={handleDisableRequest}
                className="hover:bg-[var(--hard-dark)] text-red-500 font-light text-lg px-4 gap-3 flex items-center   rounded-md hover:bg-gray-500-700 disabled:opacity-50"
              >
                Disble Two-Step
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
