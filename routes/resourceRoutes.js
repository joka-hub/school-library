const express = require("express");
const router = express.Router();
const Resource = require("../models/Resource");
const crud = require("../controllers/crudFactory");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const uploadFields = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "file", maxCount: 1 },
]);

function mapFiles(req, res, next) {
  if (req.files) {
    if (req.files.thumbnail && req.files.thumbnail[0]) {
      req.body.thumbnailUrl = req.files.thumbnail[0].path;
      req.body.thumbnailPublicId = req.files.thumbnail[0].filename;
    }
    if (req.files.file && req.files.file[0]) {
      req.body.fileUrl = req.files.file[0].path;
      req.body.filePublicId = req.files.file[0].filename;
    }
  }
  if (req.body.keywords && typeof req.body.keywords === "string") {
    req.body.keywords = req.body.keywords.split(",").map((k) => k.trim()).filter(Boolean);
  }
  next();
}

router.get("/", crud.getAll(Resource, ["subject", "stage", "grade", "resourceType", "section", "featured"]));
router.get("/:id", crud.getOne(Resource));
router.post("/", protect, uploadFields, mapFiles, crud.create(Resource));
router.put("/:id", protect, uploadFields, mapFiles, crud.update(Resource));
router.delete("/:id", protect, crud.remove(Resource));

module.exports = router;
