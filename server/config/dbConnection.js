const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoURL = process.env.MONGO_URL;

  // Check if MongoDB connection string is missing
  if (!mongoURL) {
    return console.log("MongoDB connection string missing !!");
  }

  // Connect to MongoDB
  try {
    await mongoose.connect(mongoURL, {});
    console.log("MongoDB Connected!");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
