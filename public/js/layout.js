// يبني الهيدر والفوتر في كل صفحات الموقع العام (ليس صفحات الإدارة) بناءً على الإعدادات المحفوظة في قاعدة البيانات

async function renderLayout() {
  let settings = {};
  try {
    const res = await apiRequest("/settings");
    settings = res.data || {};
  } catch {
    settings = {};
  }

  const headerEl = document.getElementById("site-header");
  const footerEl = document.getElementById("site-footer");

  if (headerEl) {
    headerEl.innerHTML = `
      <div class="container row">
        <a href="/index.html" class="brand">
          ${settings.logoUrl
            ? `<img src="${escapeHtml(settings.logoUrl)}" class="logo" alt="شعار المدرسة">`
            : `<div class="logo-fallback">📚</div>`}
          <div class="brand-text">
            <h1>${escapeHtml(settings.libraryName || "المكتبة الرقمية")}</h1>
            <span>${escapeHtml(settings.schoolName || "")}</span>
          </div>
        </a>
        <nav class="main-nav">
          <a href="/index.html">الرئيسية</a>
          <a href="/section.html?type=books">الكتب</a>
          <a href="/section.html?type=magazines">المجلات</a>
          <a href="/section.html?type=resources">الموارد</a>
          <a href="/photos.html">الصور</a>
          <a href="/section.html?type=news">الأخبار</a>
          <a href="/search.html">🔍 بحث</a>
          <a href="/admin/login.html" class="btn-admin">لوحة الإدارة</a>
        </nav>
      </div>`;
  }

  if (footerEl) {
    footerEl.innerHTML = `
      <div class="container">
        <p>${escapeHtml(settings.libraryName || "المكتبة الرقمية")} — ${escapeHtml(settings.schoolName || "")}</p>
        ${settings.email ? `<p>${escapeHtml(settings.email)} ${settings.phone ? " | " + escapeHtml(settings.phone) : ""}</p>` : ""}
        <p>© ${new Date().getFullYear()} جميع الحقوق محفوظة</p>
      </div>`;
  }

  return settings;
}
