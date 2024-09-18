const { ConversationModel } = require("../models/ConversationModel.js");

const getConversations = async (currentUserId) => {
  try {
    if (currentUserId) {
      const currentUserConversation = await ConversationModel.find({
        $or: [{ sender: currentUserId }, { receiver: currentUserId }],
      })
        .populate("messages")
        .populate(
          "sender",
          "_id name email profile_pic blockedUsers phone_number bio user_name lastSeen"
        )
        .populate(
          "receiver",
          "_id name email profile_pic blockedUsers phone_number bio user_name lastSeen"
        )
        .sort({ updatedAt: -1 });

      const conversation = currentUserConversation.map((conv) => {
        const countUnseenMsg = conv?.messages?.reduce((prev, curr) => {
          const msgByUserId = curr?.msgByUserId?.toString();

          if (msgByUserId !== currentUserId) {
            return prev + (curr?.seen ? 0 : 1);
          } else {
            return prev;
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
  } catch (error) {
    return error.message;
  }
};

module.exports = getConversations;
