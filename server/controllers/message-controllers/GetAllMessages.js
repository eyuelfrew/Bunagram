const { ConversationModel } = require("../../models/ConversationModel");

const GetAllMessages = async (req, res) => {
  const { reciver_id } = req.body;
  const user = req.userId;

  try {
    const Conversation = await ConversationModel.findOne({
      $or: [
        {
          sender: user?.toString(),
          receiver: reciver_id?.toString(),
        },
        {
          sender: reciver_id.toString(),
          receiver: user.toString(),
        },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });
    return res.json(Conversation.messages);
  } catch (error) {
    console.log(error.message || error);
    return res.json({ message: error.message, error: true });
  }
};
module.exports = GetAllMessages;
