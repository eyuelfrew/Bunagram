import UserModel from "../models/UserModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const checkPassword = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await UserModel.findById(userId);
    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
      return res.json({ message: "Wrong Password", error: true });
    }

    const tokenData = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    };
    return res.cookie("token", token, cookieOptions).status(200).json({
      message: "Login Success",
      token: token,
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: error.message || error, error: true });
  }
};

export default checkPassword;
