// Matryoshka — init and tab event listeners

async function refreshAndRender() {
  await refreshFFData();
  render();
}

browser.tabs.onCreated.addListener(() => refreshAndRender());
browser.tabs.onRemoved.addListener(() => refreshAndRender());
browser.tabs.onUpdated.addListener((_id, change) => {
  if (change.title || change.favIconUrl || change.status === "complete") {
    refreshAndRender();
  }
});

init();
