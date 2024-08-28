import UserModel from "../models/UserModels.js";
const searchUser = async (req, res) => {
  try {
    const { query } = req.body;
    const key_word = new RegExp(query, "i", "g");
    const user = await UserModel.find({
      $or: [{ name: key_word }, { email: key_word }],
    }).select("-password");

    return res.json({ messge: "all user", data: user });
  } catch (error) {
    res.json({ error: true, message: error.message || error });
  }
};
export default searchUser;
