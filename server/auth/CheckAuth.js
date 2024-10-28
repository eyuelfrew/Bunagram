const UserModel = require("../models/UserModels.js");

const CheckAuth = async (req, res) => {
  console.log(req.userId);
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.json({
        message: "User not found!",
        status: 0,
        userNotFound: true,
      });
    }

    return res.status(200).json({
      message: "Authenticated",
      status: 1,
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message, serverError: true, status: 0 });
  }
};

module.exports = CheckAuth;
