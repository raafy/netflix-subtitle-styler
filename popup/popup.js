/**
 * @file popup.js
 * @description Popup controller. Loads current settings, wires up controls,
 *              and pushes changes to the active Netflix tab in real time.
 */

"use strict";

// ─── Preset metadata (duplicated here to keep popup self-contained) ───────────

const PRESET_META = {
  netflix_default: {
    label: "Netflix Default",
    description: "Restores Netflix's original subtitle appearance.",
  },
  crunchyroll: {
    label: "Crunchyroll",
    description: "White text with a thick black outline — classic anime fansub style.",
  },
  accessibility: {
    label: "Accessibility",
    description: "High-contrast yellow on black for maximum readability.",
  },
  cinema: {
    label: "Cinema",
    description: "Elegant italic serif text with a soft shadow.",
  },
  minimal: {
    label: "Minimal",
    description: "Small, clean, semi-transparent text that stays out of the way.",
  },
  custom: {
    label: "Custom",
    description: "Your own settings — configure everything in Full Settings.",
  },
};

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const toggleEnabled    = document.getElementById("toggleEnabled");
const statusBar        = document.getElementById("statusBar");
const statusText       = document.getElementById("statusText");
const presetSelect     = document.getElementById("presetSelect");
const presetDesc       = document.getElementById("presetDescription");
const quickFontSize    = document.getElementById("quickFontSize");
const quickFontSizeVal = document.getElementById("quickFontSizeVal");
const quickOpacity     = document.getElementById("quickOpacity");
const quickOpacityVal  = document.getElementById("quickOpacityVal");
const quickColor       = document.getElementById("quickColor");
const quickPosition    = document.getElementById("quickPosition");
const quickPositionVal = document.getElementById("quickPositionVal");
const btnReset         = document.getElementById("btnReset");
const btnOpenOptions   = document.getElementById("btnOpenOptions");

// ─── State ────────────────────────────────────────────────────────────────────

/** @type {object} */
let currentSettings = null;
/** @type {string} */
let currentPreset   = "netflix_default";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setStatus(msg, type = "") {
  statusText.textContent = msg;
  statusBar.className = "status-bar" + (type ? ` status-bar--${type}` : "");
}

/**
 * Sends updated settings to the service worker to persist + broadcast.
 */
function pushSettings() {
  chrome.runtime.sendMessage(
    { type: "SAVE_SETTINGS", settings: currentSettings, activePreset: currentPreset },
    () => {
      if (chrome.runtime.lastError) {
        setStatus("Could not save — is Netflix open?", "err");
        return;
      }
      setStatus("Saved ✓", "ok");
      setTimeout(() => setStatus("Live preview active"), 1500);
    }
  );
}

// ─── Populate UI from settings object ─────────────────────────────────────────

function populateUI(settings, presetKey) {
  currentSettings = settings;
  currentPreset   = presetKey;

  toggleEnabled.checked       = settings.enabled;
  presetSelect.value          = presetKey;
  presetDesc.textContent      = PRESET_META[presetKey]?.description ?? "";

  quickFontSize.value         = settings.fontSize;
  quickFontSizeVal.textContent = settings.fontSize + "%";

  quickOpacity.value          = settings.opacity;
  quickOpacityVal.textContent = Math.round(settings.opacity * 100) + "%";

  quickColor.value            = settings.color;

  quickPosition.value         = settings.verticalPosition;
  quickPositionVal.textContent = settings.verticalPosition + "%";
}

// ─── Init ─────────────────────────────────────────────────────────────────────

chrome.runtime.sendMessage({ type: "GET_SETTINGS" }, (response) => {
  if (!response) {
    setStatus("Extension not ready", "err");
    return;
  }
  populateUI(response.settings, response.activePreset);
  setStatus("Live preview active");
});

// ─── Event listeners ──────────────────────────────────────────────────────────

toggleEnabled.addEventListener("change", () => {
  currentSettings = { ...currentSettings, enabled: toggleEnabled.checked };
  pushSettings();
});

presetSelect.addEventListener("change", () => {
  const key = presetSelect.value;
  if (key === "custom") {
    currentPreset = "custom";
    presetDesc.textContent = PRESET_META.custom.description;
    return;
  }
  // Fetch full preset from service worker / options page loads it — we request it
  chrome.runtime.sendMessage({ type: "LOAD_PRESET", preset: key }, (response) => {
    if (response && response.settings) {
      populateUI(response.settings, key);
      pushSettings();
    }
  });
  // Fallback: just update the description while waiting
  presetDesc.textContent = PRESET_META[key]?.description ?? "";
  currentPreset = key;
});

quickFontSize.addEventListener("input", () => {
  quickFontSizeVal.textContent = quickFontSize.value + "%";
  currentSettings = { ...currentSettings, fontSize: Number(quickFontSize.value) };
  currentPreset = "custom";
  presetSelect.value = "custom";
  pushSettings();
});

quickOpacity.addEventListener("input", () => {
  const v = parseFloat(quickOpacity.value);
  quickOpacityVal.textContent = Math.round(v * 100) + "%";
  currentSettings = { ...currentSettings, opacity: v };
  currentPreset = "custom";
  presetSelect.value = "custom";
  pushSettings();
});

quickColor.addEventListener("input", () => {
  currentSettings = { ...currentSettings, color: quickColor.value };
  currentPreset = "custom";
  presetSelect.value = "custom";
  pushSettings();
});

quickPosition.addEventListener("input", () => {
  quickPositionVal.textContent = quickPosition.value + "%";
  currentSettings = { ...currentSettings, verticalPosition: Number(quickPosition.value) };
  currentPreset = "custom";
  presetSelect.value = "custom";
  pushSettings();
});

btnReset.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "SAVE_SETTINGS", settings: null, activePreset: "netflix_default" }, () => {
    chrome.runtime.sendMessage({ type: "GET_SETTINGS" }, (response) => {
      if (response) populateUI(response.settings, response.activePreset);
    });
  });
});

btnOpenOptions.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "OPEN_OPTIONS" });
  window.close();
});
