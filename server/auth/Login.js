import UserModel from "../models/UserModels.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
const Login = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  try {
    /*
    -- Check if user exist in the data base
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
      -- if user exists in the data base then check if the password matchs
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
      --- response success with cookie
      */
    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const tokenOption = rememberMe ? { expiresIn: "30d" } : { expiresIn: "1d" };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, tokenOption);

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 2 * 60 * 60 * 1000,
        path: "/",
      })
      .json({
        message: "Login Successfull",
        status: 1,
        user: { ...user._doc, password: undefined },
        token: token,
      });
  } catch (err) {
    console.log(err.message || err);
    return res.json({ message: err.message || err });
  }
};
export default Login;
