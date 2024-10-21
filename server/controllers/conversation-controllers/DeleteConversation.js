const {
  ConversationModel,
  MessageModel,
} = require("../../models/ConversationModel");

const DeleteConversation = async (req, res) => {
  const { conversation_id, reciver_id } = req.body;
  const userId = req.userId;
  try {
    const conversation = await ConversationModel.findById(conversation_id);
    if (!conversation) {
      return res.json({
        message: "Conversation not found",
        status: 0,
        error: true,
      });
    }
    await MessageModel.deleteMany({
      _id: { $in: conversation.messages },
    });
    await ConversationModel.deleteOne({ _id: conversation_id });
    const roomName = `conversation_${conversation._id}`;
    // req.io
    //   .to(userId.toString())
    //   .emit("con-del", { conversation_id: conversation_id });
    req.io.to(roomName).emit("con-del", { conversation_id: conversation_id });
    req.io
      .to(reciver_id.toString())
      .emit("del-conversation", { conversation_id: conversation_id });
    return res.json({ message: "Conversation Deleted", status: 1 });
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message || error,
      error: true,
      status: 0,
    });
  }
};
module.exports = DeleteConversation;
