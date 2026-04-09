const Joi = require("joi");

const createDonationSchema = Joi.object({
  campaignId: Joi.string().required(),
  amount: Joi.number().min(1).required()
});

const verifyDonationSchema = Joi.object({
  donationId: Joi.string().required(),
  razorpayOrderId: Joi.string().required(),
  razorpayPaymentId: Joi.string().required(),
  razorpaySignature: Joi.string().required()
});

module.exports = { createDonationSchema, verifyDonationSchema };
