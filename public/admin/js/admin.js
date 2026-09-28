// ===== لوحة الإدارة: مصادقة + تبويبات + CRUD عام =====

if (!getToken()) location.href = "/admin/login.html";

// ---------- إعداد كل نوع محتوى: الحقول والأعمدة ونقطة الـ API ----------
const CONTENT_TYPES = {
  books: {
    label: "الكتب الرقمية", api: "/books", icon: "📗",
    columns: [["title", "العنوان"], ["subject", "المادة"], ["grade", "الصف"], ["stage", "المرحلة"]],
    fields: [
      { name: "title", label: "عنوان الكتاب", type: "text", required: true, full: true },
      { name: "author", label: "المؤلف", type: "text" },
      { name: "stage", label: "المرحلة", type: "select", options: ["ابتدائي", "إعدادي", "ثانوي"] },
      { name: "grade", label: "الصف الدراسي", type: "text" },
      { name: "subject", label: "المادة", type: "text" },
      { name: "category", label: "التصنيف", type: "text" },
      { name: "keywords", label: "كلمات مفتاحية (افصلي بفاصلة)", type: "text", full: true },
      { name: "description", label: "الوصف", type: "textarea", full: true },
      { name: "externalLink", label: "رابط خارجي (اختياري)", type: "text", full: true },
      { name: "allowDownload", label: "السماح بالتحميل", type: "checkbox" },
      { name: "featured", label: "عنصر مميز بالرئيسية", type: "checkbox" },
      { name: "cover", label: "صورة الغلاف", type: "file", accept: "image/*" },
      { name: "file", label: "ملف الكتاب (PDF)", type: "file", accept: ".pdf", requiredOnCreate: true },
    ],
  },
  magazines: {
    label: "المجلات الإلكترونية", api: "/magazines", icon: "📰",
    columns: [["title", "العنوان"], ["issueNumber", "العدد"], ["issueDate", "التاريخ", "date"]],
    fields: [
      { name: "title", label: "اسم المجلة", type: "text", required: true, full: true },
      { name: "issueNumber", label: "رقم العدد", type: "text" },
      { name: "issueDate", label: "تاريخ الإصدار", type: "date" },
      { name: "description", label: "الوصف", type: "textarea", full: true },
      { name: "externalLink", label: "رابط خارجي (اختياري)", type: "text", full: true },
      { name: "featured", label: "عنصر مميز بالرئيسية", type: "checkbox" },
      { name: "cover", label: "صورة الغلاف", type: "file", accept: "image/*" },
      { name: "file", label: "ملف المجلة (PDF)", type: "file", accept: ".pdf", requiredOnCreate: true },
    ],
  },
  resources: {
    label: "الموارد التعليمية", api: "/resources", icon: "🧰",
    columns: [["title", "العنوان"], ["resourceType", "النوع"], ["section", "الركن"]],
    fields: [
      { name: "title", label: "العنوان", type: "text", required: true, full: true },
      { name: "resourceType", label: "نوع المورد", type: "select", options: ["ورقة عمل","اختبار","عرض تقديمي","ملف PDF","فيديو","نشاط","رابط تعليمي","لعبة تعليمية","أداة ذكاء اصطناعي","دليل استخدام","خطة درس","أخرى"] },
      { name: "section", label: "الركن", type: "select", options: ["عام","ركن المعلم","ركن الطالب","الذكاء الاصطناعي والتكنولوجيا","المعارض الرقمية"] },
      { name: "subject", label: "المادة", type: "text" },
      { name: "stage", label: "المرحلة", type: "select", options: ["ابتدائي", "إعدادي", "ثانوي"] },
      { name: "grade", label: "الصف", type: "text" },
      { name: "keywords", label: "كلمات مفتاحية (افصلي بفاصلة)", type: "text", full: true },
      { name: "description", label: "الوصف", type: "textarea", full: true },
      { name: "externalLink", label: "رابط خارجي (اختياري)", type: "text", full: true },
      { name: "featured", label: "عنصر مميز بالرئيسية", type: "checkbox" },
      { name: "thumbnail", label: "صورة مصغرة", type: "file", accept: "image/*" },
      { name: "file", label: "الملف (اختياري إن وُجد رابط خارجي)", type: "file" },
    ],
  },
  news: {
    label: "الأخبار والفعاليات", api: "/news", icon: "📅",
    columns: [["title", "العنوان"], ["eventDate", "التاريخ", "date"]],
    fields: [
      { name: "title", label: "عنوان الخبر", type: "text", required: true, full: true },
      { name: "eventDate", label: "تاريخ الفعالية", type: "date" },
      { name: "summary", label: "ملخص مختصر", type: "textarea", full: true },
      { name: "content", label: "المحتوى الكامل", type: "textarea", full: true },
      { name: "featured", label: "عنصر مميز بالرئيسية", type: "checkbox" },
      { name: "cover", label: "صورة الخبر", type: "file", accept: "image/*" },
    ],
  },
};

let STATE = { tab: "dashboard", data: {} };

// ---------- تسجيل الخروج ----------
document.getElementById("logout-btn").addEventListener("click", async () => {
  try { await apiRequest("/auth/logout", { method: "POST" }); } catch {}
  clearToken();
  location.href = "/admin/login.html";
});

// ---------- التبويبات ----------
document.querySelectorAll("[data-tab]").forEach(btn => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

function switchTab(tab) {
  STATE.tab = tab;
  document.querySelectorAll("[data-tab]").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  if (CONTENT_TYPES[tab]) return loadGenericTab(tab);
  if (tab === "dashboard") return loadDashboard();
  if (tab === "photos") return loadPhotosTab();
  if (tab === "categories") return loadCategoriesTab();
  if (tab === "settings") return loadSettingsTab();
  if (tab === "admins") return loadAdminsTab();
}

// ---------- لوحة المعلومات ----------
async function loadDashboard() {
  const el = document.getElementById("tab-content");
  el.innerHTML = `<div class="loading">جاري التحميل...</div>`;
  try {
    const res = await apiRequest("/stats", { auth: true });
    const s = res.data;
    const cards = [
      ["الكتب", s.books, "📗"], ["المجلات", s.magazines, "📰"], ["الموارد", s.resources, "🧰"],
      ["الأخبار", s.news, "📅"], ["الصور", s.photos, "🖼️"], ["الألبومات", s.albums, "📁"],
      ["الحسابات الإدارية", s.admins, "👤"],
    ];
    el.innerHTML = `
      <h3 class="section-title">نظرة عامة</h3>
      <div class="stat-cards">
        ${cards.map(c => `<div class="stat-card"><div class="num">${c[2]} ${c[1]}</div><div class="lbl">${c[0]}</div></div>`).join("")}
      </div>`;
  } catch (err) {
    el.innerHTML = `<div class="empty-state">تعذر تحميل الإحصاءات</div>`;
  }
}

// ---------- تبويب عام لأي نوع محتوى (كتب/مجلات/موارد/أخبار) ----------
async function loadGenericTab(type) {
  const cfg = CONTENT_TYPES[type];
  const el = document.getElementById("tab-content");
  el.innerHTML = `
    <div class="admin-topbar">
      <h3 class="section-title" style="margin:0">${cfg.icon} ${cfg.label}</h3>
      <button class="btn btn-primary" onclick="openGenericForm('${type}')">➕ إضافة جديد</button>
    </div>
    <div id="generic-table"><div class="loading">جاري التحميل...</div></div>`;
  await refreshGenericTable(type);
}

async function refreshGenericTable(type) {
  const cfg = CONTENT_TYPES[type];
  const wrap = document.getElementById("generic-table");
  try {
    const res = await apiRequest(`${cfg.api}?limit=100`, { auth: true });
    STATE.data[type] = res.data;
    if (!res.data.length) {
      wrap.innerHTML = `<div class="empty-state">لا يوجد محتوى بعد، ابدئي بالإضافة</div>`;
      return;
    }
    wrap.innerHTML = `
      <table class="admin-table">
        <thead><tr>${cfg.columns.map(c => `<th>${c[1]}</th>`).join("")}<th>إجراءات</th></tr></thead>
        <tbody>
          ${res.data.map(item => `
            <tr>
              ${cfg.columns.map(c => `<td>${escapeHtml(c[2] === "date" ? formatDate(item[c[0]]) : (item[c[0]] || "—"))}</td>`).join("")}
              <td>
                <button class="btn btn-outline btn-sm" onclick="openGenericForm('${type}','${item._id}')">تعديل</button>
                <button class="btn btn-danger btn-sm" onclick="deleteGeneric('${type}','${item._id}')">حذف</button>
                <a class="btn btn-outline btn-sm" target="_blank" href="/item.html?type=${type}&id=${item._id}">معاينة</a>
              </td>
            </tr>`).join("")}
        </tbody>
      </table>`;
  } catch {
    wrap.innerHTML = `<div class="empty-state">تعذر تحميل البيانات</div>`;
  }
}

function openGenericForm(type, id = null) {
  const cfg = CONTENT_TYPES[type];
  const item = id ? (STATE.data[type] || []).find(x => x._id === id) : null;

  const fieldsHtml = cfg.fields.map(f => {
    const val = item ? (item[f.name] ?? "") : "";
    const full = f.full ? "full" : "";
    if (f.type === "textarea") {
      return `<div class="form-group ${full}"><label>${f.label}</label><textarea name="${f.name}">${escapeHtml(Array.isArray(val) ? val.join(", ") : val)}</textarea></div>`;
    }
    if (f.type === "select") {
      return `<div class="form-group ${full}"><label>${f.label}</label><select name="${f.name}"><option value="">— اختاري —</option>${f.options.map(o => `<option value="${o}" ${val === o ? "selected" : ""}>${o}</option>`).join("")}</select></div>`;
    }
    if (f.type === "checkbox") {
      return `<div class="form-group ${full}"><label><input type="checkbox" name="${f.name}" ${val ? "checked" : ""}> ${f.label}</label></div>`;
    }
    if (f.type === "file") {
      const currentUrl = item ? (item[f.name + "Url"] || item.fileUrl || "") : "";
      return `<div class="form-group ${full}"><label>${f.label}${item && (item[f.name+'Url']||(f.name==='file'&&item.fileUrl)) ? " (يوجد ملف حاليًا، اختاري ملف جديد لاستبداله)" : ""}</label><input type="file" name="${f.name}" accept="${f.accept || ""}" ${!item && f.requiredOnCreate ? "required" : ""}></div>`;
    }
    return `<div class="form-group ${full}"><label>${f.label}</label><input type="${f.type}" name="${f.name}" value="${escapeHtml(Array.isArray(val) ? val.join(", ") : val)}" ${f.required ? "required" : ""}></div>`;
  }).join("");

  showModal(`
    <button class="modal-close" onclick="closeModal()">×</button>
    <h3>${item ? "تعديل" : "إضافة"} ${cfg.label.replace(/^ال/, "")}</h3>
    <form id="generic-form">
      <div class="form-grid">${fieldsHtml}</div>
      <div class="modal-actions">
        <button type="submit" class="btn btn-primary">${item ? "حفظ التعديلات" : "إضافة"}</button>
        <button type="button" class="btn btn-outline" onclick="closeModal()">إلغاء</button>
      </div>
    </form>`);

  document.getElementById("generic-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData();
    cfg.fields.forEach(f => {
      if (f.type === "checkbox") {
        fd.append(f.name, form[f.name].checked ? "true" : "false");
      } else if (f.type === "file") {
        if (form[f.name].files[0]) fd.append(f.name, form[f.name].files[0]);
      } else {
        fd.append(f.name, form[f.name].value);
      }
    });
    try {
      if (item) {
        await apiRequest(`${cfg.api}/${item._id}`, { method: "PUT", body: fd, auth: true });
      } else {
        await apiRequest(cfg.api, { method: "POST", body: fd, auth: true });
      }
      toast("تم الحفظ بنجاح");
      closeModal();
      refreshGenericTable(type);
    } catch (err) {
      toast(err.message, "error");
    }
  });
}

async function deleteGeneric(type, id) {
  if (!confirm("هل أنتِ متأكدة من الحذف؟ لا يمكن التراجع عن هذا الإجراء.")) return;
  try {
    await apiRequest(`${CONTENT_TYPES[type].api}/${id}`, { method: "DELETE", auth: true });
    toast("تم الحذف بنجاح");
    refreshGenericTable(type);
  } catch (err) {
    toast(err.message, "error");
  }
}

// ---------- تبويب الصور والألبومات ----------
async function loadPhotosTab() {
  const el = document.getElementById("tab-content");
  el.innerHTML = `
    <div class="admin-topbar">
      <h3 class="section-title" style="margin:0">🖼️ الصور والألبومات</h3>
      <button class="btn btn-primary" onclick="openAlbumForm()">➕ ألبوم جديد</button>
    </div>
    <div id="albums-table"><div class="loading">جاري التحميل...</div></div>`;
  await refreshAlbumsTable();
}

async function refreshAlbumsTable() {
  const wrap = document.getElementById("albums-table");
  try {
    const res = await apiRequest("/photos/albums", { auth: true });
    STATE.data.albums = res.data;
    if (!res.data.length) { wrap.innerHTML = `<div class="empty-state">لا توجد ألبومات بعد</div>`; return; }
    wrap.innerHTML = `
      <table class="admin-table">
        <thead><tr><th>الألبوم</th><th>التاريخ</th><th>إجراءات</th></tr></thead>
        <tbody>
          ${res.data.map(a => `
            <tr>
              <td>${escapeHtml(a.title)}</td>
              <td>${formatDate(a.eventDate)}</td>
              <td>
                <button class="btn btn-primary btn-sm" onclick="manageAlbumPhotos('${a._id}','${escapeHtml(a.title)}')">إدارة الصور</button>
                <button class="btn btn-outline btn-sm" onclick="openAlbumForm('${a._id}')">تعديل</button>
                <button class="btn btn-danger btn-sm" onclick="deleteAlbum('${a._id}')">حذف</button>
              </td>
            </tr>`).join("")}
        </tbody>
      </table>`;
  } catch {
    wrap.innerHTML = `<div class="empty-state">تعذر تحميل الألبومات</div>`;
  }
}

function openAlbumForm(id = null) {
  const album = id ? (STATE.data.albums || []).find(a => a._id === id) : null;
  showModal(`
    <button class="modal-close" onclick="closeModal()">×</button>
    <h3>${album ? "تعديل الألبوم" : "ألبوم جديد"}</h3>
    <form id="album-form">
      <div class="form-grid">
        <div class="form-group full"><label>اسم الألبوم</label><input name="title" required value="${album ? escapeHtml(album.title) : ""}"></div>
        <div class="form-group"><label>تاريخ الفعالية</label><input type="date" name="eventDate"></div>
        <div class="form-group"><label>صورة الغلاف</label><input type="file" name="cover" accept="image/*"></div>
        <div class="form-group full"><label>الوصف</label><textarea name="description">${album ? escapeHtml(album.description || "") : ""}</textarea></div>
      </div>
      <div class="modal-actions">
        <button type="submit" class="btn btn-primary">${album ? "حفظ" : "إنشاء"}</button>
        <button type="button" class="btn btn-outline" onclick="closeModal()">إلغاء</button>
      </div>
    </form>`);

  document.getElementById("album-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      if (album) await apiRequest(`/photos/albums/${album._id}`, { method: "PUT", body: fd, auth: true });
      else await apiRequest("/photos/albums", { method: "POST", body: fd, auth: true });
      toast("تم الحفظ بنجاح");
      closeModal();
      refreshAlbumsTable();
    } catch (err) { toast(err.message, "error"); }
  });
}

async function deleteAlbum(id) {
  if (!confirm("سيتم حذف الألبوم وكل الصور بداخله. متأكدة؟")) return;
  try {
    await apiRequest(`/photos/albums/${id}`, { method: "DELETE", auth: true });
    toast("تم الحذف");
    refreshAlbumsTable();
  } catch (err) { toast(err.message, "error"); }
}

async function manageAlbumPhotos(albumId, albumTitle) {
  const el = document.getElementById("tab-content");
  el.innerHTML = `
    <div class="admin-topbar">
      <h3 class="section-title" style="margin:0">🖼️ صور ألبوم: ${escapeHtml(albumTitle)}</h3>
      <button class="btn btn-outline" onclick="loadPhotosTab()">⬅ رجوع للألبومات</button>
    </div>
    <form id="upload-photos-form" style="margin-bottom:20px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
      <input type="file" name="photos" accept="image/*" multiple required>
      <button class="btn btn-primary" type="submit">⬆ رفع الصور</button>
    </form>
    <div id="photos-grid" class="gallery-grid"><div class="loading">جاري التحميل...</div></div>`;

  document.getElementById("upload-photos-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await apiRequest(`/photos/albums/${albumId}/photos`, { method: "POST", body: fd, auth: true });
      toast("تم رفع الصور بنجاح");
      e.target.reset();
      loadAlbumPhotosGrid(albumId);
    } catch (err) { toast(err.message, "error"); }
  });

  loadAlbumPhotosGrid(albumId);
}

async function loadAlbumPhotosGrid(albumId) {
  const wrap = document.getElementById("photos-grid");
  try {
    const res = await apiRequest(`/photos/albums/${albumId}/photos`, { auth: true });
    if (!res.data.length) { wrap.innerHTML = `<div class="empty-state">لا توجد صور بعد</div>`; return; }
    wrap.innerHTML = res.data.map(p => `
      <div>
        <div class="gallery-thumb"><img src="${escapeHtml(p.imageUrl)}"></div>
        <button class="btn btn-danger btn-sm btn-block" style="margin-top:6px" onclick="deletePhoto('${p._id}','${albumId}')">حذف</button>
      </div>`).join("");
  } catch { wrap.innerHTML = `<div class="empty-state">تعذر تحميل الصور</div>`; }
}

async function deletePhoto(id, albumId) {
  if (!confirm("حذف هذه الصورة؟")) return;
  try {
    await apiRequest(`/photos/photos/${id}`, { method: "DELETE", auth: true });
    toast("تم الحذف");
    loadAlbumPhotosGrid(albumId);
  } catch (err) { toast(err.message, "error"); }
}

// ---------- تبويب الأقسام/التصنيفات ----------
async function loadCategoriesTab() {
  const el = document.getElementById("tab-content");
  el.innerHTML = `
    <div class="admin-topbar">
      <h3 class="section-title" style="margin:0">🗂️ إدارة الأقسام</h3>
      <button class="btn btn-primary" onclick="openCategoryForm()">➕ قسم جديد</button>
    </div>
    <div id="categories-table"><div class="loading">جاري التحميل...</div></div>`;
  await refreshCategoriesTable();
}

async function refreshCategoriesTable() {
  const wrap = document.getElementById("categories-table");
  try {
    const res = await apiRequest("/categories/all", { auth: true });
    STATE.data.categories = res.data;
    if (!res.data.length) { wrap.innerHTML = `<div class="empty-state">لا توجد أقسام مخصصة بعد (الأقسام الأساسية ظاهرة بالفعل بالرئيسية)</div>`; return; }
    wrap.innerHTML = `
      <table class="admin-table">
        <thead><tr><th>الأيقونة</th><th>الاسم</th><th>الترتيب</th><th>ظاهر</th><th>إجراءات</th></tr></thead>
        <tbody>
          ${res.data.map(c => `
            <tr>
              <td>${c.icon}</td><td>${escapeHtml(c.name)}</td><td>${c.order}</td><td>${c.visible ? "✅" : "❌"}</td>
              <td>
                <button class="btn btn-outline btn-sm" onclick="openCategoryForm('${c._id}')">تعديل</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCategory('${c._id}')">حذف</button>
              </td>
            </tr>`).join("")}
        </tbody>
      </table>`;
  } catch { wrap.innerHTML = `<div class="empty-state">تعذر تحميل الأقسام</div>`; }
}

function openCategoryForm(id = null) {
  const cat = id ? (STATE.data.categories || []).find(c => c._id === id) : null;
  showModal(`
    <button class="modal-close" onclick="closeModal()">×</button>
    <h3>${cat ? "تعديل قسم" : "قسم جديد"}</h3>
    <form id="category-form">
      <div class="form-grid">
        <div class="form-group full"><label>اسم القسم</label><input name="name" required value="${cat ? escapeHtml(cat.name) : ""}"></div>
        <div class="form-group full"><label>المعرف (slug بالإنجليزي بدون مسافات)</label><input name="slug" required value="${cat ? escapeHtml(cat.slug) : ""}"></div>
        <div class="form-group"><label>أيقونة (إيموجي)</label><input name="icon" value="${cat ? cat.icon : "📁"}"></div>
        <div class="form-group"><label>الترتيب</label><input type="number" name="order" value="${cat ? cat.order : 0}"></div>
        <div class="form-group full"><label>الوصف</label><textarea name="description">${cat ? escapeHtml(cat.description || "") : ""}</textarea></div>
        <div class="form-group full"><label><input type="checkbox" name="visible" ${!cat || cat.visible ? "checked" : ""}> ظاهر في الموقع</label></div>
      </div>
      <div class="modal-actions">
        <button type="submit" class="btn btn-primary">${cat ? "حفظ" : "إضافة"}</button>
        <button type="button" class="btn btn-outline" onclick="closeModal()">إلغاء</button>
      </div>
    </form>`);

  document.getElementById("category-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const body = {
      name: form.name.value, slug: form.slug.value, icon: form.icon.value,
      order: Number(form.order.value) || 0, description: form.description.value, visible: form.visible.checked,
    };
    try {
      if (cat) await apiRequest(`/categories/${cat._id}`, { method: "PUT", body, auth: true });
      else await apiRequest("/categories", { method: "POST", body, auth: true });
      toast("تم الحفظ بنجاح");
      closeModal();
      refreshCategoriesTable();
    } catch (err) { toast(err.message, "error"); }
  });
}

async function deleteCategory(id) {
  if (!confirm("حذف هذا القسم؟")) return;
  try {
    await apiRequest(`/categories/${id}`, { method: "DELETE", auth: true });
    toast("تم الحذف");
    refreshCategoriesTable();
  } catch (err) { toast(err.message, "error"); }
}

// ---------- تبويب إعدادات الموقع ----------
async function loadSettingsTab() {
  const el = document.getElementById("tab-content");
  el.innerHTML = `<div class="loading">جاري التحميل...</div>`;
  try {
    const res = await apiRequest("/settings", { auth: true });
    const s = res.data;
    el.innerHTML = `
      <h3 class="section-title">⚙️ إعدادات الموقع</h3>
      <form id="settings-form" style="max-width:720px">
        <div class="form-grid">
          <div class="form-group full"><label>اسم المكتبة (عربي)</label><input name="libraryName" value="${escapeHtml(s.libraryName)}"></div>
          <div class="form-group full"><label>اسم المكتبة (إنجليزي)</label><input name="libraryNameEn" value="${escapeHtml(s.libraryNameEn)}"></div>
          <div class="form-group full"><label>اسم المدرسة</label><input name="schoolName" value="${escapeHtml(s.schoolName)}"></div>
          <div class="form-group full"><label>العنوان الفرعي</label><input name="tagline" value="${escapeHtml(s.tagline)}"></div>
          <div class="form-group full"><label>وصف المكتبة</label><textarea name="description">${escapeHtml(s.description)}</textarea></div>
          <div class="form-group"><label>البريد الإلكتروني</label><input name="email" value="${escapeHtml(s.email)}"></div>
          <div class="form-group"><label>رقم التواصل</label><input name="phone" value="${escapeHtml(s.phone)}"></div>
          <div class="form-group"><label>فيسبوك</label><input name="facebook" value="${escapeHtml(s.facebook)}"></div>
          <div class="form-group"><label>يوتيوب</label><input name="youtube" value="${escapeHtml(s.youtube)}"></div>
          <div class="form-group"><label>انستجرام</label><input name="instagram" value="${escapeHtml(s.instagram)}"></div>
          <div class="form-group"><label>اللون الأساسي</label><input type="color" name="primaryColor" value="${s.primaryColor}"></div>
          <div class="form-group"><label>شعار المدرسة (صورة)</label><input type="file" name="logo" accept="image/*"></div>
          <div class="form-group"><label>صورة الغلاف الرئيسية</label><input type="file" name="coverImage" accept="image/*"></div>
        </div>
        <div class="modal-actions"><button class="btn btn-primary" type="submit">💾 حفظ الإعدادات</button></div>
      </form>
      <hr style="margin:30px 0;border-color:var(--border)">
      <h3 class="section-title">🔑 تغيير كلمة المرور</h3>
      <form id="password-form" style="max-width:400px">
        <div class="form-group" style="margin-bottom:10px"><label>كلمة المرور الحالية</label><input type="password" name="currentPassword" required></div>
        <div class="form-group" style="margin-bottom:14px"><label>كلمة المرور الجديدة</label><input type="password" name="newPassword" required minlength="6"></div>
        <button class="btn btn-primary" type="submit">تغيير كلمة المرور</button>
      </form>`;

    document.getElementById("settings-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      try {
        await apiRequest("/settings", { method: "PUT", body: fd, auth: true });
        toast("تم حفظ الإعدادات بنجاح");
      } catch (err) { toast(err.message, "error"); }
    });

    document.getElementById("password-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      try {
        await apiRequest("/auth/password", {
          method: "PUT",
          body: { currentPassword: fd.get("currentPassword"), newPassword: fd.get("newPassword") },
          auth: true,
        });
        toast("تم تغيير كلمة المرور بنجاح");
        e.target.reset();
      } catch (err) { toast(err.message, "error"); }
    });
  } catch {
    el.innerHTML = `<div class="empty-state">تعذر تحميل الإعدادات</div>`;
  }
}

// ---------- تبويب الحسابات الإدارية ----------
async function loadAdminsTab() {
  const el = document.getElementById("tab-content");
  el.innerHTML = `<div class="loading">جاري التحميل...</div>`;
  try {
    const res = await apiRequest("/auth/admins", { auth: true });
    el.innerHTML = `
      <div class="admin-topbar">
        <h3 class="section-title" style="margin:0">👤 الحسابات الإدارية</h3>
        <button class="btn btn-primary" onclick="openAdminForm()">➕ حساب جديد</button>
      </div>
      <table class="admin-table">
        <thead><tr><th>الاسم</th><th>اسم المستخدم</th><th>الصلاحية</th></tr></thead>
        <tbody>
          ${res.data.map(a => `<tr><td>${escapeHtml(a.name)}</td><td>${escapeHtml(a.username)}</td><td>${a.role === "owner" ? "مدير رئيسي" : "محرر"}</td></tr>`).join("")}
        </tbody>
      </table>
      <p style="margin-top:14px;font-size:13px;color:var(--text-muted)">ملاحظة: إضافة حسابات جديدة متاحة فقط للمدير الرئيسي (Owner).</p>`;
  } catch {
    el.innerHTML = `<div class="empty-state">تعذر تحميل الحسابات</div>`;
  }
}

function openAdminForm() {
  showModal(`
    <button class="modal-close" onclick="closeModal()">×</button>
    <h3>حساب إداري جديد</h3>
    <form id="admin-form">
      <div class="form-grid">
        <div class="form-group full"><label>الاسم</label><input name="name" required></div>
        <div class="form-group"><label>اسم المستخدم</label><input name="username" required></div>
        <div class="form-group"><label>كلمة المرور</label><input type="password" name="password" required minlength="6"></div>
        <div class="form-group full"><label>الصلاحية</label>
          <select name="role"><option value="editor">محرر (إضافة وتعديل المحتوى)</option><option value="owner">مدير رئيسي (كل الصلاحيات)</option></select>
        </div>
      </div>
      <div class="modal-actions">
        <button type="submit" class="btn btn-primary">إنشاء الحساب</button>
        <button type="button" class="btn btn-outline" onclick="closeModal()">إلغاء</button>
      </div>
    </form>`);

  document.getElementById("admin-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await apiRequest("/auth/admins", {
        method: "POST",
        body: { name: fd.get("name"), username: fd.get("username"), password: fd.get("password"), role: fd.get("role") },
        auth: true,
      });
      toast("تم إنشاء الحساب بنجاح");
      closeModal();
      loadAdminsTab();
    } catch (err) { toast(err.message, "error"); }
  });
}

// ---------- Modal مشترك ----------
function showModal(html) {
  document.getElementById("modal-box").innerHTML = html;
  document.getElementById("modal-overlay").classList.add("open");
}
function closeModal() {
  document.getElementById("modal-overlay").classList.remove("open");
}
document.getElementById("modal-overlay").addEventListener("click", (e) => {
  if (e.target.id === "modal-overlay") closeModal();
});

// ---------- تشغيل أولي: التأكد من صلاحية الدخول ----------
(async () => {
  try {
    const res = await apiRequest("/auth/me", { auth: true });
    document.getElementById("admin-name").textContent = res.admin.name || res.admin.username;
    setAdmin(res.admin);
    loadDashboard();
  } catch (err) {
    clearToken();
    location.href = "/admin/login.html";
  }
})();
