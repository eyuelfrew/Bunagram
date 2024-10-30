const AdminModel = require("../../models/AdminModel");
const jwt = require("jsonwebtoken");
const AdminLogout = async (req, res) => {
  const token = req.cookies.token || "";
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
    const adminId = decoded.id;
    const currentTime = new Date();
    await AdminModel.findByIdAndUpdate(adminId, {
      lastSeen: currentTime,
    });
    const cookieOptions = {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      domain: ".welllaptops.com",
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
module.exports = AdminLogout;
