import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SetUserInfo } from "../store/actions/UserAction";
import { LogoutRequest } from "../services/authApi";
import { Root_State } from "../store/store";

const CloudPassword = () => {
  const hint = useSelector((state: Root_State) => state.UserReducers.hint);
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
    const response = await LogoutRequest();
    if (response.status === 1) {
      localStorage.clear();
      navigateTo("/");
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-100 to-purple-300">
      <div className="max-w-md w-full bg-gradient-to-r from-indigo-800 to-purple-900 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden">
        <div className="px-8 py-10">
          <h2 className="text-3xl font-semibold text-center text-white mb-6">
            Two-Step Verification
          </h2>

          <div className="space-y-6 flex flex-col">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full h-12 px-4 bg-[var(--input-bg)] text-white text-center rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150 ease-in-out"
                placeholder="Enter cloud password"
              />
              {passwordError && (
                <span className=" bottom-0 left-0 text-red-500 text-sm mt-1">
                  {passwordError}
                </span>
              )}
            </div>

            <span className="block text-slate-400 text-center ">
              Hint: {hint}
            </span>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleBackToLogIn}
                className="text-white font-light hover:text-indigo-500 transition duration-150 ease-in-out"
              >
                Back
              </button>
              <button
                onClick={handleVerifyPassword}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-150 ease-in-out"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudPassword;
