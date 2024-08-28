import UserModel from "../models/UserModels.js";

const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const exits = await UserModel.findOne({ email }).select("-password");
    if (!exits) {
      return res.json({ message: "User Not Found!", error: true });
    }
    return res.json({ message: "Email Exist!", error: false, data: exits });
  } catch (error) {
    console.log("Error: ", error.message || error);
    return res.json({ error: error.message });
  }
};

export default checkEmail;
