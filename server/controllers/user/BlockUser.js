const getConversations = require("../../helpers/getConversation.js");
const UserModel = require("../../models/UserModels.js");

const BlockUser = async (req, res) => {
  const userId = req.userId;
  const { blocked_id } = req.body;
  try {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        $addToSet: { blockedUsers: blocked_id },
      },
      { new: true }
    );

    const blockerFullInfo = { ...user._doc, password: undefined };
    const conversationSender = await getConversations(userId.toString());
    const conversationRecevier = await getConversations(blocked_id.toString());
    // req.io.to(userId.toString()).emit("conversation", conversationSender || []);
    req.io
      .to(blocked_id.toString())
      .emit("conversation", conversationRecevier || []);
    req.io.to(blocked_id.toString()).emit("blockedby", blockerFullInfo);
    return res.json({
      message: "User Blocked!",
      status: 1,
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    return res.json({ message: error.message || error });
  }
};

module.exports = BlockUser;
