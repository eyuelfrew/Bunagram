const mongoose = require("mongoose");

const adminModel = new mongoose.Schema(
  {
    name: { type: String, required: [true, "provide name"] },
    email: {
      type: String,
      unique: true,
    },

    password: {
      type: String,
      required: [true, "provide password"],
    },

    lastLogin: {
      type: Date,
      default: Date.now,
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

    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const AdminModel = mongoose.model("Admin", adminModel);

module.exports = AdminModel;
