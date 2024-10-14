const {
  ConversationModel,
  MessageModel,
} = require("../../models/ConversationModel");
const Encryption = require("../../service/EncriptionServce");

const SendMessage = async (req, res) => {
  const { reciver_id, text, conversation } = req.body;
  const SenderId = req.userId;
  console.log(req.body);
  console.log(SenderId);
  const EncService = new Encryption(
    process.env.TRANSIT_SECERETE_KEY,
    process.env.STORAGE_SECRETE_KEY,
    process.env.BACK_TO_CLIENT_KEY
  );
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
    }

    /*
     * Decrypt the coming message and encrypt it for storage
     * */
    const PlainText = EncService.decryptIncomingSingleMessage(text);

    //store the sent message in data base
    const message = new MessageModel({
      text: EncService.encryptForStorage(PlainText),
      imageURL: "",
      sender: SenderId,
      msgByUserId: SenderId,
    });
    //store the new message and add the new mesage id to the conversation messages array
    const savedMessage = await message.save();
    /*
     * Decrypted the saved message or stored message and encrypt it using
     * Different Key and Send to each user(conversation)
     * */
    let messageToBeSent = EncService.decrypteStoredMessage(savedMessage.text);
    messageToBeSent = EncService.encryptSingleMessage(messageToBeSent);
    savedMessage.text = messageToBeSent;
    const payload = {
      reciver: reciver_id,
      convID: conversation?._id,
      message: savedMessage,
    };
    //send the single message to both socket conenction
    req.io.to(SenderId.toString()).emit("new-message", payload);
    req.io.to(reciver_id.toString()).emit("new-message", payload);
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
