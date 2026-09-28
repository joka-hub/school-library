const express = require("express");
const router = express.Router();
const News = require("../models/News");
const crud = require("../controllers/crudFactory");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const uploadFields = upload.fields([
  { name: "cover", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
]);

function mapFiles(req, res, next) {
  if (req.files) {
    if (req.files.cover && req.files.cover[0]) {
      req.body.coverUrl = req.files.cover[0].path;
      req.body.coverPublicId = req.files.cover[0].filename;
    }
    if (req.files.gallery && req.files.gallery.length > 0) {
      req.body.gallery = req.files.gallery.map((f) => ({ url: f.path, publicId: f.filename }));
    }
  }
  next();
}

router.get("/", crud.getAll(News, ["featured"]));
router.get("/:id", crud.getOne(News));
router.post("/", protect, uploadFields, mapFiles, crud.create(News));
router.put("/:id", protect, uploadFields, mapFiles, crud.update(News));
router.delete("/:id", protect, crud.remove(News));

module.exports = router;
