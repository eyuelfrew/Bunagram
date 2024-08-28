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
import { CiMenuKebab } from "react-icons/ci";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

// import { FaPlus, FaImage, FaVideo } from "react-icons/fa";

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
  const user = useSelector((state: Root_State) => state.userReducer.user);
  const { socket, onlineUsers } = useSelector(
    (state: Root_State) => state.socket
  );
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
      // console.log({
      //   sender: user._id,
      //   receiver: Recever.recever_id,
      // });
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
        console.log(data.reciver);
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
  }, [SocketConnection, Recever]);

  const isOnline = onlineUsers.includes(Recever.recever_id);
  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (SocketConnection && message.text.trim() !== "") {
      SocketConnection.emit("newmessage", {
        sender: user?._id,
        receiver: Recever.recever_id,
        text: message.text,
        msgByUserId: user?._id,
        conversation_id: Recever.conversation_id,
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
              <img
                className="w-[55px] lg:w-[75px] lg:h-[75px] rounded-full "
                src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOtu74pEiq7ofeQeTsco0migV16zZoBwSlGg&s`}
                alt={`${Recever.full_name}`}
              />
              {isOnline ? (
                <div className="absolute w-4 h-4 rounded-full bg-green-400 right-0 top-10 lg:top-14"></div>
              ) : (
                <>
                  <div className="absolute w-4 h-4 rounded-full bg-red-500 right-0 top-10 lg:top-14"></div>
                </>
              )}
            </div>
            <div className="">
              <p className="text-xl lg:text-2xl ml-4">{Recever.full_name}</p>
              <div className=" h-6">
                {istyping && typerId == Recever.recever_id ? (
                  <>
                    <Typing />
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className=" h-fit text-white p-2 rounded-lg">
            <button className="text-white text-2xl">
              <CiMenuKebab />
            </button>
          </div>
        </header>
        <section className="h-[calc(100vh-160px)] bg-[var(--light-dark-color)] overflow-x-hidden overflow-y-scroll scrollbar  ">
          {allMessages &&
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
                    {moment(msg.createdAt).format("hh:mm")}
                  </p>
                </div>
              );
            })}
        </section>

        <section className="flex items-center h-16 bg-[var(--medium-dard)] p-4">
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
              <button type="submit" className="h-12 px-4 text-white">
                <IoMdSend size={25} />
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ChatBox;
