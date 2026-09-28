const express = require("express");
const router = express.Router();
const Magazine = require("../models/Magazine");
const crud = require("../controllers/crudFactory");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const uploadFields = upload.fields([
  { name: "cover", maxCount: 1 },
  { name: "file", maxCount: 1 },
]);

function mapFiles(req, res, next) {
  if (req.files) {
    if (req.files.cover && req.files.cover[0]) {
      req.body.coverUrl = req.files.cover[0].path;
      req.body.coverPublicId = req.files.cover[0].filename;
    }
    if (req.files.file && req.files.file[0]) {
      req.body.fileUrl = req.files.file[0].path;
      req.body.filePublicId = req.files.file[0].filename;
    }
  }
  next();
}

router.get("/", crud.getAll(Magazine, ["featured"]));
router.get("/:id", crud.getOne(Magazine));
router.post("/", protect, uploadFields, mapFiles, crud.create(Magazine));
router.put("/:id", protect, uploadFields, mapFiles, crud.update(Magazine));
router.delete("/:id", protect, crud.remove(Magazine));

module.exports = router;
