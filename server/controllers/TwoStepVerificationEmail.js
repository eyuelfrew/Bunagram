const UserModel = require("../models/UserModels.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const GenerateVerificationToken = require("../utils/GenerateVerificationToken.js");
const TwoStepEmail = require("../mail/TwoStepEmail.js");
const SendToStepVerificationEmail = async (req, res) => {
  const { email, _id } = req.body;
  const user = await UserModel.findById(_id);
  if (!user) return res.json({ message: "User not found!", notFound: true });
  if (!email) {
    return res.json({ message: "Email is required", noEmail: true });
  }
  const verificationToken = GenerateVerificationToken();

  user.verificationToken = verificationToken;
  user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

  const response = await TwoStepEmail(email, verificationToken);
  const userSave = await user.save();
  return res.json({ message: "Email sent", status: 1, response: response });
};
module.exports = SendToStepVerificationEmail;
