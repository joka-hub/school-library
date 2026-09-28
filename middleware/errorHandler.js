// يمنع ظهور أخطاء JavaScript الخام للمستخدم، ويسجلها في الكونسول للمطور فقط
function notFound(req, res, next) {
  res.status(404).json({ success: false, message: "المسار المطلوب غير موجود" });
}

function errorHandler(err, req, res, next) {
  console.error("🔴 خطأ في السيرفر:", err.message);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "حدث خطأ غير متوقع في السيرفر";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }
  if (err.name === "CastError") {
    statusCode = 400;
    message = "المعرف المستخدم غير صحيح";
  }
  if (err.code === 11000) {
    statusCode = 400;
    message = "هذا العنصر موجود بالفعل (بيانات مكررة)";
  }
  if (err.message && err.message.includes("غير مسموح")) {
    statusCode = 400;
  }

  res.status(statusCode).json({ success: false, message });
}

module.exports = { notFound, errorHandler };
