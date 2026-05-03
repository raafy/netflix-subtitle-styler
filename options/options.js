/**
 * @file options.js
 * @description Full settings page controller.
 *
 * Handles:
 *  - Section navigation
 *  - Loading / saving settings via the service worker
 *  - Live preview bar
 *  - Preset selection
 *  - Export / import as JSON
 *  - Color picker ↔ hex input synchronization
 */

"use strict";

// ─── Preset data (inline copy — keeps options page standalone) ────────────────

const PRESETS = {
  netflix_default: {
    label: "Netflix Default",
    settings: {
      enabled: true,
      fontFamily: "Netflix Sans, Arial, sans-serif",
      fontSize: 100,
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#ffffff",
      opacity: 1,
      textShadow: "drop-shadow",
      shadowColor: "#000000",
      shadowBlur: 3,
      shadowOffsetX: 0,
      shadowOffsetY: 2,
      backgroundColor: "#000000",
      backgroundOpacity: 0,
      backgroundPadding: 4,
      backgroundBorderRadius: 2,
      outlineWidth: 0,
      outlineColor: "#000000",
      textAlign: "center",
      verticalPosition: 90,
      letterSpacing: 0,
      lineHeight: 1.4,
      textTransform: "none",
      maxWidth: 80,
    },
  },
  crunchyroll: {
    label: "Crunchyroll",
    settings: {
      enabled: true,
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 110,
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#ffffff",
      opacity: 1,
      textShadow: "none",
      shadowColor: "#000000",
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      backgroundColor: "#000000",
      backgroundOpacity: 0,
      backgroundPadding: 0,
      backgroundBorderRadius: 0,
      outlineWidth: 3,
      outlineColor: "#000000",
      textAlign: "center",
      verticalPosition: 90,
      letterSpacing: 0.5,
      lineHeight: 1.3,
      textTransform: "none",
      maxWidth: 85,
    },
  },
  accessibility: {
    label: "Accessibility",
    settings: {
      enabled: true,
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 130,
      fontWeight: "bold",
      fontStyle: "normal",
      color: "#ffff00",
      opacity: 1,
      textShadow: "none",
      shadowColor: "#000000",
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      backgroundColor: "#000000",
      backgroundOpacity: 0.8,
      backgroundPadding: 8,
      backgroundBorderRadius: 4,
      outlineWidth: 0,
      outlineColor: "#000000",
      textAlign: "center",
      verticalPosition: 90,
      letterSpacing: 1,
      lineHeight: 1.5,
      textTransform: "none",
      maxWidth: 80,
    },
  },
  cinema: {
    label: "Cinema",
    settings: {
      enabled: true,
      fontFamily: "Georgia, Times New Roman, serif",
      fontSize: 95,
      fontWeight: "normal",
      fontStyle: "italic",
      color: "#f5f5f5",
      opacity: 0.95,
      textShadow: "drop-shadow",
      shadowColor: "#000000",
      shadowBlur: 6,
      shadowOffsetX: 1,
      shadowOffsetY: 1,
      backgroundColor: "#000000",
      backgroundOpacity: 0,
      backgroundPadding: 4,
      backgroundBorderRadius: 0,
      outlineWidth: 0,
      outlineColor: "#000000",
      textAlign: "center",
      verticalPosition: 90,
      letterSpacing: 0.3,
      lineHeight: 1.5,
      textTransform: "none",
      maxWidth: 75,
    },
  },
  minimal: {
    label: "Minimal",
    settings: {
      enabled: true,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: 80,
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#e0e0e0",
      opacity: 0.85,
      textShadow: "drop-shadow",
      shadowColor: "#000000",
      shadowBlur: 2,
      shadowOffsetX: 0,
      shadowOffsetY: 1,
      backgroundColor: "#000000",
      backgroundOpacity: 0,
      backgroundPadding: 4,
      backgroundBorderRadius: 2,
      outlineWidth: 0,
      outlineColor: "#000000",
      textAlign: "center",
      verticalPosition: 90,
      letterSpacing: 0,
      lineHeight: 1.3,
      textTransform: "none",
      maxWidth: 70,
    },
  },
};

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const masterToggle   = document.getElementById("masterToggle");
const toast          = document.getElementById("toast");
const previewText    = document.getElementById("previewText");
const btnSave        = document.getElementById("btnSave");
const btnReset       = document.getElementById("btnReset");
const btnImport      = document.getElementById("btnImport");
const btnExport      = document.getElementById("btnExport");
const importFile     = document.getElementById("importFile");

// Nav
const navLinks = document.querySelectorAll(".nav-link");
const panels   = document.querySelectorAll(".panel");
const sectionTitles = {
  presets:    { title: "Presets",              subtitle: "Choose a built-in preset or build your own." },
  typography: { title: "Typography",           subtitle: "Font family, size, weight, style, and spacing." },
  color:      { title: "Color & Opacity",      subtitle: "Text color and overall transparency." },
  shadow:     { title: "Shadow & Outline",     subtitle: "Drop shadow, hard shadow, and text outline." },
  background: { title: "Background",           subtitle: "Subtitle background box styling." },
  layout:     { title: "Layout & Position",    subtitle: "Text alignment, vertical placement, and container width." },
  advanced:   { title: "Advanced",             subtitle: "Import / export and extension info." },
};

// Typography
const fontFamily     = document.getElementById("fontFamily");
const fontSize       = document.getElementById("fontSize");
const fontSizeVal    = document.getElementById("fontSizeVal");
const fontWeight     = document.getElementById("fontWeight");
const fontStyle      = document.getElementById("fontStyle");
const letterSpacing  = document.getElementById("letterSpacing");
const letterSpacingVal = document.getElementById("letterSpacingVal");
const lineHeight     = document.getElementById("lineHeight");
const lineHeightVal  = document.getElementById("lineHeightVal");
const textTransform  = document.getElementById("textTransform");

// Color
const colorPicker    = document.getElementById("color");
const colorHex       = document.getElementById("colorHex");
const opacitySlider  = document.getElementById("opacity");
const opacityVal     = document.getElementById("opacityVal");

// Shadow
const textShadow       = document.getElementById("textShadow");
const shadowColorPick  = document.getElementById("shadowColor");
const shadowColorHex   = document.getElementById("shadowColorHex");
const shadowBlur       = document.getElementById("shadowBlur");
const shadowBlurVal    = document.getElementById("shadowBlurVal");
const shadowOffsetX    = document.getElementById("shadowOffsetX");
const shadowOffsetXVal = document.getElementById("shadowOffsetXVal");
const shadowOffsetY    = document.getElementById("shadowOffsetY");
const shadowOffsetYVal = document.getElementById("shadowOffsetYVal");
const outlineWidth     = document.getElementById("outlineWidth");
const outlineWidthVal  = document.getElementById("outlineWidthVal");
const outlineColorPick = document.getElementById("outlineColor");
const outlineColorHex  = document.getElementById("outlineColorHex");
const shadowDetails    = document.querySelectorAll(".shadow-detail");

// Background
const bgColorPick  = document.getElementById("backgroundColor");
const bgColorHex   = document.getElementById("backgroundColorHex");
const bgOpacity    = document.getElementById("backgroundOpacity");
const bgOpacityVal = document.getElementById("backgroundOpacityVal");
const bgPadding    = document.getElementById("backgroundPadding");
const bgPaddingVal = document.getElementById("backgroundPaddingVal");
const bgRadius     = document.getElementById("backgroundBorderRadius");
const bgRadiusVal  = document.getElementById("backgroundBorderRadiusVal");

// Layout
const textAlign         = document.getElementById("textAlign");
const verticalPosition  = document.getElementById("verticalPosition");
const verticalPositionVal = document.getElementById("verticalPositionVal");
const maxWidth          = document.getElementById("maxWidth");
const maxWidthVal       = document.getElementById("maxWidthVal");

// ─── State ────────────────────────────────────────────────────────────────────

let currentSettings = null;
let activePreset    = "netflix_default";
let isDirty         = false;

// ─── Toast helper ─────────────────────────────────────────────────────────────

let toastTimer = null;
function showToast(msg, type = "") {
  toast.textContent = msg;
  toast.className = "toast visible" + (type ? ` toast--${type}` : "");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = "toast"; }, 2500);
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function navigateTo(sectionKey) {
  navLinks.forEach((l) => l.classList.toggle("active", l.dataset.section === sectionKey));
  panels.forEach((p) => p.classList.toggle("hidden", p.id !== `section-${sectionKey}`));
  const meta = sectionTitles[sectionKey] ?? {};
  document.getElementById("sectionTitle").textContent    = meta.title ?? sectionKey;
  document.getElementById("sectionSubtitle").textContent = meta.subtitle ?? "";
}

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo(link.dataset.section);
  });
});

// ─── Populate UI ─────────────────────────────────────────────────────────────

function populateUI(s) {
  currentSettings = { ...s };

  masterToggle.checked = s.enabled;

  // Typography
  fontFamily.value    = s.fontFamily;
  fontSize.value      = s.fontSize;        fontSizeVal.textContent   = s.fontSize + "%";
  fontWeight.value    = s.fontWeight;
  fontStyle.value     = s.fontStyle;
  letterSpacing.value = s.letterSpacing;   letterSpacingVal.textContent = s.letterSpacing + "px";
  lineHeight.value    = s.lineHeight;      lineHeightVal.textContent    = s.lineHeight;
  textTransform.value = s.textTransform;

  // Color
  colorPicker.value  = s.color;
  colorHex.value     = s.color;
  opacitySlider.value = s.opacity;         opacityVal.textContent = Math.round(s.opacity * 100) + "%";

  // Shadow
  textShadow.value       = s.textShadow;
  shadowColorPick.value  = s.shadowColor;  shadowColorHex.value    = s.shadowColor;
  shadowBlur.value       = s.shadowBlur;   shadowBlurVal.textContent  = s.shadowBlur + "px";
  shadowOffsetX.value    = s.shadowOffsetX; shadowOffsetXVal.textContent = s.shadowOffsetX + "px";
  shadowOffsetY.value    = s.shadowOffsetY; shadowOffsetYVal.textContent = s.shadowOffsetY + "px";
  outlineWidth.value     = s.outlineWidth;  outlineWidthVal.textContent  = s.outlineWidth + "px";
  outlineColorPick.value = s.outlineColor;  outlineColorHex.value  = s.outlineColor;
  updateShadowDetailVisibility();

  // Background
  bgColorPick.value  = s.backgroundColor !== "transparent" ? s.backgroundColor : "#000000";
  bgColorHex.value   = s.backgroundColor !== "transparent" ? s.backgroundColor : "#000000";
  bgOpacity.value    = s.backgroundOpacity;    bgOpacityVal.textContent = Math.round(s.backgroundOpacity * 100) + "%";
  bgPadding.value    = s.backgroundPadding;    bgPaddingVal.textContent = s.backgroundPadding + "px";
  bgRadius.value     = s.backgroundBorderRadius; bgRadiusVal.textContent = s.backgroundBorderRadius + "px";

  // Layout
  textAlign.value          = s.textAlign;
  verticalPosition.value   = s.verticalPosition; verticalPositionVal.textContent = s.verticalPosition + "%";
  maxWidth.value           = s.maxWidth;          maxWidthVal.textContent = s.maxWidth + "%";

  // Preset cards
  document.querySelectorAll(".preset-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.preset === activePreset);
  });

  updatePreview(s);
  isDirty = false;
}

// ─── Live preview ─────────────────────────────────────────────────────────────

function hexToRgba(hex, opacity) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function updatePreview(s) {
  const el = previewText;

  // Shadow
  let shadow = "none";
  if (s.textShadow === "hard") {
    shadow = `2px 2px 0 ${s.shadowColor}, -2px -2px 0 ${s.shadowColor}, 2px -2px 0 ${s.shadowColor}, -2px 2px 0 ${s.shadowColor}`;
  } else if (s.textShadow === "drop-shadow") {
    shadow = `${s.shadowOffsetX}px ${s.shadowOffsetY}px ${s.shadowBlur}px rgba(0,0,0,0.9)`;
  }

  const stroke = s.outlineWidth > 0 ? `${s.outlineWidth}px ${s.outlineColor}` : "0px transparent";
  const bg = s.backgroundOpacity > 0
    ? hexToRgba(s.backgroundColor, s.backgroundOpacity)
    : "transparent";

  Object.assign(el.style, {
    fontFamily:      s.fontFamily,
    fontSize:        s.fontSize + "%",
    fontWeight:      s.fontWeight,
    fontStyle:       s.fontStyle,
    color:           hexToRgba(s.color, s.opacity),
    textShadow:      shadow,
    WebkitTextStroke: stroke,
    paintOrder:      "stroke fill",
    letterSpacing:   s.letterSpacing + "px",
    lineHeight:      s.lineHeight,
    textTransform:   s.textTransform,
    backgroundColor: bg,
    padding:         bg !== "transparent" ? s.backgroundPadding + "px" : "0",
    borderRadius:    s.backgroundBorderRadius + "px",
  });
}

// ─── Read current UI into settings object ────────────────────────────────────

function readUI() {
  return {
    enabled:               masterToggle.checked,
    fontFamily:            fontFamily.value.trim(),
    fontSize:              Number(fontSize.value),
    fontWeight:            fontWeight.value,
    fontStyle:             fontStyle.value,
    color:                 colorPicker.value,
    opacity:               Number(opacitySlider.value),
    textShadow:            textShadow.value,
    shadowColor:           shadowColorPick.value,
    shadowBlur:            Number(shadowBlur.value),
    shadowOffsetX:         Number(shadowOffsetX.value),
    shadowOffsetY:         Number(shadowOffsetY.value),
    backgroundColor:       bgColorPick.value,
    backgroundOpacity:     Number(bgOpacity.value),
    backgroundPadding:     Number(bgPadding.value),
    backgroundBorderRadius: Number(bgRadius.value),
    outlineWidth:          Number(outlineWidth.value),
    outlineColor:          outlineColorPick.value,
    textAlign:             textAlign.value,
    verticalPosition:      Number(verticalPosition.value),
    letterSpacing:         Number(letterSpacing.value),
    lineHeight:            Number(lineHeight.value),
    textTransform:         textTransform.value,
    maxWidth:              Number(maxWidth.value),
  };
}

// ─── Save ─────────────────────────────────────────────────────────────────────

function saveSettings() {
  const s = readUI();
  chrome.runtime.sendMessage({ type: "SAVE_SETTINGS", settings: s, activePreset }, (response) => {
    if (chrome.runtime.lastError || !response?.ok) {
      showToast("Failed to save settings", "err");
      return;
    }
    currentSettings = s;
    isDirty = false;
    showToast("Settings saved ✓", "ok");
  });
}

// ─── Shadow visibility ────────────────────────────────────────────────────────

function updateShadowDetailVisibility() {
  const isNone = textShadow.value === "none" || textShadow.value === "hard";
  shadowDetails.forEach((el) => el.classList.toggle("hidden", isNone));
}

// ─── Color ↔ hex sync ────────────────────────────────────────────────────────

function syncColorHex(picker, hexInput) {
  picker.addEventListener("input", () => {
    hexInput.value = picker.value;
    onChange();
  });
  hexInput.addEventListener("input", () => {
    const v = hexInput.value;
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      picker.value = v;
      onChange();
    }
  });
}

syncColorHex(colorPicker,    colorHex);
syncColorHex(shadowColorPick, shadowColorHex);
syncColorHex(outlineColorPick, outlineColorHex);
syncColorHex(bgColorPick,    bgColorHex);

// ─── onChange: live-preview + dirty flag ─────────────────────────────────────

function onChange() {
  const s = readUI();
  activePreset = "custom";
  document.querySelectorAll(".preset-card").forEach((c) => c.classList.remove("active"));
  updatePreview(s);
  isDirty = true;
}

// Wire all controls to onChange
[
  fontFamily, fontSize, fontWeight, fontStyle, letterSpacing, lineHeight, textTransform,
  opacitySlider, textShadow, shadowBlur, shadowOffsetX, shadowOffsetY,
  outlineWidth, bgOpacity, bgPadding, bgRadius, textAlign, verticalPosition, maxWidth,
  masterToggle,
].forEach((el) => el.addEventListener("input", onChange));

[fontWeight, fontStyle, textTransform, textShadow, textAlign].forEach((el) =>
  el.addEventListener("change", onChange)
);

// Value badge updates
fontSize.addEventListener("input",        () => { fontSizeVal.textContent        = fontSize.value + "%"; });
letterSpacing.addEventListener("input",   () => { letterSpacingVal.textContent   = letterSpacing.value + "px"; });
lineHeight.addEventListener("input",      () => { lineHeightVal.textContent      = lineHeight.value; });
opacitySlider.addEventListener("input",   () => { opacityVal.textContent         = Math.round(opacitySlider.value * 100) + "%"; });
shadowBlur.addEventListener("input",      () => { shadowBlurVal.textContent      = shadowBlur.value + "px"; });
shadowOffsetX.addEventListener("input",   () => { shadowOffsetXVal.textContent   = shadowOffsetX.value + "px"; });
shadowOffsetY.addEventListener("input",   () => { shadowOffsetYVal.textContent   = shadowOffsetY.value + "px"; });
outlineWidth.addEventListener("input",    () => { outlineWidthVal.textContent    = outlineWidth.value + "px"; });
bgOpacity.addEventListener("input",       () => { bgOpacityVal.textContent       = Math.round(bgOpacity.value * 100) + "%"; });
bgPadding.addEventListener("input",       () => { bgPaddingVal.textContent       = bgPadding.value + "px"; });
bgRadius.addEventListener("input",        () => { bgRadiusVal.textContent        = bgRadius.value + "px"; });
verticalPosition.addEventListener("input",() => { verticalPositionVal.textContent = verticalPosition.value + "%"; });
maxWidth.addEventListener("input",        () => { maxWidthVal.textContent        = maxWidth.value + "%"; });
textShadow.addEventListener("change",     updateShadowDetailVisibility);

// ─── Preset cards ─────────────────────────────────────────────────────────────

document.querySelectorAll(".preset-card").forEach((card) => {
  card.addEventListener("click", () => {
    const key = card.dataset.preset;
    const preset = PRESETS[key];
    if (!preset) return;
    activePreset = key;
    populateUI(preset.settings);
    isDirty = true;
    navigateTo("typography");
  });
});

// ─── Header buttons ──────────────────────────────────────────────────────────

btnSave.addEventListener("click", saveSettings);

btnReset.addEventListener("click", () => {
  if (!confirm("Reset all settings to Netflix Default?")) return;
  activePreset = "netflix_default";
  populateUI(PRESETS.netflix_default.settings);
  saveSettings();
});

masterToggle.addEventListener("change", onChange);

// ─── Export ───────────────────────────────────────────────────────────────────

btnExport.addEventListener("click", () => {
  const s = readUI();
  const blob = new Blob(
    [JSON.stringify({ schemaVersion: 1, activePreset, settings: s }, null, 2)],
    { type: "application/json" }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "netflix-subtitle-styler-settings.json";
  a.click();
  URL.revokeObjectURL(url);
  showToast("Settings exported ✓", "ok");
});

// ─── Import ───────────────────────────────────────────────────────────────────

btnImport.addEventListener("click", () => importFile.click());

importFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      if (!data.settings) throw new Error("Invalid format");
      activePreset = data.activePreset ?? "custom";
      populateUI(data.settings);
      isDirty = true;
      showToast("Settings imported ✓", "ok");
    } catch {
      showToast("Invalid settings file", "err");
    }
  };
  reader.readAsText(file);
  importFile.value = "";
});

// ─── Unsaved changes warning ──────────────────────────────────────────────────

window.addEventListener("beforeunload", (e) => {
  if (isDirty) {
    e.preventDefault();
    e.returnValue = "";
  }
});

// ─── Init ─────────────────────────────────────────────────────────────────────

chrome.runtime.sendMessage({ type: "GET_SETTINGS" }, (response) => {
  if (!response) {
    showToast("Could not load settings", "err");
    return;
  }
  activePreset = response.activePreset ?? "netflix_default";
  populateUI(response.settings);
  navigateTo("presets");
});
