import { SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LogoutRequest, ResetPassword } from "../apis/Auth";

const NewPassword = () => {
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigateTo = useNavigate();

  const handlePasswordChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setPassword(e.target.value);
    setError("");
  };

  const handleConfirmPasswordChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setConfirmPassword(e.target.value);
    setError("");
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await ResetPassword(password);

      if (response?.status === 1) {
        toast.success("Password reset successful");
        navigateTo("/");
        return;
      }
      if (response?.status === 0) {
        toast.error("Something went wrong!");
        return;
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    }
  };
  const handleBackToLogin = async () => {
    localStorage.clear();
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
            Create New Password
          </h2>

          <div className="space-y-6 flex flex-col">
            <div className="relative">
              <input
                onChange={handlePasswordChange}
                type="password"
                value={password}
                className="w-full h-12 px-4 bg-[var(--input-bg)] text-white text-center rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150 ease-in-out"
                placeholder="New Password"
              />
            </div>

            <div className="relative">
              <input
                onChange={handleConfirmPasswordChange}
                type="password"
                value={confirmPassword}
                className="w-full h-12 px-4 bg-[var(--input-bg)] text-white text-center rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150 ease-in-out"
                placeholder="Confirm New Password"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleBackToLogin}
                className="px-6 py-2  text-white font-semibold rounded-lg transition duration-150 ease-in-out"
              >
                login
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-150 ease-in-out"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
