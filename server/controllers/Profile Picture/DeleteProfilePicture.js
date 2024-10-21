const UserModel = require("../../models/UserModels.js");
const fs = require("fs");
const path = require("path");
const DeletProfilePic = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.json({
        message: "User not found!",
        notFound: true,
        status: 0,
      });
    }
    if (user.profile_pic != "") {
      const imagePath = path.join(__dirname, "..", "..", user.profile_pic);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.log("Error Deleting Profile Picture", err);
        } else {
          console.log("Profile Picture Deleted Successfuly", user.profile_pic);
        }
      });
    }
    user.profile_pic = "";
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
