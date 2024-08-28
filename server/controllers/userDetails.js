import getUserDetailFromToken from "../helpers/getUserDetailsFromToken.js";
const useDetails = async (req, res) => {
  try {
    const token = req.cookies.token || "";
    const user = await getUserDetailFromToken(token);
    return res.status(200).json({ message: "user detail", data: user });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};
export default useDetails;
