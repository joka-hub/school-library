const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const ALLOWED_EXT = [
  "jpg", "jpeg", "png", "webp", "gif",
  "pdf", "mp4", "mov",
  "ppt", "pptx", "doc", "docx",
];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = file.originalname.split(".").pop().toLowerCase();
    return {
      folder: "school-digital-library",
      resource_type: "auto", // يسمح بالصور والفيديو وملفات PDF والمستندات
      public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`.replace(/[^a-zA-Z0-9-_]/g, "_"),
      format: ext === "jpg" ? "jpg" : undefined,
    };
  },
});

function fileFilter(req, file, cb) {
  const ext = file.originalname.split(".").pop().toLowerCase();
  if (ALLOWED_EXT.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`نوع الملف غير مسموح به: .${ext}`));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB لكل ملف
});

module.exports = upload;
