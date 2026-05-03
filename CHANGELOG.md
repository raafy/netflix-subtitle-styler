# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-05-03

### Added
- Initial release.
- Five built-in presets: **Netflix Default**, **Crunchyroll**, **Accessibility**, **Cinema**, **Minimal**.
- Popup with master toggle, preset selector, and quick-access sliders (size, opacity, color, position).
- Full options page with seven setting categories:
  - Presets
  - Typography (font family, size, weight, style, letter spacing, line height, transform)
  - Color & Opacity
  - Shadow & Outline (drop shadow, hard shadow, `-webkit-text-stroke` outline)
  - Background (color, opacity, padding, border radius)
  - Layout & Position (alignment, vertical position, max width)
  - Advanced (export / import JSON)
- Live preview bar in the options page.
- Export / import settings as a JSON file.
- MutationObserver in the content script to survive Netflix SPA navigation.
- Manifest V3 service worker.
- Cross-browser compatible structure (Chrome / Edge / Firefox with MV3 support).
