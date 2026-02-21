const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwZulAChIdhiYLCkQHAgiiZHHdn7mkAoMfJ0ZT627IJ1a-Sni-PYYeMXDixjVSTdEH-_w/exec";

const statusEl = document.getElementById("admin-status");
const listEl = document.getElementById("admin-list");
const sheetEl = document.getElementById("sheet-link");
const headerEl = document.getElementById("site-header");
const brandEl = document.getElementById("brand");

function jsonp(url, callback) {
  const callbackName = "jsonp_cb_" + Math.random().toString(36).slice(2);
  window[callbackName] = (data) => {
    delete window[callbackName];
    script.remove();
    callback(null, data);
  };
  const sep = url.includes("?") ? "&" : "?";
  const script = document.createElement("script");
  script.src = `${url}${sep}callback=${callbackName}`;
  script.onerror = () => {
    delete window[callbackName];
    script.remove();
    callback(new Error("Failed to load JSONP"));
  };
  document.body.appendChild(script);
}

function renderList(data) {
  if (!data || !data.ok) {
    statusEl.textContent = "Error loading page list.";
    return;
  }
  const cfg = window.CMS_CONFIG || {};
  const adminTitle = cfg.adminTitle || "GDrive CMS Admin";
  document.title = adminTitle;
  if (brandEl) {
    if (cfg.logoUrl) {
      const alt = cfg.logoAlt || adminTitle;
      const href = cfg.logoLink || "index.html";
      brandEl.innerHTML = `<a href="${href}"><img src="${cfg.logoUrl}" alt="${alt}"></a>`;
    } else {
      brandEl.textContent = adminTitle;
    }
  }
  if (headerEl && cfg.showHeader === false) {
    headerEl.style.display = "none";
  }
  statusEl.textContent = "";
  const pages = data.pages || [];
  if (!pages.length) {
    listEl.innerHTML = "<p>No pages found in the config sheet.</p>";
  } else {
    listEl.innerHTML = pages.map((p) => {
      const slug = p.slug || "";
      const docId = p.docId || "";
      const viewUrl = `index.html?page=${encodeURIComponent(slug)}`;
      const docUrl = docId ? `https://docs.google.com/document/d/${docId}/edit` : "#";
      return `<div style="margin-bottom:12px;">
        <strong>${slug}</strong>
        &middot; <a href="${viewUrl}">View</a>
        &middot; <a href="${docUrl}" target="_blank" rel="noreferrer">Edit Doc</a>
      </div>`;
    }).join("");
  }

  if (data.sheetUrl) {
    sheetEl.innerHTML = `Edit Page List: <a href="${data.sheetUrl}" target="_blank" rel="noreferrer">Open Config Sheet</a>`;
  }
}

const url = `${APPS_SCRIPT_URL}?format=json&list=1`;
jsonp(url, (err, data) => {
  if (err) {
    statusEl.textContent = "Error loading page list.";
    return;
  }
  renderList(data);
});
