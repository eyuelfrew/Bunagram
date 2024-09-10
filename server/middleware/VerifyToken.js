const jwt = require("jsonwebtoken");

const VerifyToken = async (req, res, next) => {
  const token = req.cookies.token || "";
  if (!token) {
    return res.json({
      message: "Unauthorized - no token provided",
      status: 0,
      notAuth: true,
    });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.json({
        message: "Unauthorized - invalid token",
        status: 0,
        notAuth: true,
      });
    }
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log(error.message);
    return res.json({
      message: "Server Error!",
      error: error.message || error,
      serverError: true,
      status: 0,
    });
  }
};

module.exports = VerifyToken;
