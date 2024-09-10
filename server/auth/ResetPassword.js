const Password_Reset_Success_Email = require("../mail/Password_Reset_Success_Email.js");
const UserModel = require("../models/UserModels.js");
const bcryptjs = require("bcryptjs");

const ResetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Find user by the generated token
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    // Check if the user exists or the token is not expired
    if (!user) {
      return res.json({
        status: 0,
        message: "Invalid or expired reset token!",
      });
    }

    // Update password
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    // Save new user info in the database
    await user.save();

    // Send reset password successful email
    await Password_Reset_Success_Email(user.email);

    return res.json({ message: "Password Reset Successfully!", status: 1 });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message || error });
  }
};

module.exports = ResetPassword;
