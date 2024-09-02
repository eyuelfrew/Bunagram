import UserModel from "../models/UserModels.js";
import jwt from "jsonwebtoken";
import SendWelcomeEmail from "../mail/WelcomeEmail.js";
const VerifyAccount = async (req, res) => {
  const { verification_code } = req.body;
  const user = await UserModel.findOne({
    verificationToken: verification_code,
    verificationTokenExpiresAt: { $gt: Date.now() },
  });

  //check if the unverfied user exists
  if (!user) {
    return res.json({
      message: "Not registerd",
      notRegistered: true,
      status: 0,
    });
  }

  //if user found , update and save new status of user
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;

  //update and save user status
  await user.save();
  const tokenData = {
    id: user._id,
    email: user.email,
  };

  const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
    expiresIn: "5d",
  });

  // configure cookie and send response to client
  await SendWelcomeEmail(user.email, user.name);
  return res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: "http://localhost:5173/",
      path: "/",
    })
    .json({
      message: "Account Verifiyed Successfuli!",
      status: 200,
      user: { ...user._doc, password: undefined },
      token: token,
    });
};

export default VerifyAccount;
