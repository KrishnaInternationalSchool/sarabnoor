const Joi = require("joi");

const updateSchema = Joi.object({
  title: Joi.string().min(3).required(),
  body: Joi.string().min(10).required(),
  image: Joi.string().uri().allow("")
});

module.exports = { updateSchema };
