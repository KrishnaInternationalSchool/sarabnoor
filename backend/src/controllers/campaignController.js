const Campaign = require("../models/Campaign");
const { validate } = require("../utils/validate");
const { campaignSchema } = require("../validators/campaignValidators");

const getCampaigns = async (req, res, next) => {
  try {
    const query = req.user?.role === "admin" ? {} : { status: { $ne: "draft" } };
    const campaigns = await Campaign.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      campaigns
    });
  } catch (error) {
    next(error);
  }
};

const getCampaignBySlug = async (req, res, next) => {
  try {
    const campaign = await Campaign.findOne({ slug: req.params.slug });

    if (!campaign) {
      const error = new Error("Campaign not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({ success: true, campaign });
  } catch (error) {
    next(error);
  }
};

const createCampaign = async (req, res, next) => {
  try {
    const payload = validate(campaignSchema, req.body);
    const campaign = await Campaign.create(payload);

    res.status(201).json({
      success: true,
      campaign
    });
  } catch (error) {
    next(error);
  }
};

const updateCampaign = async (req, res, next) => {
  try {
    const payload = validate(campaignSchema, req.body);
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    if (!campaign) {
      const error = new Error("Campaign not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({ success: true, campaign });
  } catch (error) {
    next(error);
  }
};

const deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);

    if (!campaign) {
      const error = new Error("Campaign not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({ success: true, message: "Campaign deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCampaigns,
  getCampaignBySlug,
  createCampaign,
  updateCampaign,
  deleteCampaign
};
