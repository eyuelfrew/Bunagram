const jwt = require("jsonwebtoken");

const getUserDetailFromToken = async (token) => {
  try {
    if (!token) {
      return {
        message: "Session out",
        logout: true,
      };
    }
    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = decode.id;
    return user;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

module.exports = getUserDetailFromToken;
