const { MessageModel } = require("../../models/ConversationModel");
const {
  decryptMessage,
  encryptMessageToStore,
} = require("../../service/EncriptionServce");

const UpdateMessage = async (req, res) => {
  const { message, reciver_id, message_id } = req.body;

  try {
    /*
     * Decrypt the coming message and encrypt it for storage
     * */
    const PlainText = await decryptMessage(message);
    const cypgerText = await encryptMessageToStore(PlainText);
    const updatedMessage = await MessageModel.findByIdAndUpdate(
      message_id,
      {
        text: cypgerText,
      },
      { new: true }
    );
    if (!updatedMessage) {
      return res.json({ message: "Error Updating Message!", error: true });
    }
    req.io.to(reciver_id.toString()).emit("updated-message", updatedMessage);
    return res.json({ message: "Message Updated Successfuly!" });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message || error, serverError: true });
  }
};
module.exports = UpdateMessage;
