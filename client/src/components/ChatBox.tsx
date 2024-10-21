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
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { UseSocket } from "../context/SocketContext";
import ChatMenu from "./ChatMenu";

import LottieAnimation from "./LottieAnimation";
import SendImage from "./SendImage";
import {
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
import EncryptinService from "../utils/EncryptionService";
import { Recevier } from "../types/Types";
import toast from "react-hot-toast";

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
  /*
  -- instantiate the encrition service
  */
  const EncService = new EncryptinService(
    import.meta.env.VITE_TRANSIT_KEY,
    import.meta.env.VITE_STORAGE_KEY,
    import.meta.env.VITE_INCOMING_MESSAGE_KEY
  );
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
        text: EncService.DecryptMessage(message.text),
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

      // Update the current room reference
      setPreviousRoom(newRoom);
    }
  }, [Recever.conversation_id]);
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
  /*
  --- Emmit typing event when a user is typing and stop typing!!
  */

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
        data.message.text = await EncService.DecryptIncomingMessage(
          data?.message?.text
        );
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
      const handleUpdatedMessage = (updatedMessage: AllMessage) => {
        const decryptedMessage = EncService.DecryptMessage(updatedMessage.text);
        setAllMessage((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === updatedMessage._id
              ? { ...msg, text: decryptedMessage }
              : msg
          )
        );
      };
      const handleClearChatSocket = () => {
        setAllMessage([]);
      };
      SocketConnection.on("newconversation", handleNewConveration);
      SocketConnection.on("new-message", NewMessageHandler);
      SocketConnection.on("updated-message", handleUpdatedMessage);
      SocketConnection.on("clear-chat", handleClearChatSocket);

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
          text: EncService.EncryptMessage(message.text),
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
        message: EncService.EncryptMessage(message.text),
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
                  src={`/savedmessage.jpg`}
                  alt={`${Recever.full_name}`}
                />
              </>
            ) : (
              <>
                {Recever.deletedAccount ? (
                  <>
                    <img
                      className="w-[55px] lg:w-[75px] lg:h-[75px] rounded-full "
                      src={`/deletedccount.jpg`}
                      alt={`${Recever.full_name}`}
                    />
                  </>
                ) : (
                  <>
                    {blockedByReciver || Recever.profile_pic.trim() === "" ? (
                      <>
                        <img
                          className="w-[55px] lg:w-[75px] lg:h-[75px] rounded-full "
                          src={`/userpic.png`}
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
                className="  transition duration-500"
                ref={currentMessage}
              >
                <div
                  onContextMenu={(event) => handleRightClick(event, msg._id)}
                  onClick={handleClickOutside}
                  className={`cursor-pointer relative min-w-28 max-w-48 lg:max-w-96 mx-4 ${
                    darkMode
                      ? "bg-[var(--medium-dard)] text-slate-300"
                      : "bg-white text-slate-700"
                  } mb-2
                 p-3 py-1 rounded w-fit h-fit ${
                   user._id === msg.msgByUserId
                     ? `ml-auto ${
                         darkMode ? "bg-[var(--message-bg)]" : "bg-green-200"
                       }`
                     : ""
                 } transition duration-500`}
                >
                  {msg?.replyToMessageId && (
                    <div className="min-w-28 max-w-48 lg:max-w-96 bg-slate-600 overflow-hidden">
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
                        className=" min-w-28 max-w-48 lg:max-w-96 border-l-4  border-green-500 mb-3 p-3 "
                      >
                        <span
                          className={`${
                            darkMode ? "" : "text-slate-200"
                          } truncate ...`}
                        >
                          {" "}
                          {msg?.replyToMessageId?.text != "" &&
                            EncService.DecryptMessage(
                              msg?.replyToMessageId?.text
                            )}{" "}
                        </span>
                      </Link>
                    </div>
                  )}
                  {msg.imageURL ? (
                    <img
                      src={`${URI}${msg.imageURL}`}
                      alt=""
                      className="w-full"
                    />
                  ) : null}
                  <p className="break-words">{msg.text}</p>
                  {/* <p className=" justify-end">
                  {moment(msg.createdAt).format("hh:mm")}
                </p> */}
                  <div className="">
                    {moment(msg.createdAt).format("hh:mm")}
                    {user._id === msg.msgByUserId && msg.seen ? (
                      <div className="absolute -right-3 -mt-3">
                        <LiaCheckDoubleSolid size={20} />
                      </div>
                    ) : null}
                  </div>
                  {/* {user._id === msg.msgByUserId && msg.seen ? (
                  <div className="absolute -right-3 -mt-3">
                    <LiaCheckDoubleSolid size={20} />
                  </div>
                ) : null} */}

                  {contextMenu &&
                    contextMenu.messageId === msg._id &&
                    contextMenu.visible && (
                      <div
                        className={`w-36 absolute ${
                          msg.msgByUserId.trim() == user._id.trim()
                            ? "right-10"
                            : "-right-12"
                        }  ${
                          darkMode
                            ? "bg-[var(--dark-bg-color)]"
                            : "bg-slate-100"
                        }  rounded shadow-lg z-[4000]`}
                      >
                        <ul className="p-2 flex flex-col gap-4">
                          <li
                            className={`${
                              darkMode
                                ? "hover:bg-[var(--light-dark-color)]"
                                : "hover:bg-slate-400"
                            } flex items-center gap-2 cursor-pointer`}
                            onClick={() => {
                              handleReplay(msg._id);
                              setContextMenu(null); // Close menu after click
                            }}
                          >
                            <MdOutlineReply /> Replay
                          </li>
                          {msg.msgByUserId.trim() === user._id.trim() && (
                            <li
                              className={`${
                                darkMode
                                  ? "hover:bg-[var(--light-dark-color)]"
                                  : "hover:bg-slate-400"
                              } flex items-center gap-2 cursor-pointer`}
                              onClick={() => {
                                handleEditMessage(msg);
                                setContextMenu(null); // Close menu after click
                              }}
                            >
                              <MdModeEdit /> Edit
                            </li>
                          )}
                          <li
                            className={`${
                              darkMode
                                ? "hover:bg-[var(--light-dark-color)]"
                                : "hover:bg-slate-400"
                            } flex items-center gap-2 cursor-pointer`}
                            onClick={() => {
                              handleDeleteMessage(msg._id);
                              setContextMenu(null); // Close menu after click
                            }}
                          >
                            <MdDelete /> Delete
                          </li>
                          <li
                            className={`${
                              darkMode
                                ? "hover:bg-[var(--light-dark-color)]"
                                : "hover:bg-slate-400"
                            } flex items-center gap-2 cursor-pointer`}
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
        <div ref={messageEndRef}></div>
      </section>

      <section
        className={`${
          darkMode ? " bg-[var(--medium-dard)]" : "bg-[var(--cobalt-blue)]"
        } relative flex items-center h-16 `}
      >
        {/* {showScrollButton && ( */}
        {/* <button
          onClick={scrollDown}
          className={`!{} bg-green-400 z-[3000] absolute -mt-28 rounded-full text-3xl right-8 p-3`}
        >
          <MdArrowDownward />
        </button> */}
        {/* )} */}

        {isEdit ? (
          <div
            className={`${
              darkMode
                ? "bg-[var(--messge-input-dark)] text-slate-300"
                : "bg-slate-300 w-full text-slate-600"
            } flex justify-between px-4  z-[5000] absolute w-[99%]  top-0 -mt-16 h-16  items-center`}
          >
            <div
              className={`w-full ${
                darkMode
                  ? "bg-[var(--messge-input-dark)] text-slate-300"
                  : "bg-slate-300 w-full text-slate-600"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex">
                  <div className="w-1 bg-green-300  h-6"></div>
                  <h1 className=" text-md">Edit message </h1>
                </div>
              </div>

              <p className="truncate ... ">
                <span>{editMessage.text}</span>
              </p>
            </div>
            <div className="flex">
              <button
                onClick={handleCancelEdit}
                className="rounded-full text-slate-500  text-md  hover:bg-[var(--light-dark-color)]"
              >
                <ImCross />
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
        {isReply ? (
          <div className="flex justify-between px-4  z-[5000] absolute w-[99%]  top-0 -mt-16 h-16  items-center">
            <div
              className={`w-full ${
                darkMode
                  ? "bg-[var(--dark-bg-color)] text-slate-300"
                  : "bg-slate-300 w-full text-black"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex">
                  <div className="w-1 bg-green-300  h-6"></div>
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
                className="rounded-full  text-md  hover:bg-[var(--light-dark-color)]"
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
                      className={` absolute bottom-2 ${
                        darkMode
                          ? "bg-[var(--messge-input-dark)] text-slate-300"
                          : "text-slate-600"
                      } overflow-x-hidden  w-[80%] md:w-[90%] lg:w-[90%]  scrollbar   rounded-2xl py-1 px-4 outline-none  `}
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
