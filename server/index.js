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
const userToSocketMap = {};
//RESTful api's
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

//api end points
app.use(
  "/api",
  (req, _, next) => {
    req.io = io; // Attach io to req
    req.userSocketMap = userToSocketMap;
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
    methods: ["GET", "POST"],
    credentials: true,
  },
});

//online user
const onLineUser = new Set();
const roomUsers = {};

io.on("connection", async (socket) => {
  const token = socket.handshake.auth.token;
  const user = await getUserDetailFromToken(token);
  const userId = user?._id?.toString();
  if (user?._id) {
    userToSocketMap[user._id.toString()] = socket.id; // Map user ID to socket ID
  }
  socket.join(userId);
  onLineUser.add(userId);
  userToSocketMap[userId] = socket.id;
  console.log("Online-Users", Array.from(onLineUser));
  io.emit("onlineuser", Array.from(onLineUser));
  // Handle joining a room
  socket.on("join-room", ({ roomName }) => {
    if (!roomUsers[roomName]) {
      roomUsers[roomName] = new Set();
    }

    // Add the user to the conversation-specific room
    roomUsers[roomName].add(socket.id);
    socket.join(roomName);

    console.log(`User ${userId} joined room: ${roomName}`);
  });
  // Handle leaving a room
  socket.on("leave-room", ({ roomName }) => {
    if (roomUsers[roomName]) {
      roomUsers[roomName].delete(socket.id);
      socket.leave(roomName);

      if (roomUsers[roomName].size === 0) {
        delete roomUsers[roomName]; // Cleanup
      }
    }
  });

  //sidenar event
  socket.on("side-bar", async (currentUserId) => {
    const conversation = await getConversations(currentUserId.toString());
    socket.emit("conversation", conversation || []);
  });
  /*
  -- message seen socket request
  */
  socket.on(
    "message-seen",
    async ({ conversationId, messageId, senderId, receiverId }) => {
      try {
        const roomName = `conversation_${conversationId}`;
        const receiverSocketId = userToSocketMap[receiverId];

        // Check if receiver is in the same conversation room
        if (roomUsers[roomName] && roomUsers[roomName].has(receiverSocketId)) {
          console.log("User is in the room");

          // Update message status to 'seen' in the database
          await MessageModel.updateOne({ _id: messageId }, { seen: true });

          // Emit the seen message event only to the room
          io.to(roomName).emit("message-seen", {
            messageId,
            conversationId,
            receiverId,
          });

          console.log(
            `Message ${messageId} in conversation ${conversationId} seen by ${receiverId}`
          );
        }
      } catch (error) {
        console.error("Error updating message seen status:", error);
      }
    }
  );

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
