const fs = require("fs");
const path = require("path");
const {
  MessageModel,
  ConversationModel,
} = require("../../models/ConversationModel");

const DeleteMessage = async (req, res) => {
  const { message_id, reciver_id, conversation_id } = req.body;
  try {
    const message = await MessageModel.findById(message_id);
    if (!message) {
      return res.json({ message: "Message not found", status: 0 });
    }
    if (message.imageURL.trim() != "") {
      const imagePath = path.join(__dirname, "..", "..", message.imageURL);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.log("Error Deleting File", err);
        } else {
          console.log("Image Deleted Successfuly", message.imageURL);
        }
      });
    }
    await MessageModel.findByIdAndDelete(message_id);
    await ConversationModel.findOneAndUpdate(
      { _id: conversation_id },
      { $pull: { messages: message_id } },
      { new: true }
    );
    req.io.to(reciver_id.toString()).emit("message-deleted", message_id);
    return res.json({ message: "Message Deleted Successfuly!", status: 1 });
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message || error,
      error: true,
      info: "Server Side Error",
    });
  }
};
module.exports = DeleteMessage;
