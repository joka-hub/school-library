const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    subject: { type: String, default: "" },
    stage: { type: String, default: "" },
    grade: { type: String, default: "" },
    resourceType: {
      type: String,
      enum: [
        "ورقة عمل", "اختبار", "عرض تقديمي", "ملف PDF", "فيديو",
        "نشاط", "رابط تعليمي", "لعبة تعليمية", "أداة ذكاء اصطناعي", "دليل استخدام", "خطة درس", "أخرى",
      ],
      default: "أخرى",
    },
    // تحديد إلى أي ركن ينتمي المورد في الواجهة
    section: {
      type: String,
      enum: ["عام", "ركن المعلم", "ركن الطالب", "الذكاء الاصطناعي والتكنولوجيا", "المعارض الرقمية"],
      default: "عام",
    },
    keywords: [{ type: String }],
    thumbnailUrl: { type: String, default: "" },
    thumbnailPublicId: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
    filePublicId: { type: String, default: "" },
    externalLink: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

resourceSchema.index({ title: "text", description: "text", keywords: "text", subject: "text" });

module.exports = mongoose.model("Resource", resourceSchema);
