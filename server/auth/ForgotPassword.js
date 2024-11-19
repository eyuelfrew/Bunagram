const SendVerificationEmail = require("../mail/SendVerificationEmail.js");
const UserModel = require("../models/UserModels.js");
const GenerateVerificationToken = require("../utils/GenerateVerificationToken.js");

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
    const verificationToken = GenerateVerificationToken();
    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    // Send verification code to user email
    const response = await SendVerificationEmail(email, verificationToken);
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
