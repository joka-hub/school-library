const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    summary: { type: String, default: "" },
    content: { type: String, default: "" },
    coverUrl: { type: String, default: "" },
    coverPublicId: { type: String, default: "" },
    gallery: [{ url: String, publicId: String }],
    eventDate: { type: Date, default: Date.now },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

newsSchema.index({ title: "text", summary: "text", content: "text" });

module.exports = mongoose.model("News", newsSchema);
