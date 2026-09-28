const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

function signToken(admin) {
  return jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "برجاء إدخال اسم المستخدم وكلمة المرور" });
    }

    const admin = await Admin.findOne({ username: username.trim().toLowerCase() });
    if (!admin) {
      return res.status(401).json({ success: false, message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
    }

    const token = signToken(admin);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      token,
      admin: { id: admin._id, name: admin.name, username: admin.username, role: admin.role },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/logout
function logout(req, res) {
  res.clearCookie("token");
  res.json({ success: true, message: "تم تسجيل الخروج" });
}

// GET /api/auth/me
async function me(req, res) {
  res.json({ success: true, admin: req.admin });
}

// POST /api/auth/admins - إنشاء حساب أدمن جديد (owner فقط)
async function createAdmin(req, res, next) {
  try {
    if (req.admin.role !== "owner") {
      return res.status(403).json({ success: false, message: "فقط المدير الرئيسي يمكنه إضافة حسابات إدارية جديدة" });
    }
    const { name, username, password, email, role } = req.body;
    const admin = await Admin.create({
      name,
      username: (username || "").trim().toLowerCase(),
      password,
      email,
      role: role === "owner" ? "owner" : "editor",
    });
    res.status(201).json({
      success: true,
      message: "تم إنشاء الحساب بنجاح",
      admin: { id: admin._id, name: admin.name, username: admin.username, role: admin.role },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/admins
async function listAdmins(req, res, next) {
  try {
    const admins = await Admin.find().select("-password");
    res.json({ success: true, data: admins });
  } catch (err) {
    next(err);
  }
}

// PUT /api/auth/password - تغيير كلمة المرور للحساب الحالي
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "كلمة المرور الحالية غير صحيحة" });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "كلمة المرور الجديدة يجب ألا تقل عن 6 أحرف" });
    }
    admin.password = newPassword;
    await admin.save();
    res.json({ success: true, message: "تم تغيير كلمة المرور بنجاح" });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, logout, me, createAdmin, listAdmins, changePassword };
