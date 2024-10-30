const AdminModel = require("../../models/AdminModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminLogin = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  try {
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.json({
        message: "User not found!",
        status: 0,
        notFound: true,
      });
    }
    const checkPassword = await bcryptjs.compare(password, admin.password);
    if (!checkPassword) {
      return res.json({
        message: "Invalid Credentials!",
        wrongCredentials: true,
      });
    }
    const tokenData = {
      id: admin._id,
      email: admin.email,
    };
    const tokenOption = rememberMe ? { expiresIn: "30d" } : { expiresIn: "5d" };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, tokenOption);
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        domain: ".welllaptops.com",
      })
      .json({
        message: "Login Successful",
        loggedIn: true,
        admin: { ...admin._doc, password: undefined },
        token: token,
      });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message || error, status: 0 });
  }
};
module.exports = AdminLogin;
