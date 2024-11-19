const ComplientModel = require("../../models/ComplimentModel");

const GetAllComplaint = async (_, res) => {
  try {
    const compliments = await ComplientModel.find();
    return res.status(200).json(compliments);
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message || error, status: 0 });
  }
};
module.exports = GetAllComplaint;
