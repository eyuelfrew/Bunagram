const ComplientModel = require("../../models/ComplimentModel.js");

const CreateComplaint = async (req, res) => {
  const { name, phoneNumber, email, complaintText } = req.body;
  try {
    const compliment = new ComplientModel({
      name,
      phoneNumber,
      email,
      complaintText,
    });
    await compliment.save();
    return res.status(200).json({ message: "Complient Sent!", status: 1 });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message || error, status: 0 });
  }
};
module.exports = CreateComplaint;
