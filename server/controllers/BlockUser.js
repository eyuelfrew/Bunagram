const UserModel = require("../models/UserModels.js");

const BlockUser = async (req, res) => {
  const { blocker_id, blocked_id } = req.body;
  try {
    const user = await UserModel.findByIdAndUpdate(
      blocker_id,
      {
        $addToSet: { blockedUsers: blocked_id },
      },
      { new: true }
    );
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
