const UserModel = require("../../models/UserModels.js");

const FilterUsers = async (req, res) => {
  const { query } = req.body;
  try {
    const bandedStatus =
      query === "false" ? false : query === "true" ? true : null;
    let users;
    if (bandedStatus !== null) {
      users = await UserModel.find({ banded: bandedStatus });
    } else {
      users = await UserModel.find({});
    }

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message || error, status: 0 });
  }
};
module.exports = FilterUsers;
