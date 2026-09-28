const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, default: "", trim: true },
    stage: { type: String, default: "" }, // المرحلة: ابتدائي/إعدادي/ثانوي
    grade: { type: String, default: "" }, // الصف الدراسي
    subject: { type: String, default: "" }, // المادة
    category: { type: String, default: "" }, // التصنيف
    description: { type: String, default: "" },
    keywords: [{ type: String }],
    coverUrl: { type: String, default: "" },
    coverPublicId: { type: String, default: "" },
    fileUrl: { type: String, required: true },
    filePublicId: { type: String, default: "" },
    externalLink: { type: String, default: "" },
    allowDownload: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

bookSchema.index({ title: "text", author: "text", description: "text", keywords: "text", subject: "text" });

module.exports = mongoose.model("Book", bookSchema);
