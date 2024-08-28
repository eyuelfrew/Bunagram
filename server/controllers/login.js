import UserModel from "../models/UserModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check email if exists
    const user = await UserModel.findOne({ email });
    if (!user) return res.json({ message: "User Not Found!", notFound: true });

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      return res.json({ message: "Wrong Password", notVerified: true });

    //if passwrod is verified
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
    const userInfo = {
      _id: user?._id,
      name: user?.name,
      email: user?.email,
      profile_pic: user?.profile_pic,
    };
    return res.cookie("token", token, cookieOptions).status(200).json({
      message: "Login Success",
      token: token,
      success: true,
      // user: userInfo,
    });
  } catch (error) {
    console.log("Error: ", error.message || error);
    return res.json({ error: error.message });
  }
};
export default login;
