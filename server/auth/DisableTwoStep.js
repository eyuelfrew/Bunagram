const UserModel = require("../models/UserModels.js");

const DisableTwo = async (req, res) => {
  const { cloud_password } = req.body;
  const user_id = req.userId;
  try {
    const user = await UserModel.findById(user_id);
    if (!user) {
      return res.json({ message: "User not found!", notFound: true });
    }
    const checkPassword = user.cloudPassword.trim() === cloud_password.trim();
    if (!checkPassword) {
      return res.json({ message: "Wrong cloud password!", notAuth: true });
    }
    user.twoStepVerification = false;
    user.cloudPassword = "";
    user.backupEmail = "";
    user.hint = "";
    const newUserInfo = await user.save();
    return res.json({
      message: "Two-Step Disabled!",
      status: 1,
      user: {
        ...newUserInfo._doc,
        password: undefined,
        cloudPassword: undefined,
      },
    });
  } catch (error) {
    return res.json({ message: error.message || error, error: true });
  }
};
module.exports = DisableTwo;
