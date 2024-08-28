import UserModel from "../models/UserModels.js";
import bcryptjs from "bcryptjs";
const registerUser = async (req, res) => {
  try {
    const { name, email, password, profile_pic } = req.body;
    const checkEmail = await UserModel.findOne({ email });
    if (checkEmail) {
      return res.json({ message: "Already user exists", error: true });
    }

    //hashing password
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    //register new user in DB
    const payload = {
      name,
      email,
      profile_pic,
      password: hashPassword,
    };
    const user = new UserModel(payload);
    const userSave = await user.save();
    return res.status(201).json({
      message: "User created successfully",
      data: userSave,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

export default registerUser;
