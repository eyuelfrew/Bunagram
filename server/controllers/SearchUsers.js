const UserModel = require("../models/UserModels.js");

const searchUser = async (req, res) => {
  try {
    const { query } = req.body;
    const key_word = new RegExp(query, "i");
    const user = await UserModel.find({
      $or: [{ name: key_word }, { email: key_word }],
    }).select("-password");

    return res.json({ message: "All users", data: user });
  } catch (error) {
    res.json({ error: true, message: error.message || error });
  }
};

module.exports = searchUser;
