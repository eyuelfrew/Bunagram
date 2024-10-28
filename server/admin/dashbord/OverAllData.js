const {
  ConversationModel,
  MessageModel,
} = require("../../models/ConversationModel");
const UserModel = require("../../models/UserModels");

const AllStatics = async (req, res) => {
  try {
    const [
      totalUsers,
      unverifiedUsers,
      deletedAccounts,
      totalConversations,
      totalMessages,
    ] = await Promise.all([
      UserModel.countDocuments(), // Total number of users
      UserModel.countDocuments({ isVerified: false }), // Verified users
      UserModel.countDocuments({ deletedAccount: true }), // Deleted accounts
      ConversationModel.countDocuments(), // Total number of conversations
      MessageModel.countDocuments(), // Total number of messages
    ]);
    res.json({
      totalUsers,
      unverifiedUsers,
      deletedAccounts,
      totalConversations,
      totalMessages,
    });
  } catch (error) {
    console.error(error);
    res.json({ message: "Error fetching dashboard stats", status: 0 });
  }
};
module.exports = AllStatics;
