/**
 * @file content.js
 * @description Content script injected into every Netflix page.
 *
 * Strategy:
 *  1. On load, fetch current settings from the service worker and inject CSS.
 *  2. Watch for DOM mutations so styles survive Netflix's SPA route changes
 *     and dynamic subtitle re-renders.
 *  3. Listen for APPLY_SETTINGS messages from the service worker / popup
 *     to hot-reload styles without a page refresh.
 */

(function () {
  "use strict";

  const STYLE_ELEMENT_ID = "nss-injected-styles";

  // ─── Helpers ───────────────────────────────────────────────────────────────

  /**
   * Injects or updates the <style> tag with the provided CSS.
   *
   * @param {string} css
   */
  function injectCSS(css) {
    let el = document.getElementById(STYLE_ELEMENT_ID);
    if (!el) {
      el = document.createElement("style");
      el.id = STYLE_ELEMENT_ID;
      (document.head ?? document.documentElement).appendChild(el);
    }
    el.textContent = css;
  }

  // ─── Style building (inline to avoid ES-module import in content scripts) ──

  /**
   * Converts a hex color + opacity to rgba().
   * @param {string} hex
   * @param {number} opacity
   * @returns {string}
   */
  function hexToRgba(hex, opacity) {
    const c = hex.replace("#", "");
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  /**
   * @param {object} s - SubtitleSettings
   * @returns {string}
   */
  function buildTextShadow(s) {
    if (s.textShadow === "none") return "none";
    if (s.textShadow === "hard") {
      const c = s.shadowColor;
      return `2px 2px 0 ${c}, -2px -2px 0 ${c}, 2px -2px 0 ${c}, -2px 2px 0 ${c}`;
    }
    return `${s.shadowOffsetX}px ${s.shadowOffsetY}px ${s.shadowBlur}px ${hexToRgba(s.shadowColor, 0.9)}`;
  }

  /**
   * @param {object} s - SubtitleSettings
   * @returns {string}
   */
  function buildCSS(s) {
    if (!s.enabled) {
      return `/* Netflix Subtitle Styler — DISABLED */
.player-timedtext { display: none !important; }`;
    }

    const textShadow = buildTextShadow(s);
    const stroke =
      s.outlineWidth > 0
        ? `${s.outlineWidth}px ${s.outlineColor}`
        : "0px transparent";
    const bgColor =
      s.backgroundColor === "transparent" || s.backgroundOpacity === 0
        ? "transparent"
        : hexToRgba(s.backgroundColor, s.backgroundOpacity);
    const hasBg = bgColor !== "transparent";

    return `/* Netflix Subtitle Styler */
.player-timedtext {
  max-width: ${s.maxWidth}vw !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  top: ${s.verticalPosition}% !important;
  bottom: unset !important;
  text-align: ${s.textAlign} !important;
}
.player-timedtext-text-container {
  background-color: ${bgColor} !important;
  padding: ${hasBg ? s.backgroundPadding + "px" : "0"} !important;
  border-radius: ${s.backgroundBorderRadius}px !important;
  display: inline-block !important;
  max-width: 100% !important;
  margin: 2px auto !important;
}
.player-timedtext-text-container span,
.player-timedtext span {
  font-family: ${s.fontFamily} !important;
  font-size: ${s.fontSize}% !important;
  font-weight: ${s.fontWeight} !important;
  font-style: ${s.fontStyle} !important;
  color: ${hexToRgba(s.color, s.opacity)} !important;
  text-shadow: ${textShadow} !important;
  -webkit-text-stroke: ${stroke} !important;
  paint-order: stroke fill !important;
  letter-spacing: ${s.letterSpacing}px !important;
  line-height: ${s.lineHeight} !important;
  text-transform: ${s.textTransform} !important;
  background: transparent !important;
}`;
  }

  // ─── Main ──────────────────────────────────────────────────────────────────

  /**
   * Fetches settings from the service worker and injects/removes CSS.
   */
  function applyCurrentSettings() {
    chrome.runtime.sendMessage({ type: "GET_SETTINGS" }, (response) => {
      if (chrome.runtime.lastError) return;
      if (!response) return;
      const css = buildCSS(response.settings);
      injectCSS(css);
    });
  }

  // Initial application
  applyCurrentSettings();

  // Hot-reload listener: service worker / popup push updates here
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "APPLY_SETTINGS" && message.settings) {
      const css = buildCSS(message.settings);
      injectCSS(css);
    }
  });

  // MutationObserver: Netflix rebuilds the subtitle DOM on each scene change.
  // We watch for the timedtext container being re-added and ensure our style
  // tag is always present.
  const observer = new MutationObserver(() => {
    if (!document.getElementById(STYLE_ELEMENT_ID)) {
      applyCurrentSettings();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
