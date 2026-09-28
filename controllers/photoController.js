const Album = require("../models/Album");
const Photo = require("../models/Photo");
const cloudinary = require("../config/cloudinary");

// GET /api/albums
async function getAlbums(req, res, next) {
  try {
    const albums = await Album.find().sort({ createdAt: -1 });
    res.json({ success: true, data: albums });
  } catch (err) {
    next(err);
  }
}

// POST /api/albums (أدمن)
async function createAlbum(req, res, next) {
  try {
    const { title, description, eventDate } = req.body;
    let coverUrl = "";
    if (req.file) coverUrl = req.file.path;
    const album = await Album.create({ title, description, eventDate, coverUrl });
    res.status(201).json({ success: true, data: album, message: "تم إنشاء الألبوم بنجاح" });
  } catch (err) {
    next(err);
  }
}

// PUT /api/albums/:id (أدمن)
async function updateAlbum(req, res, next) {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.coverUrl = req.file.path;
    const album = await Album.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!album) return res.status(404).json({ success: false, message: "الألبوم غير موجود" });
    res.json({ success: true, data: album, message: "تم التعديل بنجاح" });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/albums/:id (أدمن) - يحذف الألبوم وكل الصور بداخله
async function deleteAlbum(req, res, next) {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);
    if (!album) return res.status(404).json({ success: false, message: "الألبوم غير موجود" });
    const photos = await Photo.find({ album: req.params.id });
    await Promise.all(
      photos.map((p) => (p.imagePublicId ? cloudinary.uploader.destroy(p.imagePublicId).catch(() => {}) : null))
    );
    await Photo.deleteMany({ album: req.params.id });
    res.json({ success: true, message: "تم حذف الألبوم وكل الصور بداخله" });
  } catch (err) {
    next(err);
  }
}

// GET /api/albums/:id/photos
async function getPhotosByAlbum(req, res, next) {
  try {
    const photos = await Photo.find({ album: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: photos });
  } catch (err) {
    next(err);
  }
}

// POST /api/albums/:id/photos (أدمن) - رفع صور متعددة دفعة واحدة
async function addPhotos(req, res, next) {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ success: false, message: "الألبوم غير موجود" });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "برجاء اختيار صورة واحدة على الأقل" });
    }

    const photos = await Promise.all(
      req.files.map((file) =>
        Photo.create({
          album: album._id,
          title: req.body.title || "",
          description: req.body.description || "",
          imageUrl: file.path,
          imagePublicId: file.filename,
        })
      )
    );

    if (!album.coverUrl && photos[0]) {
      album.coverUrl = photos[0].imageUrl;
      await album.save();
    }

    res.status(201).json({ success: true, data: photos, message: `تم رفع ${photos.length} صورة بنجاح` });
  } catch (err) {
    next(err);
  }
}

// PUT /api/photos/:id (أدمن)
async function updatePhoto(req, res, next) {
  try {
    const photo = await Photo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!photo) return res.status(404).json({ success: false, message: "الصورة غير موجودة" });
    res.json({ success: true, data: photo, message: "تم التعديل بنجاح" });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/photos/:id (أدمن)
async function deletePhoto(req, res, next) {
  try {
    const photo = await Photo.findByIdAndDelete(req.params.id);
    if (!photo) return res.status(404).json({ success: false, message: "الصورة غير موجودة" });
    if (photo.imagePublicId) {
      await cloudinary.uploader.destroy(photo.imagePublicId).catch(() => {});
    }
    res.json({ success: true, message: "تم حذف الصورة بنجاح" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAlbums, createAlbum, updateAlbum, deleteAlbum,
  getPhotosByAlbum, addPhotos, updatePhoto, deletePhoto,
};
