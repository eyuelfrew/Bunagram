const bcryptjs = require("bcryptjs");
const AdminModel = require("../../models/AdminModel.js");

const CreateAdminAccount = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const checkEmail = await AdminModel.findOne({ email });
    if (checkEmail) {
      return res.json({ message: "User Exists!", status: 0 });
    }

    // Hashing password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    ("/stat");
    // Register the new user in MongoDB
    const payload = {
      name,
      email,
      password: hashedPassword,
    };
    const admin = new AdminModel(payload);
    await admin.save();

    return res.json({
      message: "User Created!",
      status: 1,
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: error || error, status: 0 });
  }
};

module.exports = CreateAdminAccount;
