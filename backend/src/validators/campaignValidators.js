const Joi = require("joi");

const campaignSchema = Joi.object({
  title: Joi.string().min(3).required(),
  slug: Joi.string().min(3).required(),
  summary: Joi.string().min(10).required(),
  description: Joi.string().min(20).required(),
  goalAmount: Joi.number().min(1).required(),
  coverImage: Joi.string().uri().required(),
  gallery: Joi.array().items(Joi.string().uri()).default([]),
  status: Joi.string().valid("draft", "active", "completed").default("active"),
  featured: Joi.boolean().default(false)
});

module.exports = { campaignSchema };
