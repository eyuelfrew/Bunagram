const UserModel = require("../models/UserModels.js");
const jwt = require("jsonwebtoken");
const Logout = async (req, res) => {
  const token = req.cookies.token || "";
  console.log("token==", token)
  if (!token) {
    return res.json({
      message: "Unauthorized - no token provided",
      status: 0,
      notAuth: true,
    });
  }
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.json({
        message: "Unauthorized - invalid token",
        status: 0,
        notAuth: true,
      });
    }
    const userId = decoded.id;
    const currentTime = new Date();
    await UserModel.findByIdAndUpdate(userId, {
      lastSeen: currentTime,
    });
    const cookieOptions = {
      httpOnly: true,
      sameSite: "none",
      secure: false,
    };

    return res
      .clearCookie("token", cookieOptions)
      .status(200)
      .json({ message: "Logout successful", status: 1 });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message || error });
  }
};

module.exports = Logout;
