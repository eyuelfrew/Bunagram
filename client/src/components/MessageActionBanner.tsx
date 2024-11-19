import React from "react";
import { ImCross } from "react-icons/im";
interface MessageActionInterface {
  mode: string;
  message: string | undefined;
  darkMode: boolean;
  onCancel: () => void;
}
const MessageActionBanner: React.FC<MessageActionInterface> = ({
  mode,
  message,
  darkMode,
  onCancel,
}) => {
  return (
    <div
      className={`${
        darkMode
          ? "bg-gray-900 text-slate-300 shadow-lg"
          : "bg-slate-300 text-black shadow-md"
      } flex justify-between items-center px-4 py-2 z-[2000] absolute w-[99%] top-0 -mt-16 h-16 rounded-t-lg transition duration-300`}
    >
      <div className="w-full flex">
        <div className="w-1 bg-green-700 h-8 rounded-md mr-2"></div>
        <div className="">
          <h1 className="text-md font-semibold">
            {mode === "reply" ? "Reply to..." : "Edit Message"}
          </h1>
          <p className="truncate ... text-sm mt-1 w-72">
            <span>{message}</span>
          </p>
        </div>
      </div>
      <button
        onClick={onCancel}
        className={`text-xl ${darkMode ? "text-white" : "text-slate-600"}`}
        aria-label="Cancel action"
      >
        <ImCross />
      </button>
    </div>
  );
};

export default MessageActionBanner;
