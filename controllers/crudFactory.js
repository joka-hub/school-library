// دوال عامة تُستخدم لبناء الـ Controllers الخاصة بكل نوع محتوى (كتب - مجلات - موارد - أخبار)
// دون تكرار نفس الكود، مع الحفاظ على فلاتر وبحث وترقيم صفحات حقيقي لكل نوع

const RESERVED_QUERY_KEYS = ["q", "page", "limit", "sort"];

function buildFilter(query, allowedFilters) {
  const filter = {};
  for (const key of allowedFilters) {
    if (query[key] !== undefined && query[key] !== "") {
      filter[key] = query[key];
    }
  }
  if (query.q && query.q.trim() !== "") {
    filter.$text = { $search: query.q.trim() };
  }
  return filter;
}

function getAll(Model, allowedFilters = []) {
  return async (req, res, next) => {
    try {
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const limit = Math.min(parseInt(req.query.limit) || 12, 50);
      const skip = (page - 1) * limit;

      const filter = buildFilter(req.query, allowedFilters);

      const total = await Model.countDocuments(filter);
      const items = await Model.find(filter)
        .sort(req.query.q ? { score: { $meta: "textScore" } } : { featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);

      res.json({
        success: true,
        data: items,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
      });
    } catch (err) {
      next(err);
    }
  };
}

function getOne(Model) {
  return async (req, res, next) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: "العنصر غير موجود" });
      }
      // زيادة عدد المشاهدات إذا كان الحقل موجودًا في هذا النموذج
      if (item.views !== undefined) {
        item.views += 1;
        await item.save();
      }
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  };
}

function create(Model) {
  return async (req, res, next) => {
    try {
      const item = await Model.create(req.body);
      res.status(201).json({ success: true, data: item, message: "تمت الإضافة بنجاح" });
    } catch (err) {
      next(err);
    }
  };
}

function update(Model) {
  return async (req, res, next) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) {
        return res.status(404).json({ success: false, message: "العنصر غير موجود" });
      }
      res.json({ success: true, data: item, message: "تم التعديل بنجاح" });
    } catch (err) {
      next(err);
    }
  };
}

function remove(Model) {
  return async (req, res, next) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: "العنصر غير موجود" });
      }
      res.json({ success: true, message: "تم الحذف بنجاح" });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { getAll, getOne, create, update, remove };
