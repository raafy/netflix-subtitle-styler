/**
 * @file service-worker.js
 * @description Manifest V3 service worker for Netflix Subtitle Styler.
 *
 * Responsibilities:
 *  - Initialize default settings on first install.
 *  - Re-inject styles when a Netflix tab navigates to a new page.
 *  - Forward storage-change events to open Netflix tabs so the content
 *    script can update styles in real time without a page reload.
 */

import { loadSettings, saveSettings, DEFAULT_SETTINGS, applySettingsToTab } from "../src/settings.js";

// ─── Lifecycle ────────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    await saveSettings(DEFAULT_SETTINGS, "netflix_default");
  }
});

// ─── Tab navigation: re-apply styles after Netflix SPA navigates ─────────────

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.includes("netflix.com")
  ) {
    const { settings } = await loadSettings();
    applySettingsToTab(settings, tabId);
  }
});

// ─── Message router ───────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_SETTINGS") {
    loadSettings().then(sendResponse);
    return true; // keep message channel open for async response
  }

  if (message.type === "SAVE_SETTINGS") {
    const { settings, activePreset } = message;
    const resolvedSettings = settings ?? DEFAULT_SETTINGS;
    const resolvedPreset   = settings ? activePreset : "netflix_default";
    saveSettings(resolvedSettings, resolvedPreset).then(() => {
      applySettingsToTab(resolvedSettings);
      sendResponse({ ok: true });
    });
    return true;
  }

  if (message.type === "LOAD_PRESET") {
    import("../src/presets.js").then(({ PRESETS }) => {
      const preset = PRESETS[message.preset];
      if (preset) {
        sendResponse({ settings: preset.settings });
      } else {
        sendResponse(null);
      }
    });
    return true;
  }

  if (message.type === "OPEN_OPTIONS") {
    chrome.runtime.openOptionsPage();
    return false;
  }
});
