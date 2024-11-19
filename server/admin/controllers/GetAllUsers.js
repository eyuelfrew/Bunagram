const UserModel = require("../../models/UserModels.js");

const GetAllUsers = async (_, res) => {
  try {
    const users = await UserModel.find();
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message || error, status: 0 });
  }
};
module.exports = GetAllUsers;
