const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const Campaign = require("../models/Campaign");
const Donation = require("../models/Donation");
const Notification = require("../models/Notification");
const { razorpay } = require("../config/razorpay");
const { validate } = require("../utils/validate");
const {
  createDonationSchema,
  verifyDonationSchema
} = require("../validators/donationValidators");

const createDonationOrder = async (req, res, next) => {
  try {
    const payload = validate(createDonationSchema, req.body);
    const campaign = await Campaign.findById(payload.campaignId);

    if (!campaign) {
      const error = new Error("Campaign not found");
      error.statusCode = 404;
      throw error;
    }

    const receiptId = `receipt_${uuidv4()}`;
    const order = await razorpay.orders.create({
      amount: Math.round(payload.amount * 100),
      currency: "INR",
      receipt: receiptId,
      notes: {
        campaignId: campaign._id.toString(),
        donorId: req.user._id.toString()
      }
    });

    const donation = await Donation.create({
      donor: req.user._id,
      campaign: campaign._id,
      amount: payload.amount,
      receiptId,
      razorpayOrderId: order.id
    });

    res.status(201).json({
      success: true,
      donationId: donation._id,
      order,
      razorpayKey: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    next(error);
  }
};

const verifyDonation = async (req, res, next) => {
  try {
    const payload = validate(verifyDonationSchema, req.body);
    const donation = await Donation.findById(payload.donationId).populate("campaign");

    if (!donation) {
      const error = new Error("Donation not found");
      error.statusCode = 404;
      throw error;
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${payload.razorpayOrderId}|${payload.razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== payload.razorpaySignature) {
      donation.status = "failed";
      await donation.save();
      const error = new Error("Payment signature verification failed");
      error.statusCode = 400;
      throw error;
    }

    donation.status = "paid";
    donation.razorpayPaymentId = payload.razorpayPaymentId;
    donation.razorpaySignature = payload.razorpaySignature;
    await donation.save();

    await Campaign.findByIdAndUpdate(donation.campaign._id, {
      $inc: { raisedAmount: donation.amount }
    });

    await Notification.create({
      user: req.user._id,
      title: "Donation successful",
      message: `Thank you for donating INR ${donation.amount} to ${donation.campaign.title}.`
    });

    res.json({
      success: true,
      message: "Donation verified successfully"
    });
  } catch (error) {
    next(error);
  }
};

const getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .populate("campaign")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      donations
    });
  } catch (error) {
    next(error);
  }
};

const getAllDonations = async (req, res, next) => {
  try {
    const { status, campaignId } = req.query;
    const query = {};

    if (status) query.status = status;
    if (campaignId) query.campaign = campaignId;

    const donations = await Donation.find(query)
      .populate("donor", "name email")
      .populate("campaign", "title")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      donations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDonationOrder,
  verifyDonation,
  getMyDonations,
  getAllDonations
};
