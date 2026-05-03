/**
 * @file style-builder.js
 * @description Converts a SubtitleSettings object into a CSS string and
 *              generates the `text-shadow` / `-webkit-text-stroke` values.
 *
 * Netflix renders subtitles inside elements with the class `.player-timedtext-text-container`
 * and the actual text spans inside `.player-timedtext-text-container span`.
 * We inject a `<style>` tag that overrides those selectors with !important rules
 * so that Netflix's own inline styles are superseded.
 */

/** @typedef {import('./settings.js').SubtitleSettings} SubtitleSettings */

/**
 * Converts a hex color + opacity to a CSS `rgba()` string.
 *
 * @param {string} hex  - 6-digit hex color, e.g. "#000000".
 * @param {number} opacity - 0–1.
 * @returns {string}
 */
function hexToRgba(hex, opacity) {
  const cleaned = hex.replace("#", "");
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Builds the CSS `text-shadow` property value from settings.
 *
 * @param {SubtitleSettings} s
 * @returns {string}
 */
function buildTextShadow(s) {
  if (s.textShadow === "none") return "none";

  if (s.textShadow === "hard") {
    const c = s.shadowColor;
    return `2px 2px 0 ${c}, -2px -2px 0 ${c}, 2px -2px 0 ${c}, -2px 2px 0 ${c}`;
  }

  // drop-shadow
  return `${s.shadowOffsetX}px ${s.shadowOffsetY}px ${s.shadowBlur}px ${hexToRgba(s.shadowColor, 0.9)}`;
}

/**
 * Builds the CSS outline/stroke using `-webkit-text-stroke`.
 * Falls back gracefully where unsupported.
 *
 * @param {SubtitleSettings} s
 * @returns {{ webkitTextStroke: string; paintOrder: string }}
 */
function buildOutline(s) {
  if (!s.outlineWidth || s.outlineWidth === 0) {
    return { webkitTextStroke: "0px transparent", paintOrder: "stroke fill" };
  }
  return {
    webkitTextStroke: `${s.outlineWidth}px ${s.outlineColor}`,
    paintOrder: "stroke fill",
  };
}

/**
 * Generates the full CSS string to inject into the Netflix page.
 * Uses `!important` on every property to beat Netflix's inline styles.
 *
 * @param {SubtitleSettings} s
 * @returns {string} Raw CSS string ready to be inserted into a `<style>` element.
 */
export function buildSubtitleCSS(s) {
  if (!s.enabled) {
    return `
      /* Netflix Subtitle Styler — DISABLED */
      .player-timedtext { display: none !important; }
    `;
  }

  const textShadow = buildTextShadow(s);
  const { webkitTextStroke, paintOrder } = buildOutline(s);

  const bgColor = s.backgroundOpacity === 0
    ? "transparent"
    : hexToRgba(s.backgroundColor, s.backgroundOpacity);

  const hasBg = s.backgroundOpacity > 0;

  return `
/* ============================================================
   Netflix Subtitle Styler — injected styles
   ============================================================ */

/* Outer container: position + max-width */
.player-timedtext {
  position: absolute !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  transform: none !important;
  top: ${s.verticalPosition}% !important;
  bottom: unset !important;
  text-align: ${s.textAlign} !important;
  padding: 0 ${(100 - s.maxWidth) / 2}% !important;
  box-sizing: border-box !important;
}

/* Per-line wrapper */
.player-timedtext-text-container {
  background-color: ${bgColor} !important;
  padding: ${hasBg ? s.backgroundPadding * 0.1 + "em" : "0"} !important;
  border-radius: ${s.backgroundBorderRadius * 0.1}em !important;
  display: inline-block !important;
  max-width: 100% !important;
  margin: 2px 0 !important;
}

/* Text spans */
.player-timedtext-text-container span,
.player-timedtext span {
  font-family: ${s.fontFamily} !important;
  font-size: ${s.fontSize}% !important;
  font-weight: ${s.fontWeight} !important;
  font-style: ${s.fontStyle} !important;
  color: ${hexToRgba(s.color, s.opacity)} !important;
  text-shadow: ${textShadow} !important;
  -webkit-text-stroke: ${webkitTextStroke} !important;
  paint-order: ${paintOrder} !important;
  letter-spacing: ${s.letterSpacing * 0.05}em !important;
  line-height: ${s.lineHeight} !important;
  text-transform: ${s.textTransform} !important;
  background: transparent !important;
  text-decoration: none !important;
}
  `.trim();
}
