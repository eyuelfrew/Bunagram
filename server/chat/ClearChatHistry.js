import { ConversationModel } from "../models/ConversationModel.js";

const ClearChat = async (sender_id, reciver_id) => {
  try {
    const converstaion = await ConversationModel.findOne({
      $or: [
        { sender: sender_id, receiver: reciver_id },
        { sender: reciver_id, receiver: sender_id },
      ],
    });
  } catch (error) {
    return { message: error.message };
  }
};
export default ClearChat;
