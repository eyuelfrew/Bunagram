const logout = async (req, res) => {
  try {
    const cookieOption = {
      httpOnly: true,
      secure: true,
    };
    return res.cookie("token", "", cookieOption).status(200).json({
      message: "Session out",
      logout: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true });
  }
};

module.exports = logout;
