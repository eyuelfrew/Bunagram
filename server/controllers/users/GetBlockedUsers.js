const UserModel = require("../../models/UserModels");

const GetBlockedUsers = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await UserModel.findById(userId).populate(
      "blockedUsers",
      "_id name email profile_pic"
    );
    if (!user) {
      return res.json({ message: "User Not Found", status: 0 });
    }
    return res.json({ users: user.blockedUsers });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message || error, status: 0 });
  }
};
module.exports = GetBlockedUsers;
