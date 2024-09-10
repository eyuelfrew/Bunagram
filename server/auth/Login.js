const UserModel = require("../models/UserModels.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Login = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  try {
    /*
    -- Check if user exists in the database
    */
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({
        message: "User not found!",
        status: 0,
        notFound: true,
      });
    }

    /*
      -- If user exists in the database then check if the password matches
    */
    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
      return res.json({
        message: "Invalid Credentials!",
        status: 0,
        passwordIncorrect: true,
      });
    }
    user.lastLogin = new Date();
    await user.save();

    /*
      --- Response success with cookie
    */
    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const tokenOption = rememberMe ? { expiresIn: "30d" } : { expiresIn: "5d" };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, tokenOption);

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        message: "Login Successful",
        status: 1,
        user: { ...user._doc, password: undefined },
        token: token,
      });
  } catch (err) {
    console.log(err.message || err);
    return res.json({ message: err.message || err });
  }
};

module.exports = Login;
