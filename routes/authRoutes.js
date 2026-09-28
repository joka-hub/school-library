const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", protect, authController.me);
router.post("/admins", protect, authController.createAdmin);
router.get("/admins", protect, authController.listAdmins);
router.put("/password", protect, authController.changePassword);

module.exports = router;
