import React, {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Typing } from "./Typing";
import { useDispatch, useSelector } from "react-redux";
import { Root_State } from "../store/store";
import moment from "moment";
import { clearReciver, updateReceiver } from "../store/actions/getRecever";
import { FaArrowLeft, FaCheckDouble } from "react-icons/fa";
import { Link } from "react-router-dom";
import { UseSocket } from "../context/SocketContext";
import ChatMenu from "./ChatMenu";

import LottieAnimation from "./LottieAnimation";
import SendImage from "./SendImage";
import {
  MdArrowDownward,
  MdContentCopy,
  MdDelete,
  MdModeEdit,
  MdOutlineReply,
} from "react-icons/md";
import EmojiPicker from "./EmojiPicker";
import { LiaCheckDoubleSolid } from "react-icons/lia";
import { ImCross } from "react-icons/im";
import {
  DeleteSingleMessage,
  FetchAllMessage,
  SendMessage,
  UpdateSingleMessage,
} from "../services/API";
import { Recevier } from "../types/Types";
import toast from "react-hot-toast";
import {
  decryptIncomingMessage,
  decryptMessage,
  encryptMessage,
} from "../utils/EncryptionService";
import { FaCheck } from "react-icons/fa6";
import { DeleteSelectedMessages } from "../services/MessagesApi";
import { TiCancelOutline } from "react-icons/ti";

interface Message {
  text: string;
  imageURL: string;
  _id: string;
  msgByUserId: string;
  replyToMessageId: { text: string; _id: string };
  createdAt: string;
  updatedAt: string;
}
interface AllMessage {
  _id: string;
  text: string;
  createdAt: string;
  msgByUserId: string;
  seen: boolean;
  imageURL: string;
  replyToMessageId: { text: string; _id: string };
}
interface ContextMenuProps {
  visible: boolean;
  messageId: string | null;
  x: number;
  y: number;
}
const ChatBox = () => {
  // array of selected message handle state
  const [showButton, setShowButton] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const darkMode = useSelector((state: Root_State) => state.theme.darkMode);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps | null>(null);
  const currentMessage = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const URI = import.meta.env.VITE_BACK_END_URL;
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [typerId, setTyperID] = useState<string>();
  const user = useSelector((state: Root_State) => state.UserReducers);
  const { socket, onlineUsers } = UseSocket();
  const SocketConnection = socket;
  const messageEndRef = useRef<HTMLDivElement>(null);
  const Recever = useSelector((state: Root_State) => state.receiverReducer);
  const [allMessages, setAllMessage] = useState<AllMessage[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isReply, setIsReplay] = useState(false);
  const [replayMessage, setReplyMessage] = useState<string | undefined>("");
  const [message, setMessage] = useState({
    text: "",
    imageURL: "",
    replyToMessageId: "",
  });
  const [editMessageID, setEditMessageId] = useState<AllMessage>();
  /* 
  ---Edit Message State  
  */
  const [isEdit, setIsEdit] = useState(false);
  const [editMessage, setEditMessage] = useState({ text: "", _id: "" });
  const blockedByReciver = Recever.blockedUsers.includes(user._id);
  const [previousRoom, setPreviousRoom] = useState<string | null>(null);

  /*
  -- handle right clikc context menu
  */
  const handleRightClick = (
    event: MouseEvent<HTMLDivElement>,
    messageId: string
  ) => {
    event.preventDefault();
    // Get the window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate the position of the context menu and ensure it stays within the viewport
    const xPos =
      event.pageX + 150 > windowWidth ? windowWidth - 160 : event.pageX; // Adjust for width
    const yPos =
      event.pageY + 100 > windowHeight ? windowHeight - 110 : event.pageY; // Adjust for height

    setContextMenu({
      visible: true,
      messageId,
      x: xPos,
      y: yPos,
    });
  };
  // hande reply clikc
  const handleReplay = (message_id: string) => {
    const messageToReply = allMessages.find((msg) => msg._id === message_id);
    const text = messageToReply?.text.toString();
    setMessage({ ...message, replyToMessageId: message_id });
    setIsReplay(true);
    setReplyMessage(text);
  };
  // close right clicked menu when clicked some where else
  const handleClickOutside = () => {
    setContextMenu(null);
  };
  //cansle reply
  const handleCancelReplay = () => {
    setIsReplay(false);
    setReplyMessage("");
  };

  // import.meta.env.VITE_TRANSIT_KEY
  /*
  -- Fetch Messages One Time When Reciver State Changes
  -- 
  */
  const fetchAllMessages = async () => {
    const response = await FetchAllMessage(Recever.recever_id);
    let AllMessages = response;
    AllMessages = AllMessages.map((message: Message) => {
      return {
        ...message,
        text: decryptMessage(message.text),
      };
    });
    setAllMessage(AllMessages);
    // SocketConnection?.emit("seen-all", { rec_id: Recever.recever_id });
  };
  useEffect(() => {
    setAllMessage([]);
    if (Recever.recever_id.trim() != "") {
      fetchAllMessages();
    }

    if (SocketConnection) {
      // Leave the old room if there is a previous conversation
      if (previousRoom) {
        SocketConnection.emit("leave-room", { roomName: previousRoom });
      }

      // Join the new room
      const newRoom = `conversation_${Recever.conversation_id}`;
      SocketConnection.emit("join-room", { roomName: newRoom });
      SocketConnection.emit("all-seen", {
        senderId: Recever.recever_id,
        conversationId: Recever.conversation_id,
      });
      console.log("State Changeing here!!!");
      // Update the current room reference
      setPreviousRoom(newRoom);
    }
  }, [Recever.recever_id]);
  useEffect(() => {
    if (SocketConnection) {
      // Join the new room
      const newRoom = `conversation_${Recever.conversation_id}`;
      SocketConnection.emit("join-room", { roomName: newRoom });
    }
  }, [Recever, SocketConnection]);
  /*
  --- message scroll down effect
  */
  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessages]);
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = (event.currentTarget as HTMLDivElement).scrollTop; // Assert type to HTMLDivElement
    if (scrollTop <= 2000) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };
  const handleBackToLatestMessge = () => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    setMessage({ ...message, text: "" });
    if (SocketConnection && Recever.recever_id) {
      const handleTyping = (typerId: string) => {
        setTyperID(typerId);
        setIsTyping(true);
      };
      const handleStopTyping = () => {
        setIsTyping(false);
      };
      const handleMessageDeleted = (messageId: string) => {
        setAllMessage((prevMessages) => {
          // Filter the previous messages, removing the one with the deleted ID
          const updatedMessages = prevMessages.filter(
            (msg) => msg._id !== messageId
          );
          return updatedMessages;
        });
      };
      SocketConnection.on("typing", handleTyping);
      SocketConnection.on("message-deleted", handleMessageDeleted);
      SocketConnection.on("stop typing", handleStopTyping);
    }
  }, [Recever, SocketConnection, user._id]);

  /*
  --- Fetch Message And Emit Seen Messages
  */
  useEffect(() => {
    if (SocketConnection && Recever) {
      const NewMessageHandler = async (data: {
        reciver: string;
        message: AllMessage;
        convID: string;
        sender_id: string;
      }) => {
        setMessage({ ...message, text: "" });
        data.message.text = await decryptIncomingMessage(data?.message?.text);
        const string_con = (Recever.conversation_id || "").toString().trim();
        const new_conversation_id = (data?.convID || "").toString().trim();

        // Only dispatch if the current conversation_id is empty or different
        if (!string_con || string_con !== new_conversation_id) {
          dispatch(updateReceiver(new_conversation_id));
        }
        setAllMessage((allMessages) => {
          const messageExists = allMessages.some(
            (msg) => msg._id === data?.message._id
          );
          if (!messageExists) {
            return [...allMessages, data?.message];
          }
          return allMessages;
        });
        // If the recipient and sender are in the same room, send a "message seen" event
        SocketConnection.emit("message-seen", {
          conversationId: data.convID,
          messageId: data.message._id,
          senderId: data.sender_id,
          receiverId: Recever.recever_id,
        });
      };

      const handleNewConveration = (newConversationId: { convID: string }) => {
        dispatch(updateReceiver(newConversationId.convID));
      };
      const handleUpdatedMessage = async (updatedMessage: AllMessage) => {
        const plan_text = await decryptMessage(updatedMessage.text);
        setAllMessage((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === updatedMessage._id ? { ...msg, text: plan_text } : msg
          )
        );
      };
      const handleClearChatSocket = () => {
        setAllMessage([]);
      };
      const handleSeenAllMessage = () => {
        console.log("All Seen Functionality");
        setAllMessage((prevMessages) =>
          prevMessages.map((msg) => ({
            ...msg,
            seen: true,
          }))
        );
      };
      SocketConnection.on("newconversation", handleNewConveration);
      SocketConnection.on("new-message", NewMessageHandler);
      SocketConnection.on("updated-message", handleUpdatedMessage);
      SocketConnection.on("clear-chat", handleClearChatSocket);
      SocketConnection.on("all-seen", handleSeenAllMessage);
      SocketConnection.on("mutli-message-deleted", (deletedMessages) => {
        setAllMessage((prevMessages) =>
          prevMessages.filter((msg) => !deletedMessages.includes(msg._id))
        );
      });

      SocketConnection.on("message-seen", (data) => {
        setAllMessage((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === data.messageId ? { ...msg, seen: true } : msg
          )
        );
      });
    }
  }, [Recever.conversation_id, SocketConnection]);

  const isOnline = onlineUsers.includes(Recever.recever_id);
  const isBlocked = user.blockedUsers.includes(Recever.recever_id);
  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEdit && SocketConnection && message.text.trim() !== "") {
      const payload = {
        reciver_id: Recever.recever_id,
        text: message.text,
        conversation: Recever.conversation_id || "",
      };
      await SendMessage(payload);

      setMessage({ ...message });
    }
  };

  const handleOnMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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

  const handleDeleteMessage = async (msgId: string) => {
    const updatedMessages = allMessages.filter((msg) => msg._id !== msgId);
    setAllMessage(updatedMessages);
    const conversation_id: string | Recevier = Recever.conversation_id;
    await DeleteSingleMessage(msgId, Recever.recever_id, conversation_id);
  };

  /*
-- Hundle emoji selection or picker
*/
  // const inputRef = useRef<HTMLTextAreaElement>(null);
  const handleEmojiPiker = (emoji: string) => {
    const inputElement = textareaRef.current;
    if (inputElement) {
      const start = inputElement.selectionStart ?? 0;
      const end = inputElement.selectionEnd ?? 0;
      // Insert the emoji at the current cursor position
      const newText =
        message.text.slice(0, start) + emoji + message.text.slice(end);

      // Update the input field value
      setMessage({ ...message, text: newText });

      // Set the cursor position after the emoji
      setTimeout(() => {
        const newCursorPosition = start + emoji.length;
        inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
        inputElement.focus(); // Keep the focus on the input
      }, 0);
    }
  };

  /*
  --- Hundle Edit message
  */
  const handleEditMessage = (msg: AllMessage) => {
    setEditMessageId(msg);
    setIsEdit(true);
    setEditMessage({ ...editMessage, text: msg.text, _id: msg._id });
    setMessage({ ...message, text: msg.text });
  };

  /*
  -- hundle cancel edit
  */
  const handleCancelEdit = () => {
    setIsEdit(false);
    setEditMessage({ ...editMessage, text: "", _id: "" });
    setMessage({ ...message, text: "" });
  };

  /*
  -- Send Message By Hitting The Enter Key
  */
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      const { name, value } = e.currentTarget;
      setMessage({ ...message, [name]: value + "\n" });
    }
    if (e.key === "Enter" && !isEdit) {
      if (e.shiftKey) {
        return;
      } else {
        e.preventDefault();
        setIsReplay(false);
        setReplyMessage("");
        const payload = {
          reciver_id: Recever.recever_id,
          text: await encryptMessage(message.text),
          conversation: Recever.conversation_id || "",
          replyToMessageId: message?.replyToMessageId
            ? message.replyToMessageId
            : null,
        };
        const textarea = textareaRef.current;
        if (textarea) {
          // textarea.style.height = "45px"; // Reset to initial height
        }
        await SendMessage(payload);
        setMessage({
          text: "",
          imageURL: "",
          replyToMessageId: "",
        });
      }
    }
    if (isEdit && e.key === "Enter" && message.text.trim() !== "") {
      setAllMessage((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === editMessageID?._id ? { ...msg, text: message.text } : msg
        )
      );
      const editedMessage = {
        // message: await EncService.EncryptMessage(message.text),
        message: await encryptMessage(message.text),
        reciver_id: Recever.recever_id,
        message_id: editMessageID?._id,
      };
      await UpdateSingleMessage(editedMessage);
      setIsEdit(false);
      setMessage({ ...message, text: "" });
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    // Reset the height to auto so it can shrink if necessary
    textarea.style.height = "45px";
    // Set the height to the scrollHeight to expand
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
  // Function to resize the textarea based on its scrollHeight
  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "45px"; // Reset height first
      textarea.style.height = `${textarea.scrollHeight}px`; // Adjust based on scrollHeight
    }
  }; // Use effect to adjust the height when the message changes
  useEffect(() => {
    resizeTextarea(); // Call resizeTextarea whenever the message.text changes

    // Reset height when the message is cleared
    if (message.text === "") {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "45px"; // Reset height to the initial value
      }
    }
  }, [message.text]);
  const handleClearRecever = () => {
    SocketConnection &&
      SocketConnection.emit("leave-room", { roomName: previousRoom });
    dispatch(clearReciver());
  };

  /*
 -- Selecting message function
 */
  const handleSelectMessage = (messageId: string) => {
    if (selectedMessages.includes(messageId)) {
      setSelectedMessages(
        selectedMessages.filter((msgId) => msgId !== messageId)
      );
    } else {
      setSelectedMessages([...selectedMessages, messageId]);
    }
    console.log(selectedMessages);
  };
  /*
  --- hande unlselect all
  */
  const handleSelectAll = () => {
    setSelectedMessages(allMessages.map((msg) => msg._id)); // Select all
  };
  /*
  --- handle unselect all
  */
  const handleUnSelectAll = () => {
    setSelectedMessages([]);
  };
  /*
  --- handle delet selected messages
  */
  const handleDeleteSelected = async () => {
    if (selectedMessages.length > 0) {
      const updatedMessages = allMessages.filter(
        (msg) => !selectedMessages.includes(msg._id)
      );

      setAllMessage(updatedMessages);
    } else {
      return;
    }

    const conversation_id = Recever.conversation_id.toString();
    setSelectedMessages([]);
    const res = await DeleteSelectedMessages(selectedMessages, conversation_id);
    if (res.success) {
      setSelectedMessages([]);
      toast.success(res.message);
    }
  };

  return (
    <div className="" onClick={handleClickOutside}>
      <header
        onClick={handleClickOutside}
        className={`${
          darkMode ? "bg-[var(--dark-bg-color)]" : "bg-[var(--cobalt-blue)]"
        } top-0  text-white h-24 flex items-center justify-between px-3 lg:px-8 transition duration-500`}
      >
        <div className="flex items-center ">
          <div className="lg:hidden ml-1 me-4">
            <Link onClick={handleClearRecever} className="bg-red-400 " to={""}>
              <FaArrowLeft />
            </Link>
          </div>
          <div className="relative">
            {user._id === Recever.recever_id ? (
              <>
                <img
                  className="w-[55px] lg:w-[75px] lg:h-[75px] rounded-full "
                  src={`./savedmessage.jpg`}
                  alt={`${Recever.full_name}`}
                />
              </>
            ) : (
              <>
                {Recever.deletedAccount ? (
                  <>
                    <img
                      className="w-[55px] lg:w-[75px] lg:h-[75px] rounded-full "
                      src={`./deletedccount.jpg`}
                      alt={`${Recever.full_name}`}
                    />
                  </>
                ) : (
                  <>
                    {blockedByReciver || Recever.profile_pic.trim() === "" ? (
                      <>
                        <img
                          className="w-[55px] lg:w-[75px] lg:h-[75px] rounded-full "
                          src={`./userpic.png`}
                          alt={`${Recever.full_name}`}
                        />
                      </>
                    ) : (
                      <>
                        <img
                          className="w-[55px] h-[55px] lg:w-[75px] lg:h-[75px] rounded-full "
                          src={`${URI}${Recever.profile_pic}`}
                          alt=""
                        />
                      </>
                    )}
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
                    <span className="absolute ml-10 w-[270%] top-8 left-6  lg:top-12 lg:left-10 flex">
                      {Recever?.lastSeen && !blockedByReciver ? (
                        <>
                          last seen at{" "}
                          {moment(Recever?.lastSeen || "").format("hh:mm") ||
                            ""}
                        </>
                      ) : (
                        <></>
                      )}
                    </span>
                  </>
                )}
              </>
            )}
          </div>
          <div className="">
            <p className="text-xl lg:text-2xl ml-4">
              {Recever.deletedAccount ? (
                <>
                  <span>Deleted Account</span>
                </>
              ) : (
                <>
                  {user._id === Recever.recever_id ? (
                    <></>
                  ) : (
                    <> {Recever.full_name}</>
                  )}
                </>
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
        <div className=" text-white p-2 rounded-lg ">
          <ChatMenu />
        </div>
      </header>
      <section
        onScroll={handleScroll}
        onClick={handleClickOutside}
        className={`h-[calc(100vh-160px)] ${
          darkMode ? "bg-[var(--light-dark-color)]" : "bg-[var(--blue-grotto)]"
        } overflow-x-hidden overflow-y-scroll scrollbar`}
      >
        {allMessages.length === 0 && (
          <>
            <div className=" h-full flex items-center">
              <LottieAnimation />
            </div>
          </>
        )}
        {allMessages.length > 0 &&
          allMessages.map((msg, _index) => {
            return (
              <div
                key={_index}
                id={`${msg._id}`}
                className={`${
                  selectedMessages.includes(msg._id) ? "bg-slate-700 " : ""
                } transition duration-500`}
                ref={currentMessage}
              >
                <div
                  onContextMenu={(event) => handleRightClick(event, msg._id)}
                  onClick={handleClickOutside}
                  className={` cursor-pointer relative min-w-28 max-w-48 lg:max-w-96 mx-4 mb-2
                 p-3 py-1 rounded w-fit h-fit ${
                   user._id === msg.msgByUserId
                     ? `ml-auto ${
                         darkMode
                           ? "bg-[var(--message-bg)] text-slate-300 "
                           : "bg-green-300"
                       }`
                     : `${
                         darkMode
                           ? "bg-[var(--hard-dark)] text-slate-300 "
                           : "bg-red-200"
                       }`
                 } transition duration-500 `}
                >
                  {msg?.replyToMessageId && (
                    <div className="bg-slate-600 overflow-hidden mb-3">
                      <Link
                        to={`#${msg?.replyToMessageId}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const elementMessage = document.getElementById(
                            msg?.replyToMessageId._id
                          );
                          if (elementMessage) {
                            elementMessage.scrollIntoView({
                              behavior: "smooth",
                            });
                            elementMessage.classList.add("bg-slate-500");
                            setTimeout(() => {
                              elementMessage.classList.remove("bg-slate-500");
                            }, 2000);
                          }
                        }}
                        className="block w-full border-l-4 border-green-500 p-3 text-slate-200 bg-slate-600"
                      >
                        <span className="truncate ...">
                          {decryptMessage(msg?.replyToMessageId?.text)}
                        </span>
                      </Link>
                    </div>
                  )}

                  {msg.imageURL && (
                    <img
                      src={`${URI}${msg.imageURL}`}
                      alt="Image"
                      className="w-full rounded-lg mb-2"
                    />
                  )}

                  <p className="break-words">{msg.text}</p>

                  <div className="text-xs mt-1 text-right">
                    {moment(msg.createdAt).format("hh:mm A")}
                    {user._id === msg.msgByUserId && msg.seen && (
                      <div className="inline-block ml-2">
                        <LiaCheckDoubleSolid size={16} />
                      </div>
                    )}
                  </div>

                  {contextMenu &&
                    contextMenu.messageId === msg._id &&
                    contextMenu.visible && (
                      <div
                        className={`absolute w-40 z-50 rounded-lg shadow-lg p-2 ${
                          msg.msgByUserId.trim() === user._id.trim()
                            ? "right-10"
                            : "-right-12"
                        } ${
                          darkMode
                            ? "bg-[var(--dark-bg-color)]"
                            : "bg-slate-100"
                        }`}
                      >
                        <ul className="flex flex-col gap-4">
                          <li
                            className={`flex items-center gap-2 cursor-pointer transition-colors duration-300 ${
                              darkMode
                                ? "hover:bg-[var(--light-dark-color)]"
                                : "hover:bg-slate-300"
                            }`}
                            onClick={() => {
                              handleReplay(msg._id);
                              setContextMenu(null);
                            }}
                          >
                            <MdOutlineReply /> Reply
                          </li>{" "}
                          <li
                            className={` flex items-center gap-2 cursor-pointer transition-colors duration-300 ${
                              darkMode
                                ? "hover:bg-[var(--light-dark-color)]"
                                : "hover:bg-slate-300"
                            }`}
                            onClick={() => handleSelectMessage(msg._id)}
                          >
                            {" "}
                            {selectedMessages.includes(msg._id) ? (
                              <span>
                                <TiCancelOutline />
                              </span>
                            ) : (
                              <span>
                                <FaCheck />
                              </span>
                            )}
                            {selectedMessages.includes(msg._id) ? (
                              <span>Unselect</span>
                            ) : (
                              <span>Select</span>
                            )}
                          </li>
                          {selectedMessages.length > 0 ? (
                            <>
                              <li
                                className={` flex items-center gap-2 cursor-pointer transition-colors duration-300 ${
                                  darkMode
                                    ? "hover:bg-[var(--light-dark-color)]"
                                    : "hover:bg-slate-300"
                                }`}
                                onClick={handleUnSelectAll}
                              >
                                <TiCancelOutline />
                                Unselect All
                              </li>
                            </>
                          ) : (
                            <>
                              <li
                                className={` flex items-center gap-2 cursor-pointer transition-colors duration-300 ${
                                  darkMode
                                    ? "hover:bg-[var(--light-dark-color)]"
                                    : "hover:bg-slate-300"
                                }`}
                                onClick={handleSelectAll}
                              >
                                <FaCheckDouble />
                                Select All
                              </li>
                            </>
                          )}
                          {msg.msgByUserId.trim() === user._id.trim() && (
                            <li
                              className={`flex items-center gap-2 cursor-pointer transition-colors duration-300 ${
                                darkMode
                                  ? "hover:bg-[var(--light-dark-color)]"
                                  : "hover:bg-slate-300"
                              }`}
                              onClick={() => {
                                handleEditMessage(msg);
                                setContextMenu(null);
                              }}
                            >
                              <MdModeEdit /> Edit
                            </li>
                          )}
                          {selectedMessages.length > 0 ? (
                            <>
                              {" "}
                              <li
                                className={`flex items-center gap-2 cursor-pointer transition-colors duration-300 ${
                                  darkMode
                                    ? "hover:bg-[var(--light-dark-color)]"
                                    : "hover:bg-slate-300"
                                }`}
                                onClick={handleDeleteSelected}
                              >
                                <MdDelete /> Delete Selected
                              </li>
                            </>
                          ) : (
                            <>
                              <li
                                className={`flex items-center gap-2 cursor-pointer transition-colors duration-300 ${
                                  darkMode
                                    ? "hover:bg-[var(--light-dark-color)]"
                                    : "hover:bg-slate-300"
                                }`}
                                onClick={() => {
                                  handleDeleteMessage(msg._id);
                                  setContextMenu(null);
                                }}
                              >
                                <MdDelete /> Delete
                              </li>
                            </>
                          )}
                          <li
                            className={`flex items-center gap-2 cursor-pointer transition-colors duration-300 ${
                              darkMode
                                ? "hover:bg-[var(--light-dark-color)]"
                                : "hover:bg-slate-300"
                            }`}
                            onClick={() => {
                              navigator.clipboard.writeText(msg.text);
                              setContextMenu(null);
                              toast.success("Text copied!");
                            }}
                          >
                            <MdContentCopy /> Copy
                          </li>
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            );
          })}

        <div className="relative" ref={messageEndRef}></div>
      </section>

      <section
        className={`${
          darkMode ? " bg-[var(--medium-dard)]" : "bg-[var(--cobalt-blue)]"
        } relative flex items-center h-16 `}
      >
        {isEdit ? (
          <div
            className={`${
              darkMode
                ? "bg-gray-900 text-slate-300 shadow-lg"
                : "bg-sky-400 text-slate-100 shadow-md"
            } flex justify-between items-center px-6 py-4 z-[2000] absolute w-[99%] top-0 -mt-16 h-16 rounded-t-lg transition duration-300`}
          >
            <div className="w-full">
              <div className="flex items-center space-x-2">
                <div className="w-1 bg-green-300 h-8 rounded-md"></div>
                <h1 className="text-sm md:text-md lg:text-lg font-semibold">
                  Edit Message
                </h1>
              </div>

              <p className="truncate text-sm mt-1">
                <span>{editMessage.text}</span>
              </p>
            </div>
            <div className="flex">
              <button
                onClick={handleCancelEdit}
                className="flex items-center justify-center w-10 h-10 rounded-full text-slate-500 transition duration-200 hover:bg-[var(--light-dark-color)] hover:text-slate-900"
              >
                <ImCross className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
        {isReply ? (
          <div className=" flex justify-between px-4  z-[5000] absolute w-[99%]  top-0 -mt-16 h-16  items-center">
            <div
              className={`rounded-lg w-full ${
                darkMode
                  ? "bg-[var(--dark-bg-color)] text-slate-300"
                  : "bg-slate-300 w-full text-black"
              }`}
            >
              <div className="flex justify-between items-center p-1">
                <div className="flex">
                  <div className="w-1 bg-green-700  h-6"></div>
                  <h1 className=" text-md">Reply to.. </h1>
                </div>
              </div>

              <p className="truncate ...  mx-1">
                <span>{replayMessage}</span>
              </p>
            </div>
            <div>
              <button
                onClick={handleCancelReplay}
                className={`${darkMode ? "" : "text-slate-600"} text-xl`}
              >
                <ImCross />
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
        {isBlocked ? (
          <>
            <div className="h-full w-full flex justify-around items-center ">
              <div className=" w-full flex items-center">
                <button className="rounded-2xl py-1 px-4 h-12  outline-none w-full bg-[var(--messge-input-dark)] text-red-400">
                  user blocked
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
                <div className="relative">
                  {showButton && (
                    <button
                      onClick={handleBackToLatestMessge}
                      className={`${
                        darkMode ? "bg-gray-600" : "bg-blue-950"
                      } text-white z-[3000] fixed rounded-full text-3xl -mt-24 right-0 p-3`}
                    >
                      <MdArrowDownward />
                    </button>
                  )}
                </div>
                <div className=" flex justify-around items-center ">
                  <SendImage />
                </div>
                <form className="h-full w-full  " onSubmit={handleSendMessage}>
                  <div className=" w-full flex items-center">
                    <textarea
                      style={{ height: "45px" }}
                      ref={textareaRef}
                      autoComplete="off"
                      id="message_input"
                      onInput={handleInput}
                      name="text"
                      className={`z-[3000] absolute bottom-2 ${
                        darkMode
                          ? "bg-[var(--messge-input-dark)] text-slate-300"
                          : "text-slate-600"
                      } transition duration-500 overflow-x-hidden  w-[80%] md:w-[80%] lg:w-[88%]  scrollbar   rounded-2xl py-1 px-4 outline-none  `}
                      placeholder="Write a message..."
                      value={message.text}
                      onChange={handleOnMessageChange}
                      onKeyDown={handleKeyDown}
                      rows={1}
                    />
                  </div>
                </form>
                <EmojiPicker onEmojiClick={handleEmojiPiker} />
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default ChatBox;
