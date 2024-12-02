const UserModel = require("../../models/UserModels.js");

const BanUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", notFound: true, status: 0 });
    }
    user.banded = true;
    req.io.to(id.toString()).emit("banded", user);
    await user.save();
    return res.json({ message: "User updated", status: 1 });
  } catch (error) {
    return res.status(500).json({ message: error.message || error, status: 1 });
  }
};
module.exports = BanUser;
