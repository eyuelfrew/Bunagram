const { ConversationModel } = require("../../models/ConversationModel");

const ConversationData = async (req, res) => {
  try {
    const conversationCounts = await ConversationModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const formattedData = {
      labels: conversationCounts.map((data) => data._id), // Dates as labels
      values: conversationCounts.map((data) => data.count), // Counts as values
    };
    return res.json(formattedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message || error, status: 0 });
  }
};
module.exports = ConversationData;
