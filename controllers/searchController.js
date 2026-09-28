const Book = require("../models/Book");
const Magazine = require("../models/Magazine");
const Resource = require("../models/Resource");
const News = require("../models/News");

// GET /api/search?q=...
async function search(req, res, next) {
  try {
    const q = (req.query.q || "").trim();
    if (!q) {
      return res.json({ success: true, data: { books: [], magazines: [], resources: [], news: [] } });
    }

    const textFilter = { $text: { $search: q } };
    const scoreSort = { score: { $meta: "textScore" } };

    const [books, magazines, resources, news] = await Promise.all([
      Book.find(textFilter, { score: { $meta: "textScore" } }).sort(scoreSort).limit(20),
      Magazine.find(textFilter, { score: { $meta: "textScore" } }).sort(scoreSort).limit(20),
      Resource.find(textFilter, { score: { $meta: "textScore" } }).sort(scoreSort).limit(20),
      News.find(textFilter, { score: { $meta: "textScore" } }).sort(scoreSort).limit(20),
    ]);

    res.json({
      success: true,
      data: { books, magazines, resources, news },
      total: books.length + magazines.length + resources.length + news.length,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { search };
