const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "provide name"] },
    email: {
      type: String,
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
    deletedAccount: {
      type: Boolean,
      default: false,
    },
    lastSeen: Date,
    profile_pic: {
      type: String,
      default: "",
    },
    public_id: { type: String, default: "" },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: { type: Date, default: null },
    isLocked: {
      type: Boolean,
      default: false,
    },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    /*
    --- Two Step Verification attributes
    */

    twoStepVerification: { type: Boolean, default: false },
    cloudPassword: { type: String, default: "" },
    backupEmail: { type: String, default: "" },
    hint: { type: String, default: "" },
    /*
    -- account autentication attributes
    */
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
