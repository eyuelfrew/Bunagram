// middleware/addSocketMapToRequest.js

const AddSocketMapToRequest = (userSocketMap) => {
  return (req, res, next) => {
    req.userSocketMap = userSocketMap; // Attach the socket map to req
    next(); // Move to the next middleware/route handler
  };
};

module.exports = AddSocketMapToRequest;
