const AdminModel = require("../../models/AdminModel.js");

const CheckAdminAuth = async (req, res) => {
  try {
    const admin = await AdminModel.findById(req.userId);
    if (!admin) {
      return res.json({
        message: "User not found!",
        status: 0,
        userNotFound: true,
      });
    }

    return res.status(200).json({
      message: "Authenticated",
      status: 1,
      admin: { ...admin._doc, password: undefined },
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message,
      serverError: true,
      status: 0,
    });
  }
};
module.exports = CheckAdminAuth;
