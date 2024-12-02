const { MessageModel } = require("../../models/ConversationModel");
const DeleteSelectedMessages = async (req, res) => {
  const { messageIds, conversation_id } = req.body;
  try {
    await MessageModel.deleteMany({ _id: { $in: messageIds } });
    const roomName = `conversation_${conversation_id}`;
    req.io.to(roomName).emit("mutli-message-deleted", messageIds);
    res
      .status(200)
      .json({ success: true, message: "Messages deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to delete messages" });
  }
};
module.exports = DeleteSelectedMessages;
