const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    libraryName: { type: String, default: "المكتبة الرقمية لمدرسة قومية العجوزة" },
    libraryNameEn: { type: String, default: "School Digital Library" },
    schoolName: { type: String, default: "المدرسة القومية بالعجوزة" },
    tagline: { type: String, default: "بوابتنا الرقمية للمعرفة والإبداع والتعلم الآمن" },
    description: { type: String, default: "مصادر تعليمية، مجلات إلكترونية، كتب، صور ومواد رقمية في مكان واحد." },
    logoUrl: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    facebook: { type: String, default: "" },
    youtube: { type: String, default: "" },
    instagram: { type: String, default: "" },
    primaryColor: { type: String, default: "#0d7a6c" },
    secondaryColor: { type: String, default: "#f2994a" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
