const UserModel = require("../models/UserModels.js");

/*
--- Update User Full Name Controller
*/
const UpdateName = async (req, res) => {
  const { _id, name } = req.body;
  try {
    // Check user if it is in DB
    const user = await UserModel.findById(_id);
    if (!user) return res.json({ message: "User not found!", status: 0 });

    user.name = name;
    await user.save();
    return res.json({
      message: "User info updated!",
      status: 1,
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message || error, status: 0 });
  }
};

/*
--- Check user name uniqueness
*/
const CheckUserName = async (req, res) => {
  const { user_name } = req.body;
  try {
    const user = await UserModel.findOne({ user_name });
    if (user) {
      return res.json({ message: "User is taken!", available: false });
    }
    return res
      .status(200)
      .json({ available: true, message: "Username is available" });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message || error });
  }
};

/*
--- Update @username Controller
*/
const EditUserName = async (req, res) => {
  const { _id, user_name } = req.body;
  try {
    const user = await UserModel.findById(_id);
    if (!user) {
      return res.json({ message: "User not found!", status: 0 });
    }
    user.user_name = user_name;
    await user.save();
    return res.json({
      message: "User-Name updated!",
      available: true,
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message || error });
  }
};

const EditBio = async (req, res) => {
  const { bio, user_id } = req.body;
  try {
    const user = await UserModel.findById(user_id);
    if (!user)
      return res.json({
        message: "User not found!",
        status: 0,
        notFound: true,
      });
    user.bio = bio;
    const updated = await user.save();
    if (updated)
      return res.json({
        message: "Bio updated",
        status: 1,
        user: { ...user._doc, password: undefined },
      });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message || error });
  }
};
// update user name optionall case(Flutter)
const UpdateUserData = async (req, res) => {
  const { name, user_name, bio, user_id } = req.body;
  try {
    const user = await UserModel.findById(user_id);
    if (!user)
      return res.json({
        message: "User not found!",
        status: 0,
        notFound: true,
      });
    user.bio = bio;
    user.name = name;
    user.user_name = user_name;
    const updated = await user.save();
    if (updated) console.log("User Updated From Flutter!");
    return res.json({
      message: "user info updated",
      status: 1,
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message || error });
  }
};
module.exports = {
  UpdateName,
  CheckUserName,
  EditUserName,
  EditBio,
  UpdateUserData,
};
