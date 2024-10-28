const {
  ConversationModel,
  MessageModel,
} = require("../../models/ConversationModel");
const {
  decryptMessage,
  encryptMessageToStore,
  decryptStoredMessage,
  messageEncryptToClient,
} = require("../../service/EncriptionServce");

const SendMessage = async (req, res) => {
  const { reciver_id, text, replyToMessageId } = req.body;
  const SenderId = req.userId;
  const userSocketMap = req.userSocketMap;

  try {
    let conversation = await ConversationModel.findOne({
      $or: [
        { sender: SenderId.toString(), receiver: reciver_id.toString() },
        { sender: reciver_id.toString(), receiver: SenderId.toString() },
      ],
    });

    if (!conversation) {
      //create new conversation if there is no one
      const NewConversation = new ConversationModel({
        sender: SenderId.toString(),
        receiver: reciver_id.toString(),
      });
      conversation = await NewConversation.save();
      // Retrieve the socket using the userSocketMap
      const senderSocketId = userSocketMap[SenderId.toString()];
      const senderSocket = req.io.sockets.sockets.get(senderSocketId);

      if (senderSocket) {
        const roomName = `conversation_${conversation._id}`;
        senderSocket.join(roomName);
        console.log(
          `New conversation created, and user ${SenderId} joined room ${roomName}`
        );
      }
    }

    /*
     * Decrypt the coming message and encrypt it for storage
     * */
    const PlainText = decryptMessage(text);
    const cypgerText = encryptMessageToStore(PlainText);
    //store the sent message in data base
    const message = new MessageModel({
      text: cypgerText,
      imageURL: "",
      sender: SenderId,
      msgByUserId: SenderId,
      replyToMessageId: replyToMessageId ? replyToMessageId : null,
    });
    //store the new message and add the new mesage id to the conversation messages array
    const savedMessage = await message.save();
    const savedMessageWithReply = await MessageModel.findById(savedMessage._id)
      .populate({
        path: "replyToMessageId",
        select: "text", // Only select the text of the message being replied to
      })
      .exec();
    /*
     * Decrypted the saved message or stored message and encrypt it using
     * Different Key and Send to each user(conversation)
     * */
    let messageToBeSent = decryptStoredMessage(savedMessageWithReply.text);
    messageToBeSent = messageEncryptToClient(messageToBeSent);
    savedMessageWithReply.text = messageToBeSent;
    const payload = {
      sender_id: SenderId,
      reciver: reciver_id,
      convID: conversation?._id,
      message: savedMessageWithReply,
    };
    //send the single message to both socket conenction
    const roomName = `conversation_${conversation._id}`;
    req.io.to(roomName).emit("new-message", payload);
    req.io.to(reciver_id.toString()).emit("conversation");
    req.io.to(SenderId.toString()).emit("conversation");
    req.io.to(reciver_id.toString()).emit("notif");
    await ConversationModel.findOneAndUpdate(
      { _id: conversation?._id },
      { $push: { messages: savedMessage?._id } },
      { new: true }
    ).sort({ updatedAt: -1 });
    return res.json({ message: "Message Sent!", status: 1 });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message || error, error: true });
  }
};
module.exports = SendMessage;
