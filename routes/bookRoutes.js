const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const crud = require("../controllers/crudFactory");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const uploadFields = upload.fields([
  { name: "cover", maxCount: 1 },
  { name: "file", maxCount: 1 },
]);

// يحوّل الملفات المرفوعة إلى حقول جاهزة داخل req.body قبل الحفظ في قاعدة البيانات
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
  if (req.body.keywords && typeof req.body.keywords === "string") {
    req.body.keywords = req.body.keywords.split(",").map((k) => k.trim()).filter(Boolean);
  }
  next();
}

router.get("/", crud.getAll(Book, ["stage", "grade", "subject", "category", "featured"]));
router.get("/:id", crud.getOne(Book));
router.post("/", protect, uploadFields, mapFiles, crud.create(Book));
router.put("/:id", protect, uploadFields, mapFiles, crud.update(Book));
router.delete("/:id", protect, crud.remove(Book));

module.exports = router;
