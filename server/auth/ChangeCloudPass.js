const UserModel = require("../models/UserModels.js");
const bcryptjs = require("bcryptjs");
const ChangeCloudPass = async (req, res) => {
  const { password, hint, email } = req.body;
  const userId = req.userId;
  console.log("It works here perfectly!!!");
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.json({ message: "User not found", status: 0, notFound: true });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    user.cloudPassword = hashedPassword;
    user.backupEmail = email;
    user.hint = hint;
    await user.save();
    return res.json({ message: "Cloud-pass updated Successfuly", status: 1 });
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message || error,
      status: 0,
      serverError: true,
    });
  }
};
module.exports = ChangeCloudPass;
