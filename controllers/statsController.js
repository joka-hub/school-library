const Book = require("../models/Book");
const Magazine = require("../models/Magazine");
const Resource = require("../models/Resource");
const News = require("../models/News");
const Photo = require("../models/Photo");
const Album = require("../models/Album");
const Admin = require("../models/Admin");

// GET /api/stats (أدمن فقط)
async function getStats(req, res, next) {
  try {
    const [books, magazines, resources, news, photos, albums, admins] = await Promise.all([
      Book.countDocuments(),
      Magazine.countDocuments(),
      Resource.countDocuments(),
      News.countDocuments(),
      Photo.countDocuments(),
      Album.countDocuments(),
      Admin.countDocuments(),
    ]);
    res.json({
      success: true,
      data: { books, magazines, resources, news, photos, albums, admins },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats };
