const UserModel = require("../models/UserModels.js");
const jwt = require("jsonwebtoken");
const SendWelcomeEmail = require("../mail/WelcomeEmail.js");

const VerifyAccount = async (req, res) => {
  const { verification_code } = req.body;
  const user = await UserModel.findOne({
    verificationToken: verification_code,
    verificationTokenExpiresAt: { $gt: Date.now() },
  });

  // Check if the unverified user exists
  if (!user) {
    return res.json({
      message: "Incorrect Code!",
      notRegistered: true,
      status: 0,
    });
  }

  // If user found, update and save new status of user
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;

  // Update and save user status
  await user.save();
  const tokenData = {
    id: user._id,
    email: user.email,
  };

  const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
    expiresIn: "5d",
  });

  // Configure cookie and send response to client
  await SendWelcomeEmail(user.email, user.name);
  return res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .json({
      message: "Account Verified Successfully!",
      status: 200,
      user: { ...user._doc, password: undefined },
      token: token,
    });
};

module.exports = VerifyAccount;
