const UserModel = require("../../models/UserModels.js");

const UnBanUser = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", notFound: true, status: 0 });
    }
    user.banded = false;
    await user.save();
    req.io.to(id.toString()).emit("unbanded", user);
    return res.json({ message: "User updated", status: 1 });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message || error, status: 1 });
  }
};
module.exports = UnBanUser;
