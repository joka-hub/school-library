const Settings = require("../models/Settings");

// GET /api/settings (عام)
async function getSettings(req, res, next) {
  try {
    let settings = await Settings.findOne({ key: "main" });
    if (!settings) {
      settings = await Settings.create({ key: "main" });
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
}

// PUT /api/settings (أدمن فقط)
async function updateSettings(req, res, next) {
  try {
    const settings = await Settings.findOneAndUpdate({ key: "main" }, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    res.json({ success: true, data: settings, message: "تم تحديث الإعدادات بنجاح" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSettings, updateSettings };
