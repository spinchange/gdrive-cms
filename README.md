# GDrive CMS (Static Frontend)

A lightweight static frontend that renders content from Google Docs via a Google Apps Script backend. This removes the Apps Script banner by serving the UI from GitHub Pages (or any static host).

## Features
- Pulls page content from Google Docs
- Navigation built from a Google Sheet config
- JSON/JSONP backend support
- Simple admin page with links to edit docs and the sheet
- Basic caching + last updated timestamp
- Configurable branding (title/logo/hide header)

## Architecture
- Backend: Google Apps Script web app
- Content: Google Docs (HTML export)
- Config: Google Sheet (slug + doc ID/link)
- Frontend: Static HTML/JS/CSS

## Repository Structure
- `index.html` Main site
- `admin.html` Admin page
- `app.js` Main site logic
- `admin.js` Admin page logic
- `config.js` Branding config
- `styles.css` Site styles

## Setup
1. Deploy the Apps Script web app.
2. Update the `APPS_SCRIPT_URL` in `app.js` and `admin.js`.
3. Publish this repo via GitHub Pages.

## Configuration
Edit `config.js` to customize branding:
```js
window.CMS_CONFIG = {
  siteTitle: "GDrive CMS",
  adminTitle: "GDrive CMS Admin",
  showHeader: true,
  logoUrl: "",
  logoAlt: "",
  logoLink: "index.html"
};
```

## Usage
- View site: `/?page=home`
- Admin list: `/admin.html`

## Notes
- GitHub Pages is public; anything in this repo is public.
- If you want gating/auth, use a host like Netlify/Vercel or an auth proxy.
