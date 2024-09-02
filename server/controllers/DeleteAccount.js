import UserModel from "../models/UserModels.js";

const DeleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findById(id);
    if (!user)
      return res.json({
        message: "User not found!",
        status: 0,
        notFound: true,
      });
    await user.deleteOne();
    return res.json({ message: "User Deleted!", status: 1 });
  } catch (error) {
    console.log(error.message);
    return res.json({ message: error.message, error: true, status: 0 });
  }
};
export default DeleteAccount;
