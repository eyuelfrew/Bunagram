import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { VerifyEmail } from "../apis/Auth";

const VerifyPasswordReset = () => {
  const [verification_code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigateTo = useNavigate();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    setError("");
  };

  const handleSubmit = async () => {
    if (!verification_code || verification_code.length !== 6) {
      setError("Please enter a 6-digit code.");
      return;
    }

    try {
      const response = await VerifyEmail(verification_code);
      if (response?.status === 200) {
        toast.success("Email verified");
        navigateTo("/newpass");
      }
      if (response?.status == 0) {
        toast.error("Wrong Token!");
        return;
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
            Email Verification
          </h2>

          <div className="space-y-6 flex flex-col">
            <div className="relative">
              <input
                onChange={handleChange}
                type="number"
                value={verification_code}
                className="w-full h-12 px-4 bg-[var(--input-bg)] text-white text-center rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150 ease-in-out"
                placeholder="Enter verification code"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <div className="flex justify-between items-center mt-4">
              <Link
                to={"/"}
                className="text-white font-light hover:text-indigo-500 transition duration-150 ease-in-out"
              >
                Login
              </Link>
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

export default VerifyPasswordReset;
