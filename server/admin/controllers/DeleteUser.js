const UserModel = require("../../models/UserModels");

const DeleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found", status: 0 });
    }

    return res
      .status(200)
      .json({ message: "User deleted successfully", status: 1 });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || "An error occurred", status: 0 });
  }
};

module.exports = DeleteUser;
