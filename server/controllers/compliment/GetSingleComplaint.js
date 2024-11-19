const ComplientModel = require("../../models/ComplimentModel.js");

const SingleComplient = async (req, res) => {
  const { id } = req.params;
  const _id = id.toString();
  try {
    const compliment = await ComplientModel.findById(_id);
    console.log(compliment);
    if (!compliment) {
      return res
        .status(404)
        .json({ message: "Compliment not found", status: 0 });
    }
    return res.status(200).json(compliment);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error retrieving compliment", error });
  }
};
module.exports = SingleComplient;
