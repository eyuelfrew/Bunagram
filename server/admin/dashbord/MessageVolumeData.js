const { MessageModel } = require("../../models/ConversationModel");

const MessageVolumeData = async (req, res) => {
  const days = parseInt(req.query.day) || 30;
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  console.log(startDate);
  console.log(endDate);

  try {
    const messageVolume = await MessageModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    console.log(messageVolume);
    const formattedData = {
      labels: messageVolume.map((data) => data._id),
      values: messageVolume.map((data) => data.count),
    };
    return res.json({ data: formattedData, status: 1 });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message || error, status: 0 });
  }
};
module.exports = MessageVolumeData;
