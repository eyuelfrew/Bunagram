import mongoose from "mongoose";

const connectDB = async () => {
  const mongoURL = process.env.MONGO_URL;

  //check if mongo DB connection string is missing
  if (!mongoURL) {
    return console.log("MongoDB connection string missing !!");
  }

  //connect to mongoDB
  try {
    await mongoose.connect(mongoURL, {});
    console.log("MongoDB Connected!");
  } catch (err) {
    console.log(err);
  }
};
export default connectDB;
