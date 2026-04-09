const Joi = require("joi");

const volunteerSchema = Joi.object({
  interestArea: Joi.string().min(3).required(),
  message: Joi.string().allow("").max(1000)
});

const volunteerReviewSchema = Joi.object({
  status: Joi.string().valid("verified", "rejected").required(),
  remarks: Joi.string().allow(""),
  rejectionReason: Joi.when("status", {
    is: "rejected",
    then: Joi.string().required(),
    otherwise: Joi.string().allow("")
  }),
  verifiedVolunteer: Joi.boolean().default(false)
});

module.exports = { volunteerSchema, volunteerReviewSchema };
