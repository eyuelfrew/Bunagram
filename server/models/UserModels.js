import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "provied name"] },
    email: {
      type: String,
      required: [true, "provied email"],
      unique: true,
    },
    user_name: {
      type: String,
      unique: true,
      default: null,
      required: false,
    },
    password: {
      type: String,
      required: [true, "provide password"],
    },
    bio: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    profile_pic: {
      type: String,
      default: "",
    },
    lastLogin: {
      type: Date,
      defualt: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  {
    timestamps: true,
  }
);
const UserModel = mongoose.model("User", userSchema);

export default UserModel;
