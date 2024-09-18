const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/dbConnection.js");
const router = require("./routers/routes.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const colors = require("colors");
const { Server } = require("socket.io");
const getUserDetailFromToken = require("./helpers/getUserDetailsFromToken.js");
// import UserModel = require "./models/UserModels.js";
const {
  ConversationModel,
  MessageModel,
} = require("./models/ConversationModel.js");
const getConversations = require("./helpers/getConversation.js");
const bodyParser = require("body-parser");
const UserModel = require("./models/UserModels.js");
dotenv.config();
const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://bunagram.vercel.app", // Local development
];
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://bunagram.vercel.app", // Local development
  ],
  credentials: true,
};
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
//Configure PORT
const port = process.env.PORT || 3000;

//RESTful api's
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

//api end points
app.use("/api", router);

//connect to data base
connectDB();

//start server if mongo conenction is successfull
const server = app.listen(port, () => {
  console.log(`Server Running in Port=${port}`);
});

//socket configuration
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    // methods: ["GET", "POST"],
    credentials: true,
  },
});

//online user
const onLineUser = new Set();
io.on("connection", async (socket) => {
  const token = socket.handshake.auth.token;

  //curent user detail
  const user = await getUserDetailFromToken(token);
  //creating a room
  socket.join(user?._id?.toString());
  onLineUser.add(user?._id?.toString());
  //online users
  io.emit("onlineuser", Array.from(onLineUser));
  //sidenar event
  socket.on("side-bar", async (currentUserId) => {
    console.log("Side bar requeted by", currentUserId);
    const conversation = await getConversations(currentUserId.toString());
    socket.emit("conversation", conversation || []);
  });
  socket.on("message-page", async (data) => {
    if (!data.sender) return console.log("no id found", data.sender);

    try {
      const getConversationMessage = await ConversationModel.findOne({
        $or: [
          {
            sender: data?.sender?.toString(),
            receiver: data?.receiver?.toString(),
          },
          {
            sender: data?.receiver.toString(),
            receiver: data?.sender.toString(),
          },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });
      io.to(data?.sender?.toString()).emit("message", {
        reciver: data?.receiver?.toString(),
        convID: getConversationMessage?._id || "",
        messages: getConversationMessage?.messages || [],
      });
    } catch (error) {
      return console.log(error.message);
    }
  });

  //new message
  socket.on("new-message", async (data) => {
    try {
      let conversation = await ConversationModel.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      });
      if (!conversation) {
        const createConversation = new ConversationModel({
          sender: data?.sender,
          receiver: data?.receiver,
        });
        conversation = await createConversation.save();
        io.to(user?._id.toString()).emit("newconversation", {
          convID: conversation?._id,
        });
      }
      const message = new MessageModel({
        text: data?.text,
        imageURL: data?.imageURL,
        sender: data?.sender,
        msgByUserId: data?.msgByUserId,
      });
      const savedMessage = await message.save();
      await ConversationModel.updateOne(
        { _id: conversation?._id },
        { $push: { messages: savedMessage?._id } }
      );
      const getConversationMessage = await ConversationModel.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });
      // Emit the updated messages to both sender and receiver
      io.to(data?.sender.toString()).emit("message", {
        reciver: data?.receiver?.toString(),
        messages: getConversationMessage?.messages || [],
        convID: getConversationMessage?._id,
      });

      io.to(data?.receiver.toString()).emit("message", {
        reciver: data?.receiver?.toString(),
        messages: getConversationMessage?.messages || [],
        convID: getConversationMessage?._id,
      });
      io.to(data?.receiver.toString()).emit("notif");
      const conversationSiender = await getConversations(data?.sender);
      const conversationRecevier = await getConversations(data?.receiver);
      // send the conversation t each users
      io.to(data?.sender.toString()).emit(
        "conversation",
        conversationSiender || []
      );
      io.to(data?.receiver.toString()).emit(
        "conversation",
        conversationRecevier || []
      );
    } catch (error) {
      console.error("Error handling new message:", error);
    }
  });

  /*
  -- message seen socket request
  */
  socket.on("seen", async (messageByUser) => {
    if (!messageByUser) return;
    const conversation = await ConversationModel.findOne({
      $or: [
        {
          sender: user?._id?.toString(),
          receiver: messageByUser?.toString(),
        },
        {
          sender: messageByUser?.toString(),
          receiver: user?._id?.toString(),
        },
      ],
    });
    const conversationMessageId = conversation?.messages || [];
    await MessageModel.updateMany(
      {
        _id: { $in: conversationMessageId },
        msgByUserId: messageByUser?.toString(),
      },
      { $set: { seen: true } }
    );
    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        {
          sender: user?._id?.toString(),
          receiver: messageByUser?.toString(),
        },
        {
          sender: messageByUser?.toString(),
          receiver: user?._id?.toString(),
        },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });
    const conversationSender = await getConversations(user?._id?.toString());
    const conversationRecevier = await getConversations(
      messageByUser?.toString()
    );

    io.to(user?._id?.toString()).emit("conversation", conversationSender || []);
    io.to(messageByUser?.toString()).emit(
      "conversation",
      conversationRecevier || []
    );
    io.to(messageByUser?.toString()).emit("message", {
      messages: getConversationMessage?.messages || [],
    });
  });

  /*
  --- On Edit Message 
  */
  socket.on("edit-message", async (data) => {
    console.log(data);
    await MessageModel.findByIdAndUpdate(data?.message_id, {
      text: data?.text,
    });
    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.reciver },
        { sender: data?.reciver, receiver: data?.sender },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });
    io.to(data?.sender.toString()).emit("message", {
      reciver: data?.reciver?.toString(),
      messages: getConversationMessage?.messages || [],
      convID: getConversationMessage?._id,
    });

    io.to(data?.reciver.toString()).emit("message", {
      messages: getConversationMessage?.messages || [],
      convID: getConversationMessage?._id,
    });
  });

  /*
  --- block user update onversation web socket
  */
  socket.on("blockuser", async (data) => {
    const blocker_id = data?.blocker;
    const blocked_id = data?.blocked;
    const blockerFullInfo = await UserModel.findById(blocker_id);
    const conversationSender = await getConversations(blocker_id.toString());
    const conversationRecevier = await getConversations(blocked_id.toString());
    io.to(blocker_id.toString()).emit("conversation", conversationSender || []);
    io.to(blocked_id.toString()).emit(
      "conversation",
      conversationRecevier || []
    );
    io.to(blocked_id.toString()).emit("blockedby", blockerFullInfo);
  });

  /*
  --- unbock user request
  */
  socket.on("unblockuser", async (data) => {
    const blocker_id = data?.blocker;
    const blocked_id = data?.blocked;
    const blockerFullInfo = await UserModel.findById(blocker_id);
    const conversationSender = await getConversations(blocker_id.toString());
    const conversationRecevier = await getConversations(blocked_id.toString());
    io.to(blocker_id.toString()).emit("conversation", conversationSender || []);
    io.to(blocked_id.toString()).emit(
      "conversation",
      conversationRecevier || []
    );
    io.to(blocked_id.toString()).emit("blockedby", blockerFullInfo);
  });

  /*
  --- clear chat request
  */
  socket.on("clear-chat", async (data) => {
    const sender = data?.sender_id;
    const reciver = data?.reciver_id;
    try {
      const converstaion = await ConversationModel.findOne({
        $or: [
          { sender: sender, receiver: reciver },
          { sender: reciver, receiver: sender },
        ],
      });
      if (converstaion) {
        await MessageModel.deleteMany({ _id: { $in: converstaion.messages } });
        converstaion.messages = [];
        const newConversation = await converstaion.save();
        io.to(sender.toString()).emit("message", {
          messages: newConversation?.messages || [],
          convID: newConversation?._id,
        });
        io.to(reciver.toString()).emit("message", {
          messages: newConversation?.messages || [],
          convID: newConversation?._id,
        });
      }
    } catch (error) {
      console.log(error.message || error);
    }
  });
  /*
  ---- // * On Delete Single Message
  */
  socket.on("delete-message", async (data) => {
    const sender = data?.sender_id;
    const reciver = data?.reciver_id;
    const messageId = data?.message_Id;
    const conversationId = data?.conversation_id;
    console.log(messageId);
    try {
      await MessageModel.findByIdAndDelete(messageId);
      const updatedConversation = await ConversationModel.findOneAndUpdate(
        { _id: conversationId },
        { $pull: { messages: messageId } },
        { new: true }
      ).populate("messages");

      io.to(sender.toString()).emit("message", {
        reciver: reciver,
        convID: conversationId,
        messages: updatedConversation?.messages || [],
      });
      io.to(reciver.toString()).emit("message", {
        messages: updatedConversation?.messages || [],
        reciver: reciver,
        convID: conversationId,
      });
    } catch (error) {
      console.log(error.message);
    }
  });

  /*
  -- Typing futures
  */
  socket.on("typing", (userId) => {
    io.to(userId?.recevierId).emit("typing", userId?.typerId);
  });
  socket.on("stop typing", (userId) => {
    socket.in(userId).emit("stop typing");
  });
  socket.on("disconnect", (socket) => {
    onLineUser.delete(user?._id?.toString());
    io.emit("onlineuser", Array.from(onLineUser));
  });
});
