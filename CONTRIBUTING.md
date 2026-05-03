# Contributing to Netflix Subtitle Styler

Thank you for your interest in contributing! This guide will help you get started with the development environment and understand our workflow.

> 💡 **New to open source?** No problem! Issues labeled [`good first issue`](https://github.com/raafy/netflix-subtitle-styler/labels/good%20first%20issue) are great places to start.

---

## Quick Links

- 📖 [Project README](../README.md)
- 🐛 [Issue Tracker](https://github.com/raafy/netflix-subtitle-styler/issues)
- 📋 [Pull Request Template](PULL_REQUEST_TEMPLATE.md)
- 🔒 [Security Policy](../SECURITY.md)

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Submitting Changes](#submitting-changes)
- [Adding a Preset](#adding-a-preset)
- [Style Guide](#style-guide)
- [Questions?](#questions)

---

## Code of Conduct

This project adheres to a standard of professional, constructive interaction. Please:

- Be respectful and inclusive in all communications
- Welcome newcomers and help them learn
- Focus on constructive feedback rather than criticism
- Assume good intentions from others

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

## Submitting Changes

### Workflow

1. **Fork and branch**: Create a feature branch from `main`
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make changes**: Follow the [Style Guide](#style-guide) below

3. **Test thoroughly**:
   - Test in Chrome and Firefox if possible
   - Verify the live preview in options page works
   - Check that popup controls update immediately

4. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: add outline color opacity control
   fix: prevent style reset on Netflix SPA navigation  
   docs: improve preset descriptions
   refactor: extract color utility functions
   test: add manifest validation tests
   ```

5. **Push and create PR**: Fill out the [Pull Request Template](PULL_REQUEST_TEMPLATE.md) with:
   - Clear description of what changed and why
   - Screenshots if UI was modified
   - Testing steps for reviewers

### PR Checklist

- [ ] Code follows the style guide (no `var`, proper JSDoc)
- [ ] `content/content.js` remains self-contained (no ES module imports)
- [ ] All presets updated if settings schema changed
- [ ] CHANGELOG.md updated for user-visible changes
- [ ] README.md updated if new features added

---

## Adding a Preset

Want to add a new built-in preset? Here's the complete checklist:

1. **Define in `src/presets.js`**:
   ```js
   my_preset: {
     label: "My Preset",
     description: "A short description shown in the UI.",
     settings: { /* all SubtitleSettings fields */ },
   },
   ```

2. **Mirror to options page** (`options/options.js`):
   - Copy the settings object to the `PRESETS` constant
   - Add a preset card in `options/options.html`

3. **Mirror to popup** (`popup/popup.js`):
   - Add to `PRESET_META` constant (label + description only)
   - Add `<option>` in `popup/popup.html`

> ⚠️ **Important**: Presets must be synchronized across all three locations until we implement a shared module system.

---

## Style Guide

- **No build step** — the extension loads plain JS/CSS directly. Do not introduce bundlers or transpilers without discussion.
- Use `const` / `let`; never `var`.
- JSDoc types for all public functions.
- CSS custom properties (variables) for all colors and spacing — avoid magic numbers.
- `!important` is allowed **only** in `content/content.js` (needed to override Netflix inline styles).
- Keep `content.js` self-contained — no ES module imports (content scripts run in a special context).

---

## Questions?

- 🐛 **Found a bug?** [Open an issue](https://github.com/raafy/netflix-subtitle-styler/issues/new?template=bug_report.md)
- 💡 **Have an idea?** [Request a feature](https://github.com/raafy/netflix-subtitle-styler/issues/new?template=feature_request.md)
- 🔒 **Security issue?** See [SECURITY.md](../SECURITY.md) for private reporting
- 💬 **General question?** [Start a discussion](https://github.com/raafy/netflix-subtitle-styler/discussions)

Thank you for contributing! 🎉
