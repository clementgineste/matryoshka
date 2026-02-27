// Matryoshka — sidebar rendering and state

const tree = document.getElementById("tree");
const btnAdd = document.getElementById("btn-add");

let superGroups = [];
let ffGroups = [];   // cached from tabGroups.query
let ffTabs = {};     // groupId -> [tab, ...]

// ── Bootstrap ──────────────────────────────────────────

async function init() {
  const data = await browser.storage.local.get("superGroups");
  superGroups = data.superGroups || [];
  await refreshFFData();
  render();
}

async function refreshFFData() {
  try {
    ffGroups = await browser.tabGroups.query({});
  } catch {
    ffGroups = [];
  }
  ffTabs = {};
  const allTabs = await browser.tabs.query({});
  for (const tab of allTabs) {
    const gid = tab.groupId ?? -1;
    if (gid === -1) continue;
    if (!ffTabs[gid]) ffTabs[gid] = [];
    ffTabs[gid].push(tab);
  }
}

async function save() {
  await browser.storage.local.set({ superGroups });
}

// ── Render ─────────────────────────────────────────────

function render() {
  tree.innerHTML = "";
  const assignedIds = new Set(superGroups.flatMap((sg) => sg.groupIds));

  for (const sg of superGroups) {
    tree.appendChild(buildSuperGroup(sg));
  }

  const ungrouped = ffGroups.filter((g) => !assignedIds.has(g.id));
  if (ungrouped.length) {
    const div = document.createElement("div");
    div.className = "ungrouped-divider";
    div.textContent = "Ungrouped";
    tree.appendChild(div);
    for (const g of ungrouped) {
      tree.appendChild(buildFFGroup(g, null));
    }
  }
}

function buildSuperGroup(sg) {
  const el = document.createElement("div");
  el.className = "super-group";
  el.dataset.sgId = sg.id;

  const header = document.createElement("div");
  header.className = "sg-header";

  const toggle = document.createElement("span");
  toggle.className = "sg-toggle";
  toggle.textContent = sg.collapsed ? "▸" : "▾";

  const dot = document.createElement("span");
  dot.className = "sg-color";
  dot.style.background = sg.color;

  const name = document.createElement("span");
  name.className = "sg-name";
  name.textContent = sg.name;

  header.append(toggle, dot, name);
  el.appendChild(header);

  header.addEventListener("click", () => {
    sg.collapsed = !sg.collapsed;
    save();
    render();
  });

  header.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    showSuperGroupMenu(e, sg);
  });

  // Drop target
  header.addEventListener("dragover", (e) => {
    e.preventDefault();
    header.classList.add("drag-over");
  });
  header.addEventListener("dragleave", () => header.classList.remove("drag-over"));
  header.addEventListener("drop", (e) => {
    e.preventDefault();
    header.classList.remove("drag-over");
    const groupId = Number(e.dataTransfer.getData("text/plain"));
    if (groupId) assignGroup(groupId, sg.id);
  });

  if (!sg.collapsed) {
    for (const gid of sg.groupIds) {
      const g = ffGroups.find((fg) => fg.id === gid);
      if (g) el.appendChild(buildFFGroup(g, sg));
    }
  }

  return el;
}

function buildFFGroup(g, parentSg) {
  const el = document.createElement("div");
  el.className = "ff-group";
  el.dataset.groupId = g.id;

  const header = document.createElement("div");
  header.className = "fg-header";
  header.draggable = true;

  const toggle = document.createElement("span");
  toggle.className = "fg-toggle";
  toggle.textContent = "▸";

  const dot = document.createElement("span");
  dot.className = "fg-color";
  dot.style.background = mapColor(g.color);

  const name = document.createElement("span");
  name.textContent = g.title || "Untitled";

  header.append(toggle, dot, name);
  el.appendChild(header);

  let expanded = false;

  header.addEventListener("click", () => {
    expanded = !expanded;
    toggle.textContent = expanded ? "▾" : "▸";
    const existing = el.querySelectorAll(".tab-item");
    if (expanded && existing.length === 0) {
      const tabs = ffTabs[g.id] || [];
      for (const tab of tabs) el.appendChild(buildTab(tab));
    }
    existing.forEach((t) => (t.style.display = expanded ? "" : "none"));
  });

  header.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    showGroupMenu(e, g, parentSg);
  });

  header.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", String(g.id));
  });

  return el;
}

function buildTab(tab) {
  const el = document.createElement("div");
  el.className = "tab-item";

  const icon = document.createElement("img");
  icon.className = "tab-favicon";
  icon.src = tab.favIconUrl || "";
  icon.onerror = () => (icon.style.display = "none");

  const title = document.createElement("span");
  title.className = "tab-title";
  title.textContent = tab.title || tab.url;

  el.append(icon, title);

  el.addEventListener("click", () => {
    browser.tabs.update(tab.id, { active: true });
    browser.windows.update(tab.windowId, { focused: true });
  });

  return el;
}

// ── Messages from background ───────────────────────────

browser.runtime.onMessage.addListener(async (msg) => {
  if (["group-created", "group-removed", "group-updated"].includes(msg.type)) {
    await refreshFFData();
    render();
  }
});

// init() is called from sidebar.html after all scripts load
