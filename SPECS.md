# SPECS.md — Matryoshka

*Super Groups for your Firefox tabs*

## Goal
Allow users to organize their native Firefox tab groups into **Super Groups**, displayed in the sidebar.

---

## Features

### F1 — Sidebar Display
- The sidebar shows a tree: **Super Groups > FF Groups > Tabs**
- Each level is collapsible/expandable via click
- Unassigned FF groups appear in an **"Ungrouped"** section at the bottom
- Native FF group colors are visually reflected

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

### F2 — Create a Super Group
- **"+ Super Group"** button at the top of the sidebar
- Inline name input (no modal)
- Optional color (palette of 8 fixed colors)

### F3 — Assign an FF Group to a Super Group
- **Drag & drop** a group onto a Super Group
- OR right-click on a group → *"Move to..."* → list of Super Groups

### F4 — Rename / Delete a Super Group
- Right-click on a Super Group → context menu:
  - Rename (inline editing)
  - Delete (FF groups become "Ungrouped" again — they are not deleted)

### F5 — Real-time Synchronization
- `tabGroups.onCreated` → new group added to "Ungrouped"
- `tabGroups.onRemoved` → group cleanly removed from its Super Group
- `tabGroups.onUpdated` → name/color updated in the sidebar

### F6 — Click on a Tab
- Activates the tab in Firefox (`browser.tabs.update`)

---

## Edge Cases
| Situation | Behavior |
|---|---|
| Empty Super Group | Displayed normally, can be deleted |
| FF group deleted from FF | Silently removed from its Super Group |
| Firefox restarts | `groupId` may change → associations are lost if the group is not restored with the same ID (known limitation, accepted in v1) |
| Sidebar closed | Nothing — the extension is passive, no heavy background logic |

---

## Non-goals (v1)
- No tab search
- No automatic sorting
- No import/export
- No multi-window synchronization
- No keyboard shortcuts

---

## Success Criteria
- [ ] Install the extension in developer mode without errors
- [ ] Create a Super Group, assign 2 FF groups, restart FF → Super Groups are restored
- [ ] Delete an FF group from FF → it disappears from the sidebar without crash
- [ ] The UI is usable without documentation
