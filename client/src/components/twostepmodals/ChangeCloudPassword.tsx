import React, { useEffect } from "react";
import { ChangeEvent, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { EmailSvg } from "../../auth/TwoStepVerification";
import toast from "react-hot-toast";
import { ChagneCloudPass } from "../../apis/Auth";

interface ChangePasswordInterface {
  changePasswordForm: boolean;
  darkMode: boolean;
  setChangePasswordForm: React.Dispatch<React.SetStateAction<boolean>>;
  setTwoStepMenu: React.Dispatch<React.SetStateAction<boolean>>;
  handleBackToTwoStepMenu: React.Dispatch<React.SetStateAction<boolean>>;
}
const ChangeCloudPassword: React.FC<ChangePasswordInterface> = ({
  changePasswordForm,
  darkMode,
  setChangePasswordForm,
  setTwoStepMenu,
}) => {
  const [isHintView, setHintView] = useState(false);
  const [hint, setHintValue] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hintError, setHintError] = useState("");
  const [isEmailView, setEmailView] = useState(false);
  const [backupEmail, setBackUpEmail] = useState("");
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    validatePassword(e.target.value, confirmPassword);
  };
  const validatePassword = (password: string, confirmPassword: string) => {
    if (password.length < 4) {
      setError("Password must be at least 4 characters long.");
    } else if (password !== confirmPassword) {
      setError("Passwords do not match.");
    } else {
      setError("");
    }
  };
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    validatePassword(password, e.target.value);
  };
  const handleContinueToHint = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.trim() == "" || confirmPassword.trim() == "") {
      setError("full both inputs pelase!");
      return;
    }
    setChangePasswordForm(false);
    setHintView(true);
  };
  const handleHintChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHintValue(e.target.value);
  };
  const handleContinueToEmail = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (hint.trim() === "") {
      setHintError("Pelase Fill hint to coninue");
      return;
    }
    setHintView(false);
    setEmailView(true);
  };
  const handleSkipHint = () => {
    setHintView(false);
    setEmailView(true);
  };
  const handleBackToHint = () => {
    setEmailView(false);
    setHintView(true);
  };
  const handleBackToPassword = () => {
    setHintView(false);
    setChangePasswordForm(true);
  };
  const handleChangeCloudPass = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await ChagneCloudPass(password, hint, backupEmail);
    if (response.status === 1) {
      setEmailView(false);
      setHintView(false);
      setChangePasswordForm(false);
      setTwoStepMenu(true);
      toast.success("Cloud Password Changed Successfuly!");
    }
    console.log(response);
  };
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBackUpEmail(e.target.value);
  };
  useEffect(() => {
    setHintValue("");
    setError("");
    setPassword("");
    setBackUpEmail("");
  }, [setTwoStepMenu]);
  const handleCloseAllMenu = () => {
    setEmailView(false);
    setHintView(false);
    setChangePasswordForm(false);
    setTwoStepMenu(false);
  };
  const backToTwoStepMenu = () => {
    setChangePasswordForm(false);
    setHintView(false);
    setTwoStepMenu(true);
  };
  return (
    <>
      {/* 
          
        ---------- Password Fill Form  
        */}
      {changePasswordForm && (
        <div
          onClick={handleCloseAllMenu}
          className="fixed bg-black opacity-60 h-screen w-full flex justify-center items-center z-[2000]  inset-0"
        ></div>
      )}
      <div
        className={`${
          changePasswordForm ? "" : "hidden"
        } absolute flex w-full justify-center items-center `}
      >
        <div
          className={`${
            darkMode
              ? "bg-[var(--light-dark-color)]"
              : "bg-[var(--cobalt-blue)]"
          } rounded-xl mt-6  w-[69%] lg:w-[25%] flex flex-col z-[2400]`}
        >
          <div className="flex items-center justify-between p-4">
            <div>
              <button
                onClick={backToTwoStepMenu}
                className="flex items-center gap-2 text-xl text-slate-300 hover:text-slate-400"
              >
                <FaArrowLeft />
                back
              </button>
            </div>
            <div>
              <button onClick={handleCloseAllMenu} className="text-xl ">
                <FaTimes
                  size={20}
                  className="text-slate-300 hover:text-slate-400"
                />
              </button>
            </div>
          </div>
          <div className="flex flex-col px-2 py-1  justify-center mb-4 ">
            <div className="flex justify-center"></div>
            <h2 className="text-slate-200 text-lg font-light text-center">
              New Password
            </h2>
          </div>
          <div>
            <form
              onSubmit={handleContinueToHint}
              className="max-w-md mx-auto p-4  rounded-lg "
            >
              <div className="mb-4">
                <label className="block text-sm text-slate-300 mb-2 font-light">
                  Password:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`${
                    darkMode
                      ? "bg-[var(--dark-bg-color)] text-slate-200"
                      : "text-slate-600"
                  }  w-full px-3 py-2 focus:outline-none rounded-2xl`}
                  placeholder=""
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-slate-300 mb-2 font-light">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`${
                    darkMode
                      ? "bg-[var(--dark-bg-color)] text-slate-200"
                      : "text-slate-600"
                  }  w-full px-3 py-2 focus:outline-none rounded-2xl`}
                  placeholder=""
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div>
                <div className="flex justify-center px-3 items-center   py-2">
                  <button
                    type="submit"
                    className="w-full px-4 py-2  text-white rounded-md hover:bg-gray-500-700 disabled:opacity-50"
                    disabled={!!error}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* 
          
        ---------- Hint display
        */}
      {isHintView && (
        <div
          onClick={handleCloseAllMenu}
          className="fixed bg-black opacity-60 h-screen w-full flex justify-center items-center z-[2000]  inset-0"
        ></div>
      )}
      <div
        className={`${
          isHintView ? "" : "hidden"
        } absolute flex w-full justify-center items-center `}
      >
        <div
          className={`${
            darkMode
              ? "bg-[var(--light-dark-color)]"
              : "bg-[var(--cobalt-blue)]"
          } rounded-xl mt-6  w-[69%] lg:w-[25%] flex flex-col z-[2400]`}
        >
          <div className="flex items-center justify-between p-4">
            <div>
              <button
                onClick={handleBackToPassword}
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
            <h2 className="text-slate-200 text-lg font-light text-center">
              Set Hint!
            </h2>
          </div>
          <div>
            <form
              onSubmit={handleContinueToEmail}
              className="max-w-md mx-auto p-4 rounded-lg "
            >
              <div className="mb-4">
                <label className="block text-sm text-slate-300 mb-2 font-light">
                  Password Hint:
                </label>
                <input
                  type="text"
                  value={hint}
                  onChange={handleHintChange}
                  className={`${
                    darkMode ? "bg-[var(--dark-bg-color)]" : "text-slate-800"
                  } text-slate-200 w-full px-3 py-2 focus:outline-none   rounded-2xl`}
                  placeholder=""
                />
                <span className="text-red-500">{hintError}</span>
              </div>
              <span
                onClick={handleSkipHint}
                className="cursor-pointer mb-4 p-3 rounded-xl mx-3 text-slate-300 font-light "
              >
                Skip hint!
              </span>
              <div className="flex justify-center px-3 items-center  mt-4 py-2">
                <button
                  type="submit"
                  className="w-full px-4 py-2  text-white rounded-md hover:bg-gray-500-700 disabled:opacity-50"
                  disabled={!!error}
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* 
          ----- Email View  
        */}
      {isEmailView && (
        <div
          onClick={handleCloseAllMenu}
          className="fixed bg-black opacity-60 h-screen w-full flex justify-center items-center z-[2000]  inset-0"
        ></div>
      )}
      <div
        className={`${
          isEmailView ? "" : "hidden"
        } absolute flex w-full justify-center items-center `}
      >
        <div
          className={`${
            darkMode
              ? "bg-[var(--light-dark-color)]"
              : "bg-[var(--cobalt-blue)]"
          } rounded-xl mt-6  w-[69%] lg:w-[25%] flex flex-col z-[2400]`}
        >
          <div className="flex items-center justify-between p-4">
            <div>
              <button
                onClick={handleBackToHint}
                className="flex items-center gap-2 text-xl text-slate-300 hover:text-slate-400"
              >
                <FaArrowLeft />
                back
              </button>
            </div>
            <div>
              <button className="text-xl ">
                <FaTimes
                  size={20}
                  className="text-slate-300 hover:text-slate-400"
                />
              </button>
            </div>
          </div>
          <div className="flex flex-col px-2 py-1  justify-center mb-4 ">
            <div className="flex justify-center">
              <EmailSvg />
            </div>
            <h2 className="text-slate-200 text-lg font-light text-center">
              Add Back Up Email !
            </h2>
          </div>
          <div>
            <form
              onSubmit={handleChangeCloudPass}
              className="max-w-md mx-auto p-4 rounded-lg "
            >
              <div className="mb-4">
                <label className="block text-sm text-slate-300 mb-2 font-light">
                  Backup Email:
                </label>
                <input
                  type="email"
                  value={backupEmail}
                  onChange={handleEmailChange}
                  className={`${
                    darkMode ? " bg-[var(--dark-bg-color)]" : "text-slate-700"
                  } text-slate-200 w-full px-3 py-2 focus:outline-none  rounded-2xl`}
                  placeholder=""
                />
                {/* <span className="text-red-500">{emailError}</span> */}
              </div>

              <div className="flex justify-center px-3 items-center  mt-4 py-2">
                <button
                  type="submit"
                  className="w-full px-4 py-2  text-white rounded-md hover:bg-gray-500-700 disabled:opacity-50"
                  disabled={!!error}
                >
                  Save and Finishe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeCloudPassword;
