const {
  ConversationModel,
  MessageModel,
} = require("../../models/ConversationModel");

const GetAllMessages = async (req, res) => {
  const { reciver_id } = req.body;
  const userId = req.userId;

  try {
    const conversation = await ConversationModel.findOne({
      $or: [
        {
          sender: userId?.toString(),
          receiver: reciver_id?.toString(),
        },
        {
          sender: reciver_id.toString(),
          receiver: userId.toString(),
        },
      ],
    });
    if (!conversation) {
      return res.json([]);
    }
    // Mark messages as seen if they belong to the receiver
    const messageIds = conversation?.messages || [];
    await MessageModel.updateMany(
      { _id: { $in: messageIds }, msgByUserId: reciver_id.toString() },
      { $set: { seen: true } }
    );
    const updatedConversation = await ConversationModel.findOne({
      $or: [
        { sender: userId.toString(), receiver: reciver_id.toString() },
        { sender: reciver_id.toString(), receiver: userId.toString() },
      ],
    })
      .populate({
        path: "messages",
        populate: {
          path: "replyToMessageId", // Populate the replyTo field
          model: "Message", // Reference to the Message model
          select: "text", // Only get the text field from the replied message
        },
      })
      .sort({ updatedAt: -1 });

    return res.json(updatedConversation?.messages || []);
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message, error: true });
  }
};
module.exports = GetAllMessages;
