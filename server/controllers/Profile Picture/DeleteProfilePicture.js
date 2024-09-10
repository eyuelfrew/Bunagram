const UserModel = require("../../models/UserModels.js");

const DeletProfilePic = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await UserModel.findById(user_id);
    if (!user) {
      return res.json({
        message: "User not found!",
        notFound: true,
        status: 0,
      });
    }

    user.profile_pic = "";
    user.public_id = "";
    const newUserData = await user.save();
    return res.json({
      message: "Profile Pic Deleted!",
      status: 1,
      user: { ...newUserData._doc, password: undefined },
    });
  } catch (error) {
    console.log(error.message || error);
    return res.json({
      message: error.message || error,
      error: true,
      status: 0,
    });
  }
};

module.exports = DeletProfilePic;
