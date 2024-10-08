import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SetUserInfo } from "../store/actions/UserAction";
import { ResetLoginState } from "../store/actions/login";

const CloudPassword = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const handleVerifyPassword = async () => {
    if (password.trim() === "") {
      setPasswordError("insert your cloud password!");
      return;
    }
    const response = await axios.post(
      `${import.meta.env.VITE_BACK_END_URL}/api/verify-cloud-password`,
      { cloud_password: password },
      { withCredentials: true }
    );
    if (response.data?.loggedIn) {
      localStorage.setItem("token", response.data?.token);
      dispatch(SetUserInfo(response.data?.user));
      navigateTo("/chat");
    } else {
      setPasswordError(response.data?.message);
    }
    console.log(response.data);
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleBackToLogIn = async () => {
    dispatch(ResetLoginState());
    const response = await axios.get(
      `${import.meta.env.VITE_BACK_END_URL}/api/logout`,
      {
        withCredentials: true,
      }
    );
    if (response.data?.status === 1) {
      navigateTo("/");
    }
    if (response.data?.notAuth) {
      navigateTo("/");
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-[var(--hard-dark)]">
      <div className="max-w-md w-full bg-[var(--dark-bg-color)] bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
        <p className="text-center text-gray-300 mb-6 text-xl font-light">
          Two-Step Veriication
        </p>
        <div className="space-y-6 px-4 py-5">
          <div className="flex  flex-col">
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-gray-400 focus:outline-none"
            />
            <span className="text-red-500">{passwordError}</span>
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleBackToLogIn}
              className="  rounded-lg  text-lg font-light text-blue-500"
            >
              Forgot?
            </button>
            <button
              onClick={handleVerifyPassword}
              className="h-5 flex text-white items-center justify-center  rounded-lg  text-lg font-light"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudPassword;
