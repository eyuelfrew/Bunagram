const ForgotPasswordEmail = require("../mail/ForgotPasswordEmail.js");
const UserModel = require("../models/UserModels.js");
const crypto = require("crypto");

const ForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // Find a user by email
    const user = await UserModel.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.json({
        message: "User not found!",
        status: 0,
        notFound: true,
      });
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // Expires after 1 hour
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    // Send password reset email
    const response = await ForgotPasswordEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    return res.json({
      message: "Password Reset Link Sent!",
      response: response,
      status: 1,
    });
  } catch (error) {
    console.log(error.message || error);
    return res.json({ message: error.message || error });
  }
};

module.exports = ForgotPassword;
