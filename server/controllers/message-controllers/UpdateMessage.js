const { MessageModel } = require("../../models/ConversationModel");
const Encryption = require("../../service/EncriptionServce");

const UpdateMessage = async (req, res) => {
  const { message, reciver_id, message_id } = req.body;
  const EncService = new Encryption(
    process.env.TRANSIT_SECERETE_KEY,
    process.env.STORAGE_SECRETE_KEY,
    process.env.BACK_TO_CLIENT_KEY
  );
  try {
    const decryptIncomingMessage =
      EncService.decryptIncomingSingleMessage(message);
    const EncrypyForStorage = EncService.encryptForStorage(
      decryptIncomingMessage
    );
    const updatedMessage = await MessageModel.findByIdAndUpdate(
      message_id,
      {
        text: EncrypyForStorage,
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
