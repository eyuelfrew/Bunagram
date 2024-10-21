const UserModel = require("../models/UserModels.js");
const bcryptjs = require("bcryptjs");
const TwoStepVerification = async (req, res) => {
  const { verificationCode, hint, backupEmail, cloudPassword, _id } = req.body;
  const user = await UserModel.findById(_id);
  if (!user) {
    return res.json({ message: "User not found!", notFound: true });
  }
  if (verificationCode !== user.verificationToken) {
    return res.json({ message: "Invaid token used", invalidToken: true });
  }
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(cloudPassword, salt);
  user.backupEmail = backupEmail;
  user.cloudPassword = hashedPassword;
  user.hint = hint;
  user.twoStepVerification = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;
  const newUserInfo = await user.save();
  return res.json({
    message: "Two Step-Auth Enabled!",
    twoStepVerification: true,
    status: 1,
    user: newUserInfo,
  });
};

module.exports = TwoStepVerification;
