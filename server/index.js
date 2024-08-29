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
dotenv.config();
const app = express();
const corsOptions = {
  origin: ["http://localhost:5173"],
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
    console.log(data);
    // const userid = userId.toString();
    // return console.log(data);
    if (!data.sender) return console.log("no id found", data.sender);
    // const userDetail = await UserModel.findById(userid).select("-password");
    // const payload = {
    //   _id: userDetail._id,
    //   name: userDetail.name,
    //   email: userDetail.email,
    //   profile_pic: userDetail.profile_pic,
    //   online: onLineUser.has(userid),
    // };
    // socket.emit("message-user", payload);

    // const getConversationMessage = await ConversationModel.findOne({
    //   $or: [
    //     { sender: user?._id, receiver: userid },
    //     { sender: userid, receiver: user?._id },
    //   ],
    // })
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
      console.log("please work for me", data?.receiver?.toString());
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
      console.log("Recever = ", data?.receiver.toString());
      io.to(data?.receiver.toString()).emit("notif", {
        noti: true,
        Id: data?.receiver.toString(),
      });
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
