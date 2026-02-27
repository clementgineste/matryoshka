// Matryoshka — context menus, create/assign, color mapping

// ── Assign / Unassign ──────────────────────────────────

async function assignGroup(groupId, sgId) {
  for (const sg of superGroups) {
    const idx = sg.groupIds.indexOf(groupId);
    if (idx !== -1) sg.groupIds.splice(idx, 1);
  }
  const target = superGroups.find((sg) => sg.id === sgId);
  if (target) target.groupIds.push(groupId);
  await save();
  render();
}

// ── Create Super Group ─────────────────────────────────

const COLORS = [
  "#4a90d9", "#e06c75", "#98c379", "#e5c07b",
  "#c678dd", "#56b6c2", "#d19a66", "#abb2bf",
];

btnAdd.addEventListener("click", () => {
  const sg = {
    id: "sg_" + Date.now(),
    name: "",
    color: COLORS[superGroups.length % COLORS.length],
    collapsed: false,
    groupIds: [],
  };
  superGroups.unshift(sg);
  save();
  render();
  const el = tree.querySelector(`[data-sg-id="${sg.id}"] .sg-name`);
  if (el) startInlineRename(el, sg);
});

function startInlineRename(nameEl, sg) {
  const input = document.createElement("input");
  input.className = "sg-name-input";
  input.value = sg.name;
  input.placeholder = "Name...";
  nameEl.replaceWith(input);
  input.focus();

  const commit = () => {
    sg.name = input.value.trim() || "Untitled";
    save();
    render();
  };
  input.addEventListener("blur", commit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") render();
  });
}

// ── Context Menus ──────────────────────────────────────

let activeMenu = null;

function closeMenu() {
  if (activeMenu) { activeMenu.remove(); activeMenu = null; }
}

document.addEventListener("click", closeMenu);

function showSuperGroupMenu(e, sg) {
  closeMenu();
  const menu = document.createElement("div");
  menu.className = "ctx-menu";
  menu.style.left = e.clientX + "px";
  menu.style.top = e.clientY + "px";

  const rename = document.createElement("div");
  rename.className = "ctx-item";
  rename.textContent = "Rename";
  rename.addEventListener("click", () => {
    closeMenu();
    const el = tree.querySelector(`[data-sg-id="${sg.id}"] .sg-name`);
    if (el) startInlineRename(el, sg);
  });

  const del = document.createElement("div");
  del.className = "ctx-item";
  del.textContent = "Delete";
  del.addEventListener("click", () => {
    closeMenu();
    superGroups = superGroups.filter((s) => s.id !== sg.id);
    save();
    render();
  });

  menu.append(rename, del);
  document.body.appendChild(menu);
  activeMenu = menu;
}

function showGroupMenu(e, group, parentSg) {
  closeMenu();
  const menu = document.createElement("div");
  menu.className = "ctx-menu";
  menu.style.left = e.clientX + "px";
  menu.style.top = e.clientY + "px";

  const label = document.createElement("div");
  label.className = "ctx-item";
  label.textContent = "Move to...";
  label.style.fontWeight = "600";
  label.style.pointerEvents = "none";
  menu.appendChild(label);

  for (const sg of superGroups) {
    const item = document.createElement("div");
    item.className = "ctx-sub";
    item.textContent = sg.name || "Untitled";
    if (parentSg && parentSg.id === sg.id) {
      item.style.opacity = "0.4";
      item.style.pointerEvents = "none";
    }
    item.addEventListener("click", () => {
      closeMenu();
      assignGroup(group.id, sg.id);
    });
    menu.appendChild(item);
  }

  document.body.appendChild(menu);
  activeMenu = menu;
}

// ── Color mapping (FF group colors → CSS) ──────────────

function mapColor(ffColor) {
  const map = {
    blue: "#4a90d9", red: "#e06c75", yellow: "#e5c07b",
    green: "#98c379", pink: "#c678dd", purple: "#b668cd",
    cyan: "#56b6c2", orange: "#d19a66", grey: "#6b6b7b",
  };
  return map[ffColor] || "#6b6b7b";
}
