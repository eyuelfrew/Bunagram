import mongoose, { mongo } from "mongoose";
const useSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "provied name"] },
    email: {
      type: String,
      required: [true, "provied email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "provide password"],
    },
    profile_pic: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
const UserModel = mongoose.model("User", useSchema);

export default UserModel;
