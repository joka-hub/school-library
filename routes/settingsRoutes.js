const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const uploadFields = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);

function mapFiles(req, res, next) {
  if (req.files) {
    if (req.files.logo && req.files.logo[0]) req.body.logoUrl = req.files.logo[0].path;
    if (req.files.coverImage && req.files.coverImage[0]) req.body.coverImageUrl = req.files.coverImage[0].path;
  }
  next();
}

router.get("/", settingsController.getSettings);
router.put("/", protect, uploadFields, mapFiles, settingsController.updateSettings);

module.exports = router;
