const { ConversationModel } = require("../../models/ConversationModel");
const FetchConversations = async (req, res) => {
  const userId = req.userId;
  try {
    if (userId) {
      const currentUserConversation = await ConversationModel.find({
        $or: [{ sender: userId }, { receiver: userId }],
      })
        .populate("messages")
        .populate(
          "sender",
          "_id name email profile_pic blockedUsers phone_number bio user_name lastSeen createdAt"
        )
        .populate(
          "receiver",
          "_id name email profile_pic blockedUsers phone_number bio user_name lastSeen createdAt"
        )
        .sort({ updatedAt: -1 });

      const conversation = currentUserConversation.map((conv) => {
        const countUnseenMsg = conv?.messages?.reduce((prev, curr) => {
          const msgByUserId = curr?.msgByUserId?.toString();

          if (msgByUserId !== userId) {
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
      return res.json(conversation);
    } else {
      return res.json([]);
    }
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message, serverError: true });
  }
};
module.exports = FetchConversations;
