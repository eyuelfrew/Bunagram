import getUserDetailFromToken from "../helpers/getUserDetailsFromToken.js";
import UserModel from "../models/UserModels.js";
const UpdateUser = async (req, res) => {
  try {
    const token = req.cookies.token || "";
    const user = await getUserDetailFromToken(token);
    const { name, profile_pic } = req.body;
    const updateUser = await UserModel.updateOne(
      { _id: user._id },
      {
        name,
        profile_pic,
      }
    );
    const userInformation = await UserModel.findById(user._id).select(
      "-password"
    );
    return res.json({
      message: "user update",
      data: userInformation,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

export default UpdateUser;
