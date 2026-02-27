// Matryoshka — background service worker
// Listens to native tabGroups events and relays them to the sidebar.

browser.tabGroups.onCreated.addListener((group) => {
  notifySidebar("group-created", group);
});

browser.tabGroups.onRemoved.addListener((group) => {
  removeGroupFromStorage(group.id);
  notifySidebar("group-removed", group);
});

browser.tabGroups.onUpdated.addListener((group) => {
  notifySidebar("group-updated", group);
});

async function removeGroupFromStorage(groupId) {
  const { superGroups = [] } = await browser.storage.local.get("superGroups");
  let changed = false;
  for (const sg of superGroups) {
    const idx = sg.groupIds.indexOf(groupId);
    if (idx !== -1) {
      sg.groupIds.splice(idx, 1);
      changed = true;
    }
  }
  if (changed) {
    await browser.storage.local.set({ superGroups });
  }
}

function notifySidebar(type, data) {
  browser.runtime.sendMessage({ type, data }).catch(() => {
    // Sidebar not open — ignore
  });
}
