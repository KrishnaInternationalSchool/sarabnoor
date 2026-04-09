const mongoose = require("mongoose");

const volunteerApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    interestArea: { type: String, required: true, trim: true },
    message: { type: String, trim: true },
    profilePhoto: { type: String, required: true },
    documents: [
      {
        label: { type: String, required: true },
        fileUrl: { type: String, required: true }
      }
    ],
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending"
    },
    remarks: { type: String, trim: true },
    rejectionReason: { type: String, trim: true },
    verifiedVolunteer: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("VolunteerApplication", volunteerApplicationSchema);
