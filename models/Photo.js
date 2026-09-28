const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema(
  {
    album: { type: mongoose.Schema.Types.ObjectId, ref: "Album", required: true },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, default: "" },
    eventDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Photo", photoSchema);
