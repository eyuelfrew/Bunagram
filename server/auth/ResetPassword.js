import Password_Reset_Success_Email from "../mail/Password_Reset_Success_Email.js";
import UserModel from "../models/UserModels.js";
import bcryptjs from "bcryptjs";
const ResetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // find user by the generated token
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    //check if the usre exists or the token not expired
    if (!user) {
      return res.json({
        status: 0,
        message: "Invalid or expired reset token!",
      });
    }

    // update password
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    // save new user info in to database
    await user.save();

    //send rest password successfull email
    await Password_Reset_Success_Email(user.email);

    return res.json({ message: "Password Rest SuccessFully!", status: 1 });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message || error });
  }
};
export default ResetPassword;
