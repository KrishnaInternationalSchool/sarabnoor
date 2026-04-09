const Campaign = require("../models/Campaign");
const Donation = require("../models/Donation");
const VolunteerApplication = require("../models/VolunteerApplication");

const getAdminDashboard = async (_req, res, next) => {
  try {
    const [donations, volunteers, activeCampaigns] = await Promise.all([
      Donation.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      VolunteerApplication.countDocuments(),
      Campaign.countDocuments({ status: "active" })
    ]);

    res.json({
      success: true,
      stats: {
        totalDonations: donations[0]?.total || 0,
        totalVolunteers: volunteers,
        activeCampaigns
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminDashboard };
