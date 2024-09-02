import ForgotPasswordEmail from "../mail/ForgotPasswordEmail.js";
import UserModel from "../models/UserModels.js";
import crypto from "crypto";
const ForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    //fid a user by email
    const user = await UserModel.findOne({ email });

    //check if user exists
    if (!user) {
      return res.json({
        message: "User not found!",
        status: 0,
        notFound: true,
      });
    }

    //generate passoword reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //expires after 1 hour
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    //send password reset email
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
export default ForgotPassword;
