const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/dbConnection.js");
const router = require("./routers/routes.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const { Server } = require("socket.io");
const getUserDetailFromToken = require("./helpers/getUserDetailsFromToken.js");
const {
  ConversationModel,
  MessageModel,
} = require("./models/ConversationModel.js");
const getConversations = require("./helpers/getConversation.js");
const bodyParser = require("body-parser");
const UserModel = require("./models/UserModels.js");
dotenv.config();
const app = express();
const allowedOrigins = ["http://localhost:5173", "https://bunagram.vercel.app"];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Configure PORT
const port = process.env.PORT || 3000;

//RESTful api's
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

//api end points
app.use(
  "/api",
  (req, _, next) => {
    req.io = io; // Attach io to req
    next();
  },
  router
);
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
  console.log("Socket Request token: ", token);
  const user = await getUserDetailFromToken(token);
  socket.join(user?._id?.toString());
  onLineUser.add(user?._id?.toString());
  io.emit("onlineuser", Array.from(onLineUser));
  //sidenar event
  socket.on("side-bar", async (currentUserId) => {
    const conversation = await getConversations(currentUserId.toString());
    socket.emit("conversation", conversation || []);
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
