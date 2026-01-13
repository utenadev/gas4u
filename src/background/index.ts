/**
 * GAS4U Background Service Worker
 *
 * Handles extension lifecycle events and maintains service worker state.
 */

function logInstallEvent(reason: chrome.runtime.OnInstalledReason): void {
  switch (reason) {
    case "install":
      console.log("GAS4U Extension installed successfully");
      break;
    case "update":
      console.log(`GAS4U Extension updated to ${chrome.runtime.getManifest().version}`);
      break;
    case "chrome_update":
      console.log("Chrome browser updated");
      break;
    case "shared_module_update":
      console.log("Shared module updated");
      break;
  }
}

chrome.runtime.onInstalled.addListener((details) => {
  logInstallEvent(details.reason);
});

chrome.runtime.onStartup.addListener(() => {
  console.log("GAS4U Extension started");
});

// Keep service worker alive during development to prevent sleep
const KEEP_ALIVE_INTERVAL_MS = 20_000;

setInterval(() => {
  chrome.runtime.getPlatformInfo(() => {
    // Silent ping to keep service worker active
  });
}, KEEP_ALIVE_INTERVAL_MS);
