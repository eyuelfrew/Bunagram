const UserModel = require("../../models/UserModels");
const fs = require("fs");
const path = require("path");
const UploadProfilePic = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.json({ message: "User Not Found!", notFound: true });
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
    let imageURL = "";
    if (req.file) {
      imageURL = `/uploads/${req.file.filename}`; // Store the file path as the image URL
      user.profile_pic = imageURL;
    }
    await user.save();
    const updatedUser = await UserModel.findById(userId).select("-password");
    return res.json({
      message: "Profile Updated Successfully!",
      status: 1,
      user: updatedUser, // Return updated user info
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message || error, status: 0 });
  }
};
module.exports = UploadProfilePic;
