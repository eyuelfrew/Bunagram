const UserModel = require("../models/UserModels");

const UserDetails = async (req, res) => {
  const { user_id } = req.body;
  try {
    const user = await UserModel.findById(user_id);
    if (!user) {
      return res.json({ message: "User Not Found!", status: 0 });
    }
    return res.json(usre);
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message, error: true });
  }
};
module.exports = UserDetails;
