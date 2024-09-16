import { useDispatch, useSelector } from "react-redux";
import { Root_State } from "../store/store";
import {
  CloseSetting,
  CloseTwoStepVerification,
  OpenSetting,
  OpenTwoStepVerification,
} from "../store/actions/SettingActions";
import { FaArrowLeft } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { ChangeEvent, useState } from "react";
import axios from "axios";
import { KeySVG } from "../components/svgs/Svgs";
import toast from "react-hot-toast";
import { SetUserInfo } from "../store/actions/UserAction";

const TwoStepVerification = () => {
  const user = useSelector((state: Root_State) => state.UserReducers);
  const [displayVerifyEmail, setVerifyEmailDisplay] = useState(false);
  const [isEmailView, setEmailView] = useState(false);
  const [isHintView, setHintView] = useState(false);
  const [passwordForm, setPassowordForm] = useState(false);
  const [password, setPassword] = useState("");
  const [hint, setHintValue] = useState("");
  const [backupEmail, setBackUpEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [hintError, setHintError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationInputError] = useState("");
  const [, setDisplayTwoStepVerificationMenu] = useState(false);
  const { isTwoStepVerifiction } = useSelector(
    (state: Root_State) => state.SetingReducer
  );
  const dispatch = useDispatch();
  const handleBack = () => {
    dispatch(CloseTwoStepVerification());
    dispatch(OpenSetting());
  };
  const handleBackToHint = () => {
    setEmailView(false);
    setHintView(true);
  };
  const handleBackToCreatePassword = () => {
    dispatch(OpenTwoStepVerification());
    setPassowordForm(false);
  };
  const handleCreatePassword = () => {
    dispatch(CloseTwoStepVerification());
    setPassowordForm(true);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    validatePassword(e.target.value, confirmPassword);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    validatePassword(password, e.target.value);
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
  const handleHintChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHintValue(e.target.value);
  };
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBackUpEmail(e.target.value);
  };

  const handleContinueToHint = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.trim() == "" || confirmPassword.trim() == "") {
      setError("full both inputs pelase!");
      return;
    }
    setPassowordForm(false);
    setHintView(true);
  };
  const handleBackToForm = () => {
    setPassowordForm(true);
    setHintView(false);
  };

  /*
    --- Skip Or Continue To Email Functions
    */
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

  /*
        ----- Email Verification or 
        */
  const handleContinueToVerification = async (
    e: ChangeEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (backupEmail.trim() === "") {
      setEmailError("Please insert email");
      return;
    }
    const response = await axios.post(
      `${import.meta.env.VITE_BACK_END_URL}/api/verify-backup-email`,
      { email: backupEmail, _id: user._id },
      { withCredentials: true }
    );
    console.log(response.data);
    setEmailError("");
    setEmailView(false);
    setVerifyEmailDisplay(true);
  };
  const handleBackToEmail = () => {
    setVerifyEmailDisplay(false);
    setEmailView(true);
  };

  const handlVerifyCode = (e: ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
  };

  const handleVerifyEmail = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (verificationCode.trim() === "") {
      setVerificationInputError("fill the code we sent you!");
      return;
    }
    if (verificationCode.length < 6 || verificationCode.length > 6) {
      setVerificationInputError("wrong code format!");
      return;
    }
    const payload = {
      verificationCode: verificationCode,
      hint: hint,
      backupEmail: backupEmail,
      cloudPassword: password,
      _id: user._id,
    };
    const response = await axios.post(
      `${import.meta.env.VITE_BACK_END_URL}/api/two-step-verification`,
      payload,
      { withCredentials: true }
    );
    console.log(response.data);
    if (response.data?.twoStepVerification) {
      setVerifyEmailDisplay(false);
      setDisplayTwoStepVerificationMenu(true);
      dispatch(SetUserInfo(response.data?.user));
      toast.success("Two-Step Verificaton Enabled!");
    }
  };
  const handleCloseAllTab = () => {
    setVerifyEmailDisplay(false);
    setDisplayTwoStepVerificationMenu(false);
    setEmailView(false);
    setHintView(false);
    setPassowordForm(false);
  };
  return (
    <>
      {isTwoStepVerifiction && (
        <div
          onClick={handleCloseAllTab}
          className="fixed bg-black opacity-60 h-screen w-full flex justify-center items-center z-[2000]  inset-0"
        ></div>
      )}

      <div
        className={`${
          isTwoStepVerifiction ? "" : "hidden"
        } absolute flex w-full justify-center items-center `}
      >
        <div className="bg-[var(--light-dark-color)] rounded-xl mt-6  w-[69%] lg:w-[25%] flex flex-col z-[2400]">
          <div className="flex items-center justify-between p-4">
            <div>
              <button
                onClick={handleBack}
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
          <div className="flex flex-col px-2 py-1  justify-center mb-4 ">
            <div className="flex justify-center">
              <KeySVG />
            </div>
            <h2 className="text-slate-200 text-lg font-light text-center">
              Add <span className="text-red-300">two-step </span>verification to
              your account
            </h2>
          </div>
          <div>
            <div className="flex justify-center px-3 items-center  cursor-pointer py-2">
              <button
                onClick={handleCreatePassword}
                className="hover:bg-[var(--medium-dard)] p-4 rounded-lg mt-5 mb-4 text-slate-300"
              >
                Create Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 
          
        ---------- Password Fill Form  
        */}
      {passwordForm && (
        <div
          onClick={handleCloseAllTab}
          className="fixed bg-black opacity-60 h-screen w-full flex justify-center items-center z-[2000]  inset-0"
        ></div>
      )}
      <div
        className={`${
          passwordForm ? "" : "hidden"
        } absolute flex w-full justify-center items-center `}
      >
        <div className="bg-[var(--light-dark-color)] rounded-xl mt-6  w-[69%] lg:w-[25%] flex flex-col z-[2400]">
          <div className="flex items-center justify-between p-4">
            <div>
              <button
                onClick={handleBackToCreatePassword}
                className="flex items-center gap-2 text-xl text-slate-300 hover:text-slate-400"
              >
                <FaArrowLeft />
                back
              </button>
            </div>
            <div>
              <button className="text-xl " onClick={handleCloseAllTab}>
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
              Creat Password
            </h2>
          </div>
          <div>
            <form
              onSubmit={handleContinueToHint}
              className="max-w-md mx-auto p-4 bg-[var(--light-dark-color)] rounded-lg "
            >
              <div className="mb-4">
                <label className="block text-sm text-slate-300 mb-2 font-light">
                  Password:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="text-slate-200 w-full px-3 py-2 focus:outline-none  bg-[var(--dark-bg-color)] rounded-2xl"
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
                  className="text-slate-200 w-full px-3 py-2 focus:outline-none  bg-[var(--dark-bg-color)] rounded-2xl"
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
          onClick={handleCloseAllTab}
          className="fixed bg-black opacity-60 h-screen w-full flex justify-center items-center z-[2000]  inset-0"
        ></div>
      )}
      <div
        className={`${
          isHintView ? "" : "hidden"
        } absolute flex w-full justify-center items-center `}
      >
        <div className="bg-[var(--light-dark-color)] rounded-xl mt-6  w-[69%] lg:w-[25%] flex flex-col z-[2400]">
          <div className="flex items-center justify-between p-4">
            <div>
              <button
                onClick={handleBackToForm}
                className="flex items-center gap-2 text-xl text-slate-300 hover:text-slate-400"
              >
                <FaArrowLeft />
                back
              </button>
            </div>
            <div>
              <button className="text-xl " onClick={handleCloseAllTab}>
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
              className="max-w-md mx-auto p-4 bg-[var(--light-dark-color)] rounded-lg "
            >
              <div className="mb-4">
                <label className="block text-sm text-slate-300 mb-2 font-light">
                  Password Hint:
                </label>
                <input
                  type="text"
                  value={hint}
                  onChange={handleHintChange}
                  className="text-slate-200 w-full px-3 py-2 focus:outline-none  bg-[var(--dark-bg-color)] rounded-2xl"
                  placeholder=""
                />
                <span className="text-red-500">{hintError}</span>
              </div>
              <span
                onClick={handleSkipHint}
                className="cursor-pointer mb-4 p-3 rounded-xl mx-3 text-slate-300 font-light hover:bg-slate-600"
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
          onClick={handleCloseAllTab}
          className="fixed bg-black opacity-60 h-screen w-full flex justify-center items-center z-[2000]  inset-0"
        ></div>
      )}
      <div
        className={`${
          isEmailView ? "" : "hidden"
        } absolute flex w-full justify-center items-center `}
      >
        <div className="bg-[var(--light-dark-color)] rounded-xl mt-6  w-[69%] lg:w-[25%] flex flex-col z-[2400]">
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
              <button className="text-xl " onClick={handleCloseAllTab}>
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
              onSubmit={handleContinueToVerification}
              className="max-w-md mx-auto p-4 bg-[var(--light-dark-color)] rounded-lg "
            >
              <div className="mb-4">
                <label className="block text-sm text-slate-300 mb-2 font-light">
                  Backup Email:
                </label>
                <input
                  type="email"
                  value={backupEmail}
                  onChange={handleEmailChange}
                  className="text-slate-200 w-full px-3 py-2 focus:outline-none  bg-[var(--dark-bg-color)] rounded-2xl"
                  placeholder=""
                />
                <span className="text-red-500">{emailError}</span>
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
      {/* 
          ----- Email Verify View  
        */}
      {displayVerifyEmail && (
        <div
          onClick={handleCloseAllTab}
          className="fixed bg-black opacity-60 h-screen w-full flex justify-center items-center z-[2000]  inset-0"
        ></div>
      )}
      <div
        className={`${
          displayVerifyEmail ? "" : "hidden"
        } absolute flex w-full justify-center items-center `}
      >
        <div className="bg-[var(--light-dark-color)] rounded-xl mt-6  w-[69%] lg:w-[25%] flex flex-col z-[2400]">
          <div className="flex items-center justify-between p-4">
            <div>
              <button
                onClick={handleBackToEmail}
                className="flex items-center gap-2 text-xl text-slate-300 hover:text-slate-400"
              >
                <FaArrowLeft />
                back
              </button>
            </div>
            <div>
              <button className="text-xl " onClick={handleCloseAllTab}>
                <FaTimes
                  size={20}
                  className="text-slate-300 hover:text-slate-400"
                />
              </button>
            </div>
          </div>
          <div className="flex flex-col px-2 py-1  justify-center mb-4 ">
            <div className="flex justify-center">
              <VerifyEmailSVG />
            </div>
            <h2 className="text-slate-200 text-lg font-light text-center">
              We have sent you code to your email!
            </h2>
          </div>
          <div>
            <form
              onSubmit={handleVerifyEmail}
              className="max-w-md mx-auto p-4 bg-[var(--light-dark-color)] rounded-lg "
            >
              <div className="mb-4">
                <label className="block text-sm text-slate-300 mb-2 font-light">
                  Verify Email!
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={handlVerifyCode}
                  className="text-slate-200 w-full px-3 py-2 focus:outline-none  bg-[var(--dark-bg-color)] rounded-2xl"
                  placeholder=""
                />
                <span className="text-red-500">{verificationError}</span>
              </div>
              {/* <span
                onClick={() => alert("teset")}
                className="cursor-pointer mb-4 p-3 rounded-xl mx-3 text-slate-300 font-light hover:bg-slate-600"
              >
                Skip email!
              </span> */}
              <div className="flex justify-center px-3 items-center  mt-4 py-2">
                <button
                  //   onClick={handleContinueToEmail}
                  className="w-full px-4 py-2  text-white rounded-md hover:bg-gray-500-700 disabled:opacity-50"
                  disabled={!!error}
                >
                  Verify Email
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default TwoStepVerification;
const EmailSvg = () => {
  return (
    <svg
      viewBox="0 0 36 36"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      className="w-48"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        fill="#C1694F"
        d="M22 33c0 2.209-8 2.209-8 0V23a4 4 0 0 1 8 0v10z"
      />
      <path fill="#99AAB5" d="M26 3H10v20h24V11a8 8 0 0 0-8-8z" />
      <path fill="#292F33" d="M10 3a8 8 0 0 0-8 8v12h16V11a8 8 0 0 0-8-8z" />
      <path
        fill="#99AAB5"
        d="M9 3c-3.866 0-7 3.582-7 8v12h14V11c0-4.418-3.134-8-7-8z"
      />
      <path
        fill="#DD2E44"
        d="M26 1h-4a2 2 0 0 0-2 2v12a2 2 0 0 0 4 0V7h2a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2z"
      />
    </svg>
  );
};
const VerifyEmailSVG = () => {
  return (
    <svg
      className="w-48"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.39254 16.2614C2.64803 13.1941 1.66074 9.71783 1.51646 6.15051C1.50127 5.77507 1.70918 5.42812 2.04153 5.25282L11.5335 0.246091C11.8254 0.0920859 12.1746 0.0920859 12.4665 0.246091L21.9585 5.25282C22.2908 5.42812 22.4987 5.77507 22.4835 6.15051C22.3393 9.71783 21.352 13.1941 19.6075 16.2614C17.8618 19.3307 15.4169 21.8869 12.4986 23.7001C12.1931 23.8899 11.8069 23.8899 11.5014 23.7001C8.58313 21.8869 6.13817 19.3307 4.39254 16.2614Z"
        fill="#0063FB"
      />
      <path
        d="M8.25 12.75L11.25 15L17.25 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
