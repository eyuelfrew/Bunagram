import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const navigateTo = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACK_END_URL}/api/reset-password/${token}`,
        { password: password }
      );
      console.log(response.data);
      if (response.data?.status === 1) {
        toast.success("Password reset successfully!");
        navigateTo("/");
        return;
      }
      if (response.data?.status === 0) {
        toast.error(response.data?.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="bg-[var(--hard-dark)] h-screen flex items-center justify-center">
      <div className="flex flex-col bg-[var(--dark-bg-color)] p-4  w-96">
        <h1 className=" text-white text-3xl p-2 mb-4 text-center">
          enter new password
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            value={password}
            type="password"
            className="h-10 rounded-xl bg-[var(--light-dark-color)] px-2 text-white"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="new password"
          />
          <input
            type="password"
            className="h-10 rounded-xl bg-[var(--light-dark-color)] px-2 text-white"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="confirm password"
          />

          <button
            type="submit"
            className="bg-green-700 w-full text-white rounded-lg py-3 text-xl"
          >
            Reset
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
