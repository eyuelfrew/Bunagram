const UserModel = require("../models/UserModels.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const VerifyCloud = async (req, res) => {
  const { cloud_password } = req.body;
  const userId = req.userId;
  const user = await UserModel.findById(userId);
  if (!user) return res.json({ message: "User not found", notFound: true });
  const checkPassword = await bcryptjs.compare(
    cloud_password,
    user.cloudPassword
  );
  if (!checkPassword) {
    return res.json({ message: "wrong password", wrongCloud: true });
  }
  const tokenData = {
    id: user._id,
    email: user.email,
  };
  const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
    expiresIn: "5d",
  });

  return res.json({
    message: "loged in successful",
    loggedIn: true,
    user: { ...user._doc, password: undefined },
    token: token,
  });
};

module.exports = VerifyCloud;
