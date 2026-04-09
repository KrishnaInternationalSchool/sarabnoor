const Update = require("../models/Update");
const { validate } = require("../utils/validate");
const { updateSchema } = require("../validators/updateValidators");

const getUpdates = async (_req, res, next) => {
  try {
    const updates = await Update.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, updates });
  } catch (error) {
    next(error);
  }
};

const createUpdate = async (req, res, next) => {
  try {
    const payload = validate(updateSchema, req.body);
    const update = await Update.create({
      ...payload,
      author: req.user._id
    });

    res.status(201).json({ success: true, update });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUpdates, createUpdate };
