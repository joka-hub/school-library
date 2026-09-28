// ===== أدوات مشتركة تُستخدم في كل صفحات الموقع =====

const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("sdl_token") || "";
}
function setToken(token) {
  localStorage.setItem("sdl_token", token);
}
function clearToken() {
  localStorage.removeItem("sdl_token");
  localStorage.removeItem("sdl_admin");
}
function getAdmin() {
  try { return JSON.parse(localStorage.getItem("sdl_admin") || "null"); } catch { return null; }
}
function setAdmin(admin) {
  localStorage.setItem("sdl_admin", JSON.stringify(admin));
}

// نداء عام للـ API. body لو كان FormData يُرسل كما هو (لرفع الملفات)، غير ذلك يُرسل كـ JSON
async function apiRequest(path, { method = "GET", body = null, auth = false } = {}) {
  const headers = {};
  let payload = body;

  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  if (auth && getToken()) {
    headers["Authorization"] = `Bearer ${getToken()}`;
  }

  let res, data;
  try {
    res = await fetch(API_BASE + path, { method, headers, body: payload, credentials: "include" });
    data = await res.json().catch(() => ({ success: false, message: "استجابة غير متوقعة من السيرفر" }));
  } catch (err) {
    // لا نعرض خطأ الشبكة الخام أبدًا للمستخدم
    throw new Error("تعذر الاتصال بالسيرفر، برجاء التأكد من الاتصال بالإنترنت والمحاولة مرة أخرى");
  }

  if (!res.ok) {
    if (res.status === 401 && auth) {
      clearToken();
    }
    throw new Error(data.message || "حدث خطأ غير متوقع");
  }
  return data;
}

// ===== رسائل Toast =====
function toast(message, type = "success") {
  let el = document.getElementById("sdl-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "sdl-toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.className = `toast show ${type}`;
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove("show"), 3200);
}

function escapeHtml(str) {
  if (str === undefined || str === null) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "";
  }
}

function qs(name) {
  return new URLSearchParams(location.search).get(name);
}
