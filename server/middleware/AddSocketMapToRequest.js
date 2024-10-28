const AddSocketMapToRequest = (userSocketMap) => {
  return (req, res, next) => {
    req.userSocketMap = userSocketMap;
    next();
  };
};

module.exports = AddSocketMapToRequest;
