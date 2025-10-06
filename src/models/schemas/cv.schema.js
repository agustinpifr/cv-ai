const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    pdfBuffer: { type: Buffer, required: true },
    templateName: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = cvSchema;