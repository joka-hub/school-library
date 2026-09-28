const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// يمنع أي عملية إضافة/تعديل/حذف/رفع ملفات إلا بعد التأكد من توكن صالح صادر من السيرفر
async function protect(req, res, next) {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "يجب تسجيل الدخول كأدمن للقيام بهذا الإجراء" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({ success: false, message: "الحساب غير موجود، برجاء تسجيل الدخول مرة أخرى" });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "جلسة الدخول غير صالحة أو منتهية، برجاء تسجيل الدخول مرة أخرى" });
  }
}

module.exports = { protect };
