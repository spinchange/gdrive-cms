const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz10_N-B6n-JgIpc3JEQfOt4dztxylp_UPFhT9TVgK8PkYW8aMC3Th_rr6LY6a0wHegzQ/exec";

const statusEl = document.getElementById("admin-status");
const listEl = document.getElementById("admin-list");
const sheetEl = document.getElementById("sheet-link");

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
