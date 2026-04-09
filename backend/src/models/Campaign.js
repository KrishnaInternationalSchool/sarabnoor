const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    summary: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    goalAmount: { type: Number, required: true, min: 0 },
    raisedAmount: { type: Number, default: 0 },
    coverImage: { type: String, required: true },
    gallery: [{ type: String }],
    status: {
      type: String,
      enum: ["draft", "active", "completed"],
      default: "active"
    },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);
