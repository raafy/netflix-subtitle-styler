/**
 * @file settings.js
 * @description Unified settings schema, defaults, storage helpers, and migration logic.
 *
 * All persistent state lives under a single `chrome.storage.sync` key: `subtitleSettings`.
 * The active preset name is stored separately under `activePreset`.
 */

import { PRESETS } from "./presets.js";

/**
 * @typedef {Object} SubtitleSettings
 * @property {boolean}  enabled              - Master toggle.
 * @property {string}   fontFamily           - CSS font-family value.
 * @property {number}   fontSize             - Percent of base size (e.g. 100 = 100%).
 * @property {string}   fontWeight           - CSS font-weight (normal|bold|100–900).
 * @property {string}   fontStyle            - CSS font-style (normal|italic|oblique).
 * @property {string}   color                - Text color hex string.
 * @property {number}   opacity              - Text opacity 0–1.
 * @property {string}   textShadow           - Shadow mode: "none"|"drop-shadow"|"hard".
 * @property {string}   shadowColor          - Shadow color hex string.
 * @property {number}   shadowBlur           - Shadow blur radius in px.
 * @property {number}   shadowOffsetX        - Shadow X offset in px.
 * @property {number}   shadowOffsetY        - Shadow Y offset in px.
 * @property {string}   backgroundColor      - Background color hex or "transparent".
 * @property {number}   backgroundOpacity    - Background opacity 0–1.
 * @property {number}   backgroundPadding    - Background padding in px.
 * @property {number}   backgroundBorderRadius - Background border-radius in px.
 * @property {number}   outlineWidth         - Text stroke/outline width in px.
 * @property {string}   outlineColor         - Outline color hex string.
 * @property {string}   textAlign            - CSS text-align (left|center|right).
 * @property {number}   verticalPosition     - Subtitle vertical position as % from top.
 * @property {number}   letterSpacing        - CSS letter-spacing in px.
 * @property {number}   lineHeight           - CSS line-height multiplier.
 * @property {string}   textTransform        - CSS text-transform (none|uppercase|lowercase|capitalize).
 * @property {number}   maxWidth             - Max subtitle container width as % of viewport.
 */

/** @type {SubtitleSettings} */
export const DEFAULT_SETTINGS = PRESETS.netflix_default.settings;

/** Storage key constants */
export const STORAGE_KEYS = {
  SETTINGS: "subtitleSettings",
  ACTIVE_PRESET: "activePreset",
  SCHEMA_VERSION: "schemaVersion",
};

/** Current schema version — increment when adding new fields. */
export const CURRENT_SCHEMA_VERSION = 1;

/**
 * Loads settings from `chrome.storage.sync`.
 * Merges stored values over defaults so new fields always have a fallback.
 *
 * @returns {Promise<{ settings: SubtitleSettings; activePreset: string }>}
 */
export async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      [STORAGE_KEYS.SETTINGS, STORAGE_KEYS.ACTIVE_PRESET, STORAGE_KEYS.SCHEMA_VERSION],
      (result) => {
        const stored = result[STORAGE_KEYS.SETTINGS] ?? {};
        const settings = { ...DEFAULT_SETTINGS, ...stored };
        const activePreset = result[STORAGE_KEYS.ACTIVE_PRESET] ?? "netflix_default";
        resolve({ settings, activePreset });
      }
    );
  });
}

/**
 * Saves settings to `chrome.storage.sync`.
 *
 * @param {SubtitleSettings} settings
 * @param {string} [activePreset]
 * @returns {Promise<void>}
 */
export async function saveSettings(settings, activePreset) {
  return new Promise((resolve) => {
    const payload = {
      [STORAGE_KEYS.SETTINGS]: settings,
      [STORAGE_KEYS.SCHEMA_VERSION]: CURRENT_SCHEMA_VERSION,
    };
    if (activePreset !== undefined) {
      payload[STORAGE_KEYS.ACTIVE_PRESET] = activePreset;
    }
    chrome.storage.sync.set(payload, resolve);
  });
}

/**
 * Resets all settings back to the Netflix default preset.
 *
 * @returns {Promise<void>}
 */
export async function resetSettings() {
  return saveSettings(DEFAULT_SETTINGS, "netflix_default");
}

/**
 * Sends the current settings to the Netflix tab's content script via a message.
 *
 * @param {SubtitleSettings} settings
 * @param {number} [tabId] - Specific tab ID; if omitted, broadcasts to all Netflix tabs.
 * @returns {Promise<void>}
 */
export async function applySettingsToTab(settings, tabId) {
  const message = { type: "APPLY_SETTINGS", settings };

  if (tabId !== undefined) {
    chrome.tabs.sendMessage(tabId, message).catch(() => {});
    return;
  }

  const tabs = await chrome.tabs.query({ url: "*://*.netflix.com/*" });
  for (const tab of tabs) {
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, message).catch(() => {});
    }
  }
}
