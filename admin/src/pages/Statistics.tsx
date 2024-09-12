import { FaUserTimes } from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import Conversation from "../components/Conversation";

const Statistics = () => {
  return (
    <>
      <div className="flex w-full gap-5 justify-center md:justify-center md:gap-1  lg:justify-between mb-4 flex-wrap">
        <div className="w-64 h-24 shadow-lg  flex items-center justify-center gap-4">
          <HiUsers className="flex-shrink-0 w-14 h-14 text-blue-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          <div className="flex flex-col text-center">
            <span className="text-2xl text-slate-500">Users</span>
            <span className="text-xl text-slate-400">35+</span>
          </div>
        </div>
        <div className="w-64 h-24 shadow-lg  flex items-center justify-center gap-4">
          <HiUsers className="flex-shrink-0 w-14 h-14 text-green-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />

          <div className="flex flex-col text-center">
            <span className="text-2xl text-slate-500">Online users</span>
            <span className="text-xl text-slate-400">350+</span>
          </div>
        </div>
        <div className="w-64 h-24 shadow-lg  flex items-center justify-center gap-4">
          <FaUserTimes className="flex-shrink-0 w-14 h-14 text-red-600 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />

          <div className="flex flex-col text-center">
            <span className="text-2xl text-slate-500"> Not Verified</span>
            <span className="text-xl text-slate-400">350+</span>
          </div>
        </div>
      </div>
      <Conversation />
    </>
  );
};

export default Statistics;
