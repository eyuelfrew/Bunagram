import UserModel from "../models/UserModels.js";

const CheckAuth = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user)
      return res.json({
        messge: "User not found!",
        status: 0,
        useNotFound: true,
      });

    return res.status(200).json({
      message: "Autenticated",
      status: 1,
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ message: error.message, serverError: true, status: 0 });
  }
};
export default CheckAuth;
