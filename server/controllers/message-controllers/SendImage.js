const {
  ConversationModel,
  MessageModel,
} = require("../../models/ConversationModel");
const {
  EncryptToClient,
  DecryptStoredMessage,
  DecryptIncomingMessage,
  EncryptMessageToStore,
} = require("../../service/EncriptionServce");

// Ensure upload is defined here

const SendMessage = async (req, res) => {
  const { reciver_id, text, replyToMessageId } = req.body;
  const SenderId = req.userId;

  try {
    let conversation = await ConversationModel.findOne({
      $or: [
        { sender: SenderId.toString(), receiver: reciver_id.toString() },
        { sender: reciver_id.toString(), receiver: SenderId.toString() },
      ],
    });

    if (!conversation) {
      const NewConversation = new ConversationModel({
        sender: SenderId.toString(),
        receiver: reciver_id.toString(),
      });
      conversation = await NewConversation.save();
    }

    // Encrypt the text (if provided)
    let encryptedText = "";
    if (text.trim() != "") {
      const PlainText = DecryptIncomingMessage(text);
      encryptedText = EncryptMessageToStore(PlainText);
    }

    // Get the uploaded file's path (if an image was uploaded)
    let imageURL = "";
    if (req.file) {
      imageURL = `/uploads/${req.file.filename}`; // Store the file path as the image URL
    }

    // Store the message in the database
    const message = new MessageModel({
      text: encryptedText || "", // Store the encrypted text if available
      imageURL: imageURL || "", // Store the image URL if the image was uploaded
      sender: SenderId,
      msgByUserId: SenderId,
      replyToMessageId: replyToMessageId ? replyToMessageId : null,
    });
    const savedMessage = await message.save();

    // Decrypt the stored message and re-encrypt it using a different key
    let messageToBeSent = "";
    if (savedMessage.text) {
      messageToBeSent = DecryptStoredMessage(savedMessage.text);
      messageToBeSent = EncryptToClient(messageToBeSent);
      savedMessage.text = messageToBeSent; // Re-encrypt the text for client-side
    }

    const payload = {
      reciver: reciver_id,
      convID: conversation?._id,
      message: savedMessage, // Include both text and imageURL in the message
    };

    // Emit the message to both the sender and receiver
    req.io.to(SenderId.toString()).emit("new-message", payload);
    req.io.to(reciver_id.toString()).emit("new-message", payload);
    req.io.to(reciver_id.toString()).emit("notif");
    req.io.to(reciver_id.toString()).emit("conversation");
    req.io.to(SenderId.toString()).emit("conversation");
    // Update the conversation with the new message ID
    await ConversationModel.findOneAndUpdate(
      { _id: conversation?._id },
      { $push: { messages: savedMessage?._id } },
      { new: true }
    ).sort({ updatedAt: -1 });

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message || error, error: true });
  }
};

module.exports = SendMessage;
