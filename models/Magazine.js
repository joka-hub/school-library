const mongoose = require("mongoose");

const magazineSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issueNumber: { type: String, default: "" },
    issueDate: { type: Date, default: Date.now },
    description: { type: String, default: "" },
    coverUrl: { type: String, default: "" },
    coverPublicId: { type: String, default: "" },
    fileUrl: { type: String, required: true },
    filePublicId: { type: String, default: "" },
    externalLink: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

magazineSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Magazine", magazineSchema);
