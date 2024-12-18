import axios, { AxiosResponse } from "axios";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const VerifyAccount: React.FC = () => {
  const [code, setCode] = useState<string>();
  const [passwordError, setPassordError] = useState();
  const navigateTo = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response: AxiosResponse = await axios.post(
        `${import.meta.env.VITE_BACK_END_URL}/api/verify-email`,
        { verification_code: code },
        { withCredentials: true }
      );
      if (response.data.status === 200) {
        toast.success("Email verified successfully");
        navigateTo("/chat");
      } else {
        setPassordError(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-100 to-purple-300">
      <div className="max-w-md w-full bg-gradient-to-r from-indigo-800 to-purple-900 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden">
        <div className="px-8 py-10">
          <h2 className="text-3xl font-semibold text-center text-white mb-6">
            Verify your email
          </h2>

          <div className="space-y-6 flex flex-col">
            <div className="relative">
              <input
                type="password"
                name="code"
                value={code}
                onChange={handleChange}
                className="w-full h-12 px-4 bg-[var(--input-bg)] text-white text-center rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150 ease-in-out"
                placeholder="Enter 6 digit code"
              />
              {passwordError && (
                <span className=" bottom-0 left-0 text-red-500 text-sm mt-1">
                  {passwordError}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                // onClick={handleBackToLogIn}
                className="text-white font-light hover:text-indigo-500 transition duration-150 ease-in-out"
              >
                login
              </button>
              <button
                onClick={handleSubmit}
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

export default VerifyAccount;
