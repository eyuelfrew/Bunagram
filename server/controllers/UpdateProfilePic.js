const UserModel = require("../models/UserModels.js");

const UpdateProfilePicture = async (req, res) => {
  const { public_id, pic_url, user_id } = req.body;
  try {
    const user = await UserModel.findById(user_id);
    if (!user) {
      return res.json({
        message: "User not found!",
        status: 0,
        notFound: true,
      });
    }
    user.profile_pic = pic_url;
    user.public_id = public_id;
    const newUserInfo = await user.save();
    return res.json({
      message: "Profile pic updated!",
      status: 1,
      user: { ...newUserInfo._doc, password: undefined },
    });
  } catch (err) {
    return res.json({
      message: err.message || err,
      error: true,
      status: 0,
    });
  }
};

module.exports = UpdateProfilePicture;
