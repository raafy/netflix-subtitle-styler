/**
 * @file presets.js
 * @description Built-in subtitle style presets.
 *
 * Each preset defines the full set of style options available to the user.
 * These values map 1:1 to the settings schema in settings.js.
 */

/** @typedef {import('./settings.js').SubtitleSettings} SubtitleSettings */

/**
 * @type {Record<string, { label: string; description: string; settings: SubtitleSettings }>}
 */
export const PRESETS = {
  netflix_default: {
    label: "Netflix Default",
    description: "Restores Netflix's original subtitle appearance.",
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
      backgroundColor: "transparent",
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
    description:
      "White text with a thick black outline, no background — the classic anime fansub look.",
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
      backgroundColor: "transparent",
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
    description:
      "High-contrast yellow text on a semi-transparent black background for maximum readability.",
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
    description:
      "Elegant white italic text with a soft shadow — inspired by theatrical subtitles.",
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
      backgroundColor: "transparent",
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
    description:
      "Small, clean, semi-transparent text that stays out of the way.",
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
      backgroundColor: "transparent",
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

/** The key used when the user has not yet selected a preset (custom/manual). */
export const CUSTOM_PRESET_KEY = "custom";
