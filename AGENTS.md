# AGENTS.md — Matryoshka

## Context
**Matryoshka** — Firefox extension that adds a layer of **"Super Groups"** on top of Firefox's native tab groups, like nested dolls. It is displayed exclusively in the sidebar (left panel).

## Tech Stack
- **Manifest V3** (WebExtensions)
- **Vanilla JS** — no framework, no bundler
- **browser.tabGroups** — read/listen to native FF tab groups
- **browser.storage.local** — persist super groups
- **browser.sidebarAction** — main UI
- **HTML/CSS** — minimalist sidebar

## Project Structure
```
/
├── manifest.json
├── background.js          # listens to tabGroups events
├── sidebar/
│   ├── sidebar.html
│   ├── sidebar.js         # state, rendering, FF data sync
│   ├── menus.js           # context menus, create/assign, colors
│   └── sidebar.css
├── icons/
│   └── icon-48.png
└── _locales/
    └── en/
        └── messages.json
```

## Data Model (storage.local)
```json
{
  "superGroups": [
    {
      "id": "sg_1234",
      "name": "Work",
      "color": "#4a90d9",
      "collapsed": false,
      "groupIds": [3, 7]
    }
  ]
}
```
`groupIds` = IDs of native FF groups (`tabGroups.TabGroup.id`)

## Development Rules
- **No external dependencies** (no npm, no CDN)
- Each file must stay **< 200 lines**
- Always verify that a `groupId` still exists before displaying it (FF groups can disappear)
- Use `browser.*` (not `chrome.*`)
- The UI is in **English**

## Required Permissions (manifest.json)
```json
"permissions": ["tabGroups", "storage"]
```
> Note: `sidebar_action` is a **manifest key**, not a permission. It must be declared at the top level of `manifest.json`, not inside `"permissions"`.

## What the Extension Does NOT Do
- It does not create/delete native FF groups
- It does not modify tabs directly
- It has no popup, no options page (initially)
