const UserModel = require("../../models/UserModels");

const UserStatus = async (req, res) => {
  try {
    const userStatusCounts = await UserModel.aggregate([
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$deletedAccount", true] },
              "Deleted",
              {
                $cond: [
                  { $eq: ["$isVerified", false] },
                  "Unverified",
                  "Active",
                ],
              },
            ],
          },
          count: { $sum: 1 },
        },
      },
    ]);
    const formattedData = {
      labels: userStatusCounts.map((data) => data._id),
      values: userStatusCounts.map((data) => data.count),
    };
    return res.json(formattedData);
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message || error, status: 0 });
  }
};
module.exports = UserStatus;
