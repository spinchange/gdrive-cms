const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyllSmcYeD-f-GmbX05PciYEb2czPNos2tAahEoOe4qhk1m3Mcn1iFqyzGcpaDXB35K/exec";

const navEl = document.getElementById("nav");
const contentEl = document.getElementById("content");
const editEl = document.getElementById("edit-link");
const updatedEl = document.getElementById("last-updated");

function getParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function setLoading() {
  contentEl.innerHTML = '<div class="loading">Loading...</div>';
}

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

function render(data) {
  if (!data || !data.ok) {
    contentEl.innerHTML = '<div class="loading">Error loading content.</div>';
    return;
  }
  document.title = data.title || "GDrive CMS";
  navEl.innerHTML = data.navHtml || '<a href="?page=home">Home</a>';
  contentEl.innerHTML = data.contentHtml || "";

  if (data.docId) {
    editEl.innerHTML = `Edit Doc: <a href="https://docs.google.com/document/d/${data.docId}/edit" target="_blank" rel="noreferrer">Open in Google Docs</a>`;
  } else {
    editEl.innerHTML = "";
  }

  if (data.lastUpdated) {
    const dt = new Date(data.lastUpdated);
    const text = isNaN(dt.getTime()) ? data.lastUpdated : dt.toLocaleString();
    updatedEl.textContent = `Last updated: ${text}`;
  } else {
    updatedEl.textContent = "";
  }

  const activeSlug = (data.slug || "").toLowerCase();
  navEl.querySelectorAll("a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (href.toLowerCase().includes(`page=${activeSlug}`)) {
      a.classList.add("active");
    }
  });
}

function loadPage(slug) {
  setLoading();
  const url = `${APPS_SCRIPT_URL}?page=${encodeURIComponent(slug)}&format=json`;
  jsonp(url, (err, data) => {
    if (err) {
      contentEl.innerHTML = '<div class="loading">Error loading content.</div>';
      return;
    }
    render(data);
  });
}

const slug = (getParam("page") || "home").toLowerCase();
loadPage(slug);
