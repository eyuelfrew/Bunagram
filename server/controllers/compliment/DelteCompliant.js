const ComplientModel = require("../../models/ComplimentModel.js");

const DeleteCompliant = async (req, res) => {
  const { id } = req.params;
  try {
    const compliant = await ComplientModel.findByIdAndDelete(id);
    if (!compliant) {
      return res.status(404).json({ message: "Data not found", status: 0 });
    }
    return res.status(200).json({ message: "Deleted Sucessfuly!" });
  } catch (error) {
    return res.status(500).json({ message: error.message || error, status: 0 });
  }
};
module.exports = DeleteCompliant;
