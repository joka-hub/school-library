require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ متصل بقاعدة البيانات");

    const username = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
    const existing = await Admin.findOne({ username });

    if (existing) {
      console.log(`⚠️  الحساب "${username}" موجود بالفعل. لو عايزة تعملي حساب جديد غيّري ADMIN_USERNAME في .env`);
      process.exit(0);
    }

    const admin = await Admin.create({
      name: "المدير الرئيسي",
      username,
      email: process.env.ADMIN_EMAIL || "",
      password: process.env.ADMIN_PASSWORD || "ChangeMe123!",
      role: "owner",
    });

    console.log("✅ تم إنشاء حساب الأدمن بنجاح:");
    console.log(`   اسم المستخدم: ${admin.username}`);
    console.log(`   كلمة المرور: ${process.env.ADMIN_PASSWORD || "ChangeMe123!"}`);
    console.log("   ⚠️  برجاء تسجيل الدخول وتغيير كلمة المرور فورًا من الإعدادات");
    process.exit(0);
  } catch (err) {
    console.error("❌ خطأ:", err.message);
    process.exit(1);
  }
}

seed();
