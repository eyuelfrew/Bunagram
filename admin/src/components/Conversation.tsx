import { BiSolidConversation } from "react-icons/bi";
import { MdNoAccounts } from "react-icons/md";
import { TiMessages } from "react-icons/ti";

const Conversation = () => {
  return (
    <div className="flex w-full gap-5 justify-center md:justify-center md:gap-1  lg:justify-between mb-4 flex-wrap">
      <div className="w-64 h-24 shadow-lg  flex items-center justify-center gap-4">
        <BiSolidConversation className="flex-shrink-0 w-14 h-14 text-yellow-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        <div className="flex flex-col text-center">
          <span className="text-2xl text-slate-500">Conversation</span>
          <span className="text-xl text-slate-400">35+</span>
        </div>
      </div>
      <div className="w-64 h-24 shadow-lg  flex items-center justify-center gap-4">
        <TiMessages className="flex-shrink-0 w-14 h-14 text-pink-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />

        <div className="flex flex-col text-center">
          <span className="text-2xl text-slate-500">Messages</span>
          <span className="text-xl text-slate-400">350+</span>
        </div>
      </div>
      <div className="w-64 h-24 shadow-lg  flex items-center justify-center gap-4">
        <MdNoAccounts className="flex-shrink-0 w-14 h-14 text-red-600 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />

        <div className="flex flex-col text-center">
          <span className="text-2xl text-slate-500"> Deleted Acc</span>
          <span className="text-xl text-slate-400">350+</span>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
