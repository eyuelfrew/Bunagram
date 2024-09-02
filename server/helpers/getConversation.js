import { ConversationModel } from "../models/ConversationModel.js";
const getConversations = async (currentUserId) => {
  if (currentUserId) {
    const currentUserConversation = await ConversationModel.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .populate("messages")
      .populate("sender", "_id name email profile_pic blockedUsers")
      .populate("receiver", "_id name email profile_pic blockedUsers")
      .sort({ updatedAt: -1 });
    const conversation = currentUserConversation.map((conv) => {
      const countUnseenMsg = conv?.messages?.reduce((preve, curr) => {
        const msgByUserId = curr?.msgByUserId?.toString();

        if (msgByUserId !== currentUserId) {
          return preve + (curr?.seen ? 0 : 1);
        } else {
          return preve;
        }
      }, 0);
      return {
        _id: conv?._id,
        sender: conv?.sender,
        receiver: conv?.receiver,
        unseenMessages: countUnseenMsg,
        lastMessage: conv?.messages[conv?.messages?.length - 1],
      };
    });
    return conversation;
  } else {
    return [];
    // socket.emit("conversation", []);
  }
};
export default getConversations;
