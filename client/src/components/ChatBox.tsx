import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Typing } from "./Typing";
import { useDispatch, useSelector } from "react-redux";
import { Root_State } from "../store/store";
import moment from "moment";
import { IoMdSend } from "react-icons/io";
import { updateReceiver } from "../store/actions/getRecever";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { UseSocket } from "../context/SocketContext";
import ChatMenu from "./ChatMenu";

// import { FaPlus, FaImage, FaVideo } from "react-icons/fa";
import LottieAnimation from "./LottieAnimation";
import { MdOutlineAttachFile } from "react-icons/md";

interface Message {
  text: string;
  imageURL: string;
  videoURL: string;
}
interface AllMessage {
  text: string;
  createdAt: string;
  msgByUserId: string;
  seen: boolean;
}
const ChatBox = () => {
  const dispatch = useDispatch();

  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [typerId, setTyperID] = useState<string>();
  const user = useSelector((state: Root_State) => state.UserReducers);
  const { socket, onlineUsers } = UseSocket();
  const SocketConnection = socket;
  const Recever = useSelector((state: Root_State) => state.receiverReducer);
  const currentMessage = useRef<HTMLDivElement | null>(null);
  const [allMessages, setAllMessage] = useState<AllMessage[]>([]);
  const [message, setMessage] = useState<Message>({
    text: "",
    imageURL: "",
    videoURL: "",
  });
  // const [FileUpload, setFileUpload] = useState(false);
  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessages]);
  useEffect(() => {
    setMessage({ ...message, text: "" });
    if (SocketConnection && Recever.recever_id) {
      SocketConnection.emit("message-page", {
        sender: user._id,
        receiver: Recever.recever_id,
      });
      SocketConnection.emit("seen", Recever?.messageByUser);

      const handleTyping = (typerId: string) => {
        setTyperID(typerId);
        setIsTyping(true);
      };
      const handleStopTyping = () => {
        setIsTyping(false);
      };
      SocketConnection.on("typing", handleTyping);
      SocketConnection.on("stop typing", handleStopTyping);
      return () => {
        SocketConnection.off("typing", handleTyping);
        SocketConnection.off("stop typing", handleStopTyping);
      };
    }
  }, [SocketConnection, Recever, socket]);

  useEffect(() => {
    if (SocketConnection && Recever) {
      const messageHandler = (data: {
        reciver: string;
        convID: string;
        messages: React.SetStateAction<AllMessage[]>;
      }) => {
        const test = data.convID === Recever.conversation_id;
        if (test) {
          setAllMessage(data.messages);
          SocketConnection.emit("seen", Recever.recever_id);
          return;
        } else if (Recever.recever_id === data.reciver) {
          setAllMessage(data.messages);
          return;
        } else {
          return;
        }
      };
      const handleNewConveration = (newConversationId: { convID: string }) => {
        dispatch(updateReceiver(newConversationId.convID));
      };
      SocketConnection.on("message", messageHandler);
      SocketConnection.on("newconversation", handleNewConveration);
      // Clean up the event listener when the component unmounts or dependencies change
      return () => {
        SocketConnection.off("message", messageHandler);
      };
    }
  }, [Recever, SocketConnection, dispatch]);

  const isOnline = onlineUsers.includes(Recever.recever_id);
  const isBlocked = user.blockedUsers.includes(Recever.recever_id);
  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (SocketConnection && message.text.trim() !== "") {
      SocketConnection.emit("newmessage", {
        sender: user?._id,
        receiver: Recever.recever_id,
        text: message.text,
        msgByUserId: user?._id,
        conversation_id: Recever.conversation_id || "",
      });
      setMessage({ ...message, text: "" });
    }
  };

  const handleOnMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMessage({ ...message, [name]: value });
    if (!SocketConnection) return;
    if (!typing) {
      setTyping(true);
      SocketConnection.emit("typing", {
        recevierId: Recever.recever_id,
        typerId: user._id,
      });
    }
    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        SocketConnection.emit("stop typing", Recever.recever_id);
        setIsTyping(false);
        setTyping(false);
      }
    }, timerLength);
  };
  //update Message and form when recever state changes
  useEffect(() => {
    setMessage({ ...message, text: "" });
  }, [Recever]);

  const blockedByReciver = Recever.blockedUsers.includes(user._id);

  return (
    <div>
      <div>
        <header className="sticky top-0 bg-[var(--dark-bg-color)] text-white h-24 flex items-center justify-between px-3 lg:px-8">
          <div className="flex items-center">
            <div className="lg:hidden ml-1 me-4">
              <Link to={"/chat"} className="bg-red-400 ">
                <FaArrowLeft />
              </Link>
            </div>
            <div className="relative">
              {user._id === Recever.recever_id ? (
                <>
                  <img
                    className="w-[55px] lg:w-[75px] lg:h-[75px] rounded-full "
                    src={`/savedmessage.jpg`}
                    alt={`${Recever.full_name}`}
                  />
                </>
              ) : (
                <>
                  {blockedByReciver || Recever.profile_pic.trim() === "" ? (
                    <>
                      <img
                        className="w-[55px] lg:w-[75px] lg:h-[75px] rounded-full "
                        src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOtu74pEiq7ofeQeTsco0migV16zZoBwSlGg&s`}
                        alt={`${Recever.full_name}`}
                      />
                    </>
                  ) : (
                    <>
                      <img
                        className="w-24 h-24 rounded-full "
                        src={`${Recever.profile_pic}`}
                        alt=""
                      />
                    </>
                  )}
                </>
              )}

              {user._id !== Recever.recever_id && (
                <>
                  {isOnline && !blockedByReciver ? (
                    <div className="absolute w-4 h-4 rounded-full bg-green-400 right-0 top-10 lg:top-14"></div>
                  ) : (
                    <>
                      <div className="absolute w-4 h-4 rounded-full bg-red-500 right-0 top-10 lg:top-14"></div>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="">
              <p className="text-xl lg:text-2xl ml-4">
                {user._id === Recever.recever_id ? (
                  <>Saved Messages</>
                ) : (
                  <> {Recever.full_name}</>
                )}
              </p>
              {user._id !== Recever.recever_id && (
                <div className=" h-6">
                  {blockedByReciver ? (
                    <>
                      <p className="mx-2 text-slate-400">
                        lastseen long time ago
                      </p>
                    </>
                  ) : (
                    <></>
                  )}
                  {istyping && typerId == Recever.recever_id ? (
                    <>
                      <Typing />
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className=" h-fit text-white p-2 rounded-lg">
            <ChatMenu />
          </div>
        </header>
        <section className="h-[calc(100vh-160px)] bg-[var(--light-dark-color)] overflow-x-hidden overflow-y-scroll scrollbar  ">
          {allMessages.length === 0 && (
            <>
              <div className=" h-full flex items-center">
                <LottieAnimation />
              </div>
            </>
          )}
          {allMessages.length > 0 &&
            allMessages.map((msg, index) => {
              return (
                <div
                  ref={currentMessage}
                  key={index}
                  className={`text-gray-300 max-w-48 lg:max-w-96 mx-4 bg-[var(--message-bg)]  mb-2
                   p-3 py-1 rounded w-fit h-fit ${
                     user._id === msg.msgByUserId
                       ? "ml-auto bg-[var(--message-bg)]"
                       : ""
                   }`}
                >
                  <p className="break-words">{msg.text}</p>
                  <p className="text-xs">
                    {moment("2024-09-06T09:57:58.030Z").format("hh:mm")}
                  </p>
                </div>
              );
            })}
        </section>

        <section className="flex items-center h-16 bg-[var(--medium-dard)] p-4">
          {isBlocked ? (
            <>
              <div className="h-full w-full flex justify-around items-center ">
                <div className=" w-full flex items-center">
                  <button className="rounded-2xl py-1 px-4 h-12  outline-none w-full bg-[var(--messge-input-dark)] text-red-400">
                    unblock user
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {blockedByReciver ? (
                <>
                  <div className=" w-full flex items-center justify-center ">
                    <p className="rounded-2xl py-1 px-4 h-12  outline-none w-full bg-[var(--messge-input-dark)] text-white text-center flex items-center justify-center">
                      can't send message
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <button className="hover:bg-slate-800 px-4 py-2">
                      <MdOutlineAttachFile size={30} className="text-white" />
                    </button>
                  </div>
                  <form
                    className="h-full w-full flex justify-around items-center "
                    onSubmit={handleSendMessage}
                  >
                    <div className=" w-full flex items-center">
                      <input
                        type="text"
                        name="text"
                        className="rounded-2xl py-1 px-4 h-12  outline-none w-full bg-[var(--messge-input-dark)] text-white"
                        placeholder="Write a message..."
                        value={message.text}
                        onChange={handleOnMessageChange}
                      />
                      <button
                        type="submit"
                        className="h-12 px-4 text-white hover:bg-slate-800"
                      >
                        <IoMdSend size={25} />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default ChatBox;
