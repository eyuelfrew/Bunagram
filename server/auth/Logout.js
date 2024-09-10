const Logout = async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    };

    // Clear the token cookie
    res.clearCookie("token", cookieOptions);
    return res
      .clearCookie("token")
      .status(200)
      .json({ message: "Logout successful", status: 1 });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message || error });
  }
};

module.exports = Logout;
