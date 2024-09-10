const { ConversationModel } = require("../models/ConversationModel.js");

const ClearChat = async (sender_id, receiver_id) => {
  try {
    const conversation = await ConversationModel.findOne({
      $or: [
        { sender: sender_id, receiver: receiver_id },
        { sender: receiver_id, receiver: sender_id },
      ],
    });
  } catch (error) {
    return { message: error.message };
  }
};

module.exports = ClearChat;
