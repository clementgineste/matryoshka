# Matryoshka

Super Groups for your Firefox tabs.

Matryoshka replaces Firefox's vertical tabs with a sidebar that lets you organize your native tab groups into nested **Super Groups** — like Russian dolls.

```
▾ 🗂 Work
    ▾ 📁 Project A  (blue)
        • Gmail
        • Figma
    ▸ 📁 Project B  (green)

▾ 🗂 Personal
    ▾ 📁 Reading  (red)
        • Le Monde

── Ungrouped ──
    📁 Misc  (grey)
```

## Features

- **Super Groups** — organize Firefox tab groups into higher-level categories
- **Tree view** — collapsible hierarchy: Super Groups > Groups > Tabs
- **Drag & drop** — move groups between Super Groups
- **Context menus** — right-click to rename, delete, or reassign
- **Real-time sync** — reflects native tab group changes instantly
- **Persistent** — Super Groups survive browser restarts

## Install (dev mode)

1. Open `about:debugging` in Firefox
2. Click **"This Firefox"** → **"Load Temporary Add-on"**
3. Select `manifest.json` from this repo

## Why a separate sidebar?

Ideally, Matryoshka would integrate directly into Firefox's native vertical tabs sidebar. However, the WebExtensions API does not allow extensions to modify Firefox's built-in interface. Extensions can only create their own sidebar panel via `sidebar_action` — they cannot inject into or alter existing native panels.

If Firefox ever exposes an API for this (track [WebExtensions API updates](https://blog.mozilla.org/addons/) and [Firefox release notes](https://www.mozilla.org/en-US/firefox/releases/)), the extension could be reworked to embed directly into the vertical tabs panel.

## Tech

- Manifest V3 (WebExtensions)
- Vanilla JS — no framework, no bundler, no dependencies
- `browser.tabGroups` + `browser.storage.local`

## License

MIT
