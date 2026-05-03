# Netflix Subtitle Styler

> Fully customize Netflix subtitles — font, size, color, outline, shadow, position, and more.  
> Comes with built-in presets including a **Crunchyroll-style** anime fansub look.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-brightgreen.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## Table of Contents

- [Features](#features)
- [Presets](#presets)
- [Screenshots](#screenshots)
- [Installation](#installation)
  - [Chrome / Edge (unpacked)](#chrome--edge-unpacked)
  - [Firefox (temporary)](#firefox-temporary)
  - [Chrome Web Store / Firefox Add-ons](#chrome-web-store--firefox-add-ons)
- [Usage](#usage)
- [Settings Reference](#settings-reference)
- [Architecture](#architecture)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- 🎨 **Full typography control** — font family, size (50–200%), weight, style, letter spacing, line height, text transform
- 🌈 **Color & opacity** — pick any text color with adjustable transparency
- 🖋 **Outline / stroke** — CSS `-webkit-text-stroke` for crisp anime-style outlines
- 🌑 **Shadow modes** — drop shadow (with blur + offset controls) or hard 4-direction shadow
- 📦 **Background box** — color, opacity, padding, and border radius
- 📐 **Layout** — text alignment, vertical position (% from top), max container width
- ⚡ **Live preview** — see changes in the options page before saving
- 💾 **Export / import** — back up or share your settings as a JSON file
- 🔄 **Persistent** — settings sync across your Chrome/Firefox profile via `chrome.storage.sync`
- 🏎 **Zero build step** — plain HTML/CSS/JS, load unpacked instantly

---

## Presets

| Preset | Description |
|--------|-------------|
| **Netflix Default** | Restores Netflix's original subtitle appearance |
| **Crunchyroll** | Bold white text with a thick black outline — classic anime fansub style |
| **Accessibility** | Large yellow text on a semi-transparent black background |
| **Cinema** | Elegant italic serif with a soft drop shadow |
| **Minimal** | Small, clean, semi-transparent text that stays out of the way |
| **Custom** | Your own configuration — tweak any setting individually |

---

## Screenshots

> _Screenshots will be added once the extension is loaded in a browser._  
> See the [Installation](#installation) section to try it live.

---

## Installation

### Chrome / Edge (unpacked)

> Use this method during development or before the extension is published to the Web Store.

1. Clone or download this repository:
   ```bash
   git clone https://github.com/raafy/netflix-subtitle-styler.git
   ```

2. Open Chrome and go to `chrome://extensions`.

3. Enable **Developer mode** using the toggle in the top-right corner.

4. Click **Load unpacked** and select the `netflix-subtitle-styler` folder.

5. The extension icon will appear in your toolbar. Navigate to Netflix and play anything with subtitles.

### Firefox (temporary)

> Firefox requires a signed extension for permanent installation. For development/testing:

1. Open Firefox and go to `about:debugging#/runtime/this-firefox`.

2. Click **Load Temporary Add-on…**

3. Select the `manifest.json` file inside the `netflix-subtitle-styler` folder.

> **Note:** Temporary add-ons are removed when Firefox restarts. For a persistent install, the extension must be signed via [Mozilla's Add-on Hub](https://addons.mozilla.org/developers/).

### Chrome Web Store / Firefox Add-ons

> Not yet published. Once available, links will be added here.

---

## Usage

### Popup (quick controls)

Click the extension icon in your browser toolbar while on Netflix:

- **Toggle** — enable or disable all subtitle styling instantly.
- **Preset selector** — switch between presets with one click.
- **Quick sliders** — adjust font size, opacity, color, and vertical position without opening the full settings.
- **Full Settings** — opens the options page for granular control.

### Options page

Right-click the extension icon → **Options**, or click **Full Settings ›** in the popup.

Navigate between sections using the sidebar:

| Section | Controls |
|---------|----------|
| **Presets** | One-click preset cards |
| **Typography** | Font family, size, weight, style, spacing, line height, transform |
| **Color & Opacity** | Text color picker + hex input, opacity slider |
| **Shadow & Outline** | Shadow mode, shadow color/blur/offset, outline width/color |
| **Background** | Background color, opacity, padding, border radius |
| **Layout & Position** | Text alignment, vertical position, max width |
| **Advanced** | Export / import JSON |

Changes are **live-previewed** in the preview bar at the top. Click **Save & Apply** to persist them across sessions.

### Export / Import

Use the **Export** and **Import** buttons in the options sidebar to save your configuration as a `.json` file. This lets you:
- Back up your settings
- Share a preset with others
- Restore settings on a new device

---

## Settings Reference

| Field | Type | Range / Options | Description |
|-------|------|----------------|-------------|
| `enabled` | boolean | — | Master toggle |
| `fontFamily` | string | Any CSS font stack | e.g. `"Arial, sans-serif"` |
| `fontSize` | number | 50–200 | Percent of base size |
| `fontWeight` | string | `normal`, `bold`, `100`–`900` | CSS font weight |
| `fontStyle` | string | `normal`, `italic`, `oblique` | CSS font style |
| `color` | string | Hex color | Text color |
| `opacity` | number | 0–1 | Text opacity |
| `textShadow` | string | `none`, `drop-shadow`, `hard` | Shadow mode |
| `shadowColor` | string | Hex color | Shadow color |
| `shadowBlur` | number | 0–20 | Shadow blur radius (px) |
| `shadowOffsetX` | number | -20–20 | Shadow horizontal offset (px) |
| `shadowOffsetY` | number | -20–20 | Shadow vertical offset (px) |
| `backgroundColor` | string | Hex color | Background box color |
| `backgroundOpacity` | number | 0–1 | Background opacity |
| `backgroundPadding` | number | 0–24 | Background padding (px) |
| `backgroundBorderRadius` | number | 0–20 | Background corner radius (px) |
| `outlineWidth` | number | 0–8 | Text outline width (px) |
| `outlineColor` | string | Hex color | Text outline color |
| `textAlign` | string | `left`, `center`, `right` | Text alignment |
| `verticalPosition` | number | 50–98 | Subtitle top position (% of viewport) |
| `letterSpacing` | number | -3–10 | Letter spacing (px) |
| `lineHeight` | number | 0.8–3 | Line height multiplier |
| `textTransform` | string | `none`, `uppercase`, `lowercase`, `capitalize` | CSS text transform |
| `maxWidth` | number | 20–100 | Container max width (% of viewport) |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Browser Toolbar                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │  popup/popup.html + popup.js                 │  │
│  │  Quick toggle · Preset · Sliders             │  │
│  └───────────────────┬──────────────────────────┘  │
│                      │ chrome.runtime.sendMessage   │
│  ┌───────────────────▼──────────────────────────┐  │
│  │  background/service-worker.js                │  │
│  │  • Stores settings (chrome.storage.sync)     │  │
│  │  • Pushes APPLY_SETTINGS to Netflix tabs     │  │
│  └───────────────────┬──────────────────────────┘  │
│                      │ chrome.tabs.sendMessage      │
│  ┌───────────────────▼──────────────────────────┐  │
│  │  content/content.js  (runs on netflix.com)   │  │
│  │  • Injects <style> into Netflix DOM          │  │
│  │  • MutationObserver keeps style alive        │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  options/options.html + options.js                  │
│  Full settings UI — live preview + save             │
└─────────────────────────────────────────────────────┘
```

### Key files

| File | Role |
|------|------|
| `manifest.json` | Extension manifest (Manifest V3) |
| `src/settings.js` | Settings schema, defaults, storage helpers |
| `src/presets.js` | Built-in preset definitions |
| `src/style-builder.js` | Converts settings → CSS string (used by content script logic) |
| `background/service-worker.js` | Persistence, tab messaging, install handler |
| `content/content.js` | Style injection + DOM observer (self-contained, no imports) |
| `popup/` | Toolbar popup UI |
| `options/` | Full settings page |

### Why `content.js` is self-contained

Content scripts in Chrome extensions cannot use ES module imports (`import … from`). The CSS-building logic from `src/style-builder.js` is therefore inlined directly into `content/content.js` to keep it a single plain script file.

---

## Development

```bash
# Clone
git clone https://github.com/raafy/netflix-subtitle-styler.git
cd netflix-subtitle-styler

# (Optional) Install dev tools
npm install

# Generate placeholder icons
npm run icons           # uses Python stdlib
npm run icons:canvas    # uses canvas npm package (better quality)

# Lint
npm run lint

# Package for distribution
mkdir -p dist
npm run zip:chrome
npm run zip:firefox
```

### Reloading during development

After any file change:
1. Go to `chrome://extensions`
2. Click the **↺ refresh** icon on the Netflix Subtitle Styler card
3. Reload the Netflix tab

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for:
- How to set up your dev environment
- The project structure explained
- How to add a new preset
- Commit message conventions
- Pull request process

---

## License

[MIT](LICENSE) © 2026 raafy
