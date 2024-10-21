const {
  ConversationModel,
  MessageModel,
} = require("../../models/ConversationModel");

const DeleteAllMessages = async (req, res) => {
  const { conversation_id } = req.body;
  const userId = req.userId;
  try {
    const conversation = await ConversationModel.findById(conversation_id);
    if (!conversation) {
      return res.json({
        message: "Chat not found!",
        notFound: true,
        status: 0,
      });
    }
    await MessageModel.deleteMany({
      _id: { $in: conversation.messages },
    });
    const roomName = `conversation_${conversation._id}`;

    req.io.to(roomName).emit("clear-chat");
    req.io.to(userId.toString()).emit("clear-chat");
    return res.json({ message: "Chat Cleard!", status: 1 });
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message || error,
      serverError: true,
      status: 0,
    });
  }
};
module.exports = DeleteAllMessages;
