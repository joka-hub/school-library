const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    eventDate: { type: Date, default: Date.now },
    coverUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Album", albumSchema);
