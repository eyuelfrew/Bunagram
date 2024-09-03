import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbConnection.js";
import router from "./routers/routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import getUserDetailFromToken from "./helpers/getUserDetailsFromToken.js";
// import UserModel from "./models/UserModels.js";
import { ConversationModel, MessageModel } from "./models/ConversationModel.js";
import getConversations from "./helpers/getConversation.js";
import bodyParser from "body-parser";
import UserModel from "./models/UserModels.js";
dotenv.config();
const app = express();
const corsOptions = {
  origin: ["https://bunagram-1.onrender.com"],
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
  cors: corsOptions,
});

//online user
const onLineUser = new Set();
io.on("connection", async (socket) => {
  const token = socket.handshake.auth.token;

  //curent user detail
  const user = await getUserDetailFromToken(token);
  //creating a room
  socket.join(user?._id.toString());
  onLineUser.add(user?._id?.toString());
  //online users
  io.emit("onlineuser", Array.from(onLineUser));

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
      socket.emit("message", {
        reciver: data?.receiver?.toString(),
        convID: getConversationMessage?._id || "",
        messages: getConversationMessage?.messages || [],
      });
    } catch (error) {
      return console.log(error.message);
    }
  });

  //new message
  socket.on("newmessage", async (data) => {
    console.log(data);
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
        messages: getConversationMessage?.messages || [],
        convID: getConversationMessage?._id,
      });
      io.to(data?.receiver.toString()).emit("notif");
      // io.to(data?.sender.toString()).emit("notif");
      io.to(data?.sender.toString()).emit("receverID", data?.sender.toString());
      const conversationSiender = await getConversations(data?.sender);
      const conversationRecevier = await getConversations(data?.receiver);
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

  //sidenar event
  socket.on("sidebar", async (currentUserId) => {
    const conversation = await getConversations(currentUserId.toString());
    socket.emit("conversation", conversation || []);
  });

  //socket on seen
  socket.on("seen", async (msgByUserId) => {
    if (!msgByUserId) return;
    const conversation = await ConversationModel.findOne({
      $or: [
        { sender: user?._id, receiver: msgByUserId.toString() },
        { sender: msgByUserId.toString(), receiver: user?._id },
      ],
    });
    const conversationMessageId = conversation?.messages || [];
    await MessageModel.updateMany(
      {
        _id: { $in: conversationMessageId },
        msgByUserId: msgByUserId.toString(),
      },
      { $set: { seen: true } }
    ).populate("messages");
    const conversationSender = await getConversations(user?._id.toString());
    const conversationRecevier = await getConversations(msgByUserId.toString());
    io.to(user?._id.toString()).emit("conversation", conversationSender || []);
    io.to(msgByUserId.toString()).emit(
      "conversation",
      conversationRecevier || []
    );
  });
  /*
  --- block user update onversation web socket
  */
  socket.on("blockuser", async (data) => {
    const blocker_id = data?.blocker;
    const blocked_id = data?.blocked;
    console.log(data);
    const blockerFullInfo = await UserModel.findById(blocker_id);
    const conversationSender = await getConversations(blocker_id.toString());
    const conversationRecevier = await getConversations(blocked_id.toString());
    io.to(blocker_id.toString()).emit("conversation", conversationSender || []);
    io.to(blocked_id.toString()).emit(
      "conversation",
      conversationRecevier || []
    );
    console.log(blockerFullInfo);
    io.to(blocked_id.toString()).emit("blockedby", blockerFullInfo);
  });

  /*
  --- unbock user request
  */
  socket.on("unblockuser", async (data) => {
    const blocker_id = data?.blocker;
    const blocked_id = data?.blocked;
    console.log(data);
    const blockerFullInfo = await UserModel.findById(blocker_id);
    const conversationSender = await getConversations(blocker_id.toString());
    const conversationRecevier = await getConversations(blocked_id.toString());
    io.to(blocker_id.toString()).emit("conversation", conversationSender || []);
    io.to(blocked_id.toString()).emit(
      "conversation",
      conversationRecevier || []
    );
    console.log(blockerFullInfo);
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
        console.log(newConversation);
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
  // socket.on("unblockuser");
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
