const mongoose = require("mongoose");
const complimentSchema = new mongoose.Schema({
  name: { type: String, defult: null },
  phoneNumber: { type: String, default: null },
  email: { type: String, required: true },
  complaintText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const ComplientModel = mongoose.model("Compliment", complimentSchema);

module.exports = ComplientModel;
