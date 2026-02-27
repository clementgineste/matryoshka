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

## Tech

- Manifest V3 (WebExtensions)
- Vanilla JS — no framework, no bundler, no dependencies
- `browser.tabGroups` + `browser.storage.local`

## License

MIT
