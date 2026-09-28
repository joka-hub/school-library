const express = require("express");
const router = express.Router();
const photoController = require("../controllers/photoController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/albums", photoController.getAlbums);
router.post("/albums", protect, upload.single("cover"), photoController.createAlbum);
router.put("/albums/:id", protect, upload.single("cover"), photoController.updateAlbum);
router.delete("/albums/:id", protect, photoController.deleteAlbum);

router.get("/albums/:id/photos", photoController.getPhotosByAlbum);
router.post("/albums/:id/photos", protect, upload.array("photos", 20), photoController.addPhotos);

router.put("/photos/:id", protect, photoController.updatePhoto);
router.delete("/photos/:id", protect, photoController.deletePhoto);

module.exports = router;
