const premiumEl = document.getElementById("premiumEnabled") as HTMLInputElement;
const providerEl = document.getElementById("provider") as HTMLSelectElement;
const openaiKeyEl = document.getElementById("openaiKey") as HTMLInputElement;
const customEndpointEl = document.getElementById(
  "customEndpoint"
) as HTMLInputElement;
const openaiBlock = document.getElementById("openaiBlock")!;
const customBlock = document.getElementById("customBlock")!;
const statusEl = document.getElementById("status")!;

function renderBlocks() {
  const v = providerEl.value;
  openaiBlock.style.display = v === "openai" ? "block" : "none";
  customBlock.style.display = v === "custom" ? "block" : "none";
}

async function load() {
  const {
    premiumEnabled = false,
    provider = "openai",
    openaiKey = "",
    customEndpoint = "",
  } = await chrome.storage.sync.get({});
  premiumEl.checked = premiumEnabled;
  providerEl.value = provider;
  openaiKeyEl.value = openaiKey;
  customEndpointEl.value = customEndpoint;
  renderBlocks();
}

async function save() {
  await chrome.storage.sync.set({
    premiumEnabled: premiumEl.checked,
    provider: providerEl.value,
    openaiKey: openaiKeyEl.value,
    customEndpoint: customEndpointEl.value,
  });
  statusEl.textContent = "Saved";
  setTimeout(() => (statusEl.textContent = ""), 1200);
}

document.getElementById("save")!.addEventListener("click", save);
providerEl.addEventListener("change", renderBlocks);
load();
