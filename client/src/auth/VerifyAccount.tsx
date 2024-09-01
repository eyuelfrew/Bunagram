import axios, { AxiosResponse } from "axios";
import { ChangeEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const VerifyAccount: React.FC = () => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigateTo = useNavigate();

  const handleChange = (index: number, value: string) => {
    const newCode = [...code];

    // Handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }

      setCode(newCode);

      // Focus on the last non-empty input or the first empty one
      let lastFilledIndex = 0;
      for (let i = 5; i >= 0; i--) {
        if (newCode[i] !== "") {
          lastFilledIndex = i;
          break;
        }
      }
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      if (inputRefs.current[focusIndex]) {
        inputRefs.current[focusIndex]?.focus();
      }
    } else {
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input field if value is entered
      if (value && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const verification_code = code.join("");
    console.log(verification_code);
    try {
      try {
        const response: AxiosResponse = await axios.post(
          `${import.meta.env.VITE_BACK_END_URL}/api/verifiy-email`,
          { verification_code },
          { withCredentials: true }
        );
        console.log(response);
        if (response.data.status === 200) {
          toast.success("Email verified successfully");
          navigateTo("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //   useEffect(() => {
  //     if (code.every((digit) => digit !== "")) {
  //       if (code.every((digit) => digit !== "")) {
  //         handleSubmit(new Event("submit"));
  //       }
  //     }
  //   }, [code]);
  return (
    <div className="flex justify-center items-center h-screen bg-[var(--hard-dark)]">
      <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Enter the 6-digit code sent to your email address.
        </p>

        <form className="space-y-6 px-4 py-5" onSubmit={handleSubmit}>
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1} // Adjusted maxLength to 1
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
              />
            ))}
          </div>
          <button
            type="submit"
            className="bg-green-700 w-full text-white rounded-lg py-3 text-xl"
          >
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyAccount;
