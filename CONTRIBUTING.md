# Contributing to Netflix Subtitle Styler

Thank you for considering a contribution! This document explains how to get the project running locally and how to submit changes.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Adding a New Preset](#adding-a-new-preset)
- [Style Guide](#style-guide)

---

## Code of Conduct

Be respectful and constructive. Harassment of any kind will not be tolerated.

---

## Getting Started

### Prerequisites

- Google Chrome 109+ or Firefox 109+ (for Manifest V3 support)
- Git
- Node.js ≥ 18 (optional — only needed for icon generation and linting)

### Load the extension unpacked

1. Clone the repository:
   ```bash
   git clone https://github.com/raafy/netflix-subtitle-styler.git
   cd netflix-subtitle-styler
   ```

2. Open Chrome and navigate to `chrome://extensions`.

3. Enable **Developer mode** (top-right toggle).

4. Click **Load unpacked** and select the project root folder.

5. Open Netflix — the extension is now active.

### Firefox

1. Navigate to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on**.
3. Select `manifest.json` from the project root.

---

## Project Structure

```
netflix-subtitle-styler/
├── background/
│   └── service-worker.js     # MV3 service worker — settings persistence & message routing
├── content/
│   └── content.js            # Injected into netflix.com — CSS injection & DOM observer
├── icons/                    # Extension icons (PNG, 16/32/48/128px)
├── options/
│   ├── options.html          # Full settings page
│   ├── options.css
│   └── options.js
├── popup/
│   ├── popup.html            # Toolbar popup
│   ├── popup.css
│   └── popup.js
├── scripts/
│   ├── generate-icons.py     # Generate placeholder PNGs (stdlib only)
│   └── generate-icons.js     # Generate PNGs via `canvas` npm package
├── src/
│   ├── presets.js            # Built-in preset definitions
│   ├── settings.js           # Settings schema, storage helpers, defaults
│   └── style-builder.js      # Converts settings → CSS string
├── manifest.json
├── package.json
├── .eslintrc.json
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## Development Workflow

### Making changes

- **Subtitle CSS logic** → `content/content.js` and `src/style-builder.js`
- **Adding a setting** → `src/settings.js` (add field to typedef + `DEFAULT_SETTINGS`) → `options/options.html` (add control) → `options/options.js` (wire it up) → `popup/popup.js` if it belongs in quick controls
- **Adding a preset** → `src/presets.js` + copy the entry into the inline `PRESETS` objects in `options/options.js` and `popup/popup.js`

### Reload after changes

After editing any file, go to `chrome://extensions` and click the **refresh** icon on the extension card, then reload the Netflix tab.

### Linting

```bash
npm install
npm run lint
```

---

## Submitting a Pull Request

1. Fork the repository and create a branch from `main`:
   ```bash
   git checkout -b feat/my-feature
   ```
2. Make your changes following the [Style Guide](#style-guide).
3. Test on both Chrome and Firefox if possible.
4. Commit with a descriptive message using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: add stroke color opacity control
   fix: subtitle position reset on SPA navigation
   docs: update preset descriptions
   ```
5. Push and open a Pull Request against `main`.
6. Fill in the PR template — describe what changed and why.

---

## Adding a New Preset

1. Open `src/presets.js` and add your entry to the `PRESETS` object:
   ```js
   my_preset: {
     label: "My Preset",
     description: "A short description shown in the UI.",
     settings: {
       // all SubtitleSettings fields required
     },
   },
   ```

2. Mirror the same object (without the `label`/`description` wrapper) into:
   - `options/options.js` → the `PRESETS` constant at the top
   - `popup/popup.js` → the `PRESET_META` constant

3. Add a preset card in `options/options.html`:
   ```html
   <button class="preset-card" data-preset="my_preset">
     <div class="preset-card__badge" style="background:#your-color">XX</div>
     <div class="preset-card__name">My Preset</div>
     <div class="preset-card__desc">Short description</div>
   </button>
   ```

4. Add a `<option>` to the `<select>` in `popup/popup.html`.

---

## Style Guide

- **No build step** — the extension loads plain JS/CSS directly. Do not introduce bundlers or transpilers without discussion.
- Use `const` / `let`; never `var`.
- JSDoc types for all public functions.
- CSS custom properties (variables) for all colors and spacing — avoid magic numbers.
- `!important` is allowed **only** in `content/content.js` (needed to override Netflix inline styles).
- Keep `content.js` self-contained — no ES module imports (content scripts run in a special context).
