const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const crud = require("../controllers/crudFactory");
const { protect } = require("../middleware/auth");

router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.find({ visible: true }).sort({ order: 1, name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
});
router.get("/all", protect, async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
});
router.post("/", protect, crud.create(Category));
router.put("/:id", protect, crud.update(Category));
router.delete("/:id", protect, crud.remove(Category));

module.exports = router;
