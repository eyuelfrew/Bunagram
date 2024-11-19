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
    -- check if the account is locked
    */
    if (user.isLocked) {
      const unlockTime = new Date(user.lockUntil);
      const currentTime = new Date();
      if (currentTime >= unlockTime) {
        user.isLocked = false;
        user.failedLoginAttempts = 0;
        user.lockUntil = null;
      } else {
        const remainingTime = Math.ceil(
          (unlockTime - currentTime) / (1000 * 60)
        );
        return res.send({
          minLeft: remainingTime,
          isLocked: true,
          message: `Account is locked. Try again in ${remainingTime} minutes.`,
        });
      }
    }

    /*
      -- If user exists in the database then check if the password matches
    */
    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 3) {
        user.isLocked = true;
        user.lockUntil = new Date(Date.now() + 5 * 60 * 1000);
      }
      await user.save();
      return res.json({
        message: "Invalid Credentials!",
        wrongCredentials: true,
      });
    }
    user.failedLoginAttempts = 0;
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
      })
      .json({
        message: "Login Successful",
        loggedIn: true,
        twoStepVerification: user.twoStepVerification,
        user: { ...user._doc, password: undefined },
        token: token,
      });
  } catch (err) {
    console.log(err.message || err);
    return res.json({ message: err.message || err });
  }
};

module.exports = Login;
