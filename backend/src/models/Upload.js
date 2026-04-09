const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    filename: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Upload", uploadSchema);
