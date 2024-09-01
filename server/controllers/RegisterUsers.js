import UserModel from "../models/UserModels.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import SendVerificationEmail from "../mail/SendVerificationEmail.js";
import GenerateVerificationToken from "../utils/GenerateVerificationToken.js";
const RegisterUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //check if use exists
    const checkEmail = await UserModel.findOne({ email });
    if (checkEmail) {
      return res.json({ message: "User Exists!", status: 0 });
    }

    //hashing passoword
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    //generate verification code
    const verificationToken = await GenerateVerificationToken();

    //register the new user in mongoDB
    const payload = {
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //expires after 24 hours
    };
    const user = new UserModel(payload);
    const userSave = await user.save();

    //generate jwt and send as cookei
    const token = jwt.sign(
      { id: userSave._id, email: userSave.email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "45m",
      }
    );
    res;

    //send verification code to user email
    const response = await SendVerificationEmail(
      email,
      payload.verificationToken
    );
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      })
      .json({
        message: "User Created!",
        emailing_response: response,
        status: 1,
        token: token,
        user: { ...user._doc, password: undefined },
      });
  } catch (error) {
    console.log("what is this: ", error);
    return res.json({ message: error || error, status: 0 });
  }
};
export default RegisterUser;
