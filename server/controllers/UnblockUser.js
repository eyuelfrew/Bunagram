import UserModel from "../models/UserModels.js";
const UnblockUser = async (req, res) => {
  const { blocker_id, blocked_id } = req.body;
  try {
    const user = await UserModel.findByIdAndUpdate(
      blocker_id,
      {
        $pull: { blockedUsers: blocked_id },
      },
      { new: true }
    );
    return res.json({
      message: "User Unblocked!",
      status: 1,
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    return res.json({ message: error.message || error });
  }
};
export default UnblockUser;
