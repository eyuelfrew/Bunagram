const UserModel = require("../models/UserModels.js");
const jwt = require("jsonwebtoken");
const CheckAuth = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.json({
        message: "User not found!",
        status: 0,
        userNotFound: true,
      });
    }
    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "5d",
    });
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        message: "Authenticated",
        status: 1,
        token: token,
        user: { ...user._doc, password: undefined },
      });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message, serverError: true, status: 0 });
  }
};

module.exports = CheckAuth;
