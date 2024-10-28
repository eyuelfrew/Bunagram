const UserModel = require("../../models/UserModels.js");
const crypto = require("crypto");
const DeleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.json({
        message: "User not found!",
        status: 0,
        notFound: true,
      });
    }
    const randomString = crypto.randomBytes(16).toString("hex");
    user.email = `${randomString}@deleted.com`;
    user.name = "Deleted Account";
    user.user_name = `${randomString}@deltedusenames`;
    user.deletedAccount = true;
    user.twoStepVerification = false;
    req.io.emit("conversation");
    await user.save();
    return res.json({ message: "Account Deleted!", status: 1 });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message, error: true, status: 0 });
  }
};

module.exports = DeleteAccount;
