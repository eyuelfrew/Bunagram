const UserModel = require("../models/UserModels.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SendVerificationEmail = require("../mail/SendVerificationEmail.js");
const GenerateVerificationToken = require("../utils/GenerateVerificationToken.js");

const RegisterUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const checkEmail = await UserModel.findOne({ email });
    if (checkEmail) {
      return res.json({ message: "User Exists!", status: 0 });
    }

    // Hashing password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Generate verification code
    const verificationToken = GenerateVerificationToken();

    // Register the new user in MongoDB
    const payload = {
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // Expires after 24 hours
    };
    const user = new UserModel(payload);
    const userSave = await user.save();

    // Send verification code to user email
    const response = await SendVerificationEmail(
      email,
      payload.verificationToken
    );

    return res
      .json({
        message: "User Created!",
        emailing_response: response,
        status: 1,
        user: { ...user._doc, password: undefined }
      });
  } catch (error) {
    console.log(error);
    return res.json({ message: error || error, status: 0 });
  }
};

module.exports = RegisterUser;
