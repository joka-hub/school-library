require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

connectDB();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===== واجهات برمجة التطبيقات (API) =====
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/magazines", require("./routes/magazineRoutes"));
app.use("/api/resources", require("./routes/resourceRoutes"));
app.use("/api/news", require("./routes/newsRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/photos", require("./routes/photoRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/stats", require("./routes/statsRoutes"));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "السيرفر يعمل بنجاح ✅" });
});

// ===== الواجهة الأمامية (الملفات الثابتة) =====
app.use(express.static(path.join(__dirname, "public")));

// أي مسار غير معروف وغير API يرجع لصفحة الواجهة الرئيسية (دعم صفحات متعددة)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/api", notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 السيرفر يعمل على المنفذ ${PORT}`);
});
