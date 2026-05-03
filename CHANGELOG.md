# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Portfolio-grade GitHub repository improvements
  - Enhanced README with hero section and tech stack showcase
  - Comprehensive CONTRIBUTING.md with professional guidelines
  - Improved issue and PR templates
  - Enhanced CI/CD with additional validation checks
  - Comprehensive SECURITY.md with detailed disclosure policy

### Changed
- Issue templates now use GitHub forms format
- CI workflow now includes project structure validation
- PR template includes comprehensive testing checklist

---

## [1.0.0] - 2026-05-03

### Added
- **Initial Release** — Complete Netflix subtitle customization extension
- **Five Built-in Presets**:
  - Netflix Default — Restores Netflix's original subtitle appearance
  - Crunchyroll — Bold white text with thick black outline (anime fansub style)
  - Accessibility — Large yellow text on semi-transparent black background
  - Cinema — Elegant italic serif with soft drop shadow
  - Minimal — Small, clean, semi-transparent text
- **Popup Interface** — Quick controls with master toggle, preset selector, and sliders
- **Full Options Page** — Seven setting categories:
  - Presets — One-click preset selection
  - Typography — Font family, size (50–200%), weight, style, spacing, line height, transform
  - Color & Opacity — Text color picker with hex input, opacity slider
  - Shadow & Outline — Drop shadow, hard 4-direction shadow, `-webkit-text-stroke` outline
  - Background — Color, opacity, padding, border radius
  - Layout & Position — Text alignment, vertical position, max width
  - Advanced — Export/import JSON, extension info
- **Live Preview** — Real-time preview bar in options page
- **Settings Persistence** — `chrome.storage.sync` for cross-device synchronization
- **Export/Import** — JSON backup and sharing of configurations
- **Technical Features**:
  - MutationObserver to survive Netflix SPA navigation
  - Manifest V3 service worker architecture
  - Cross-browser compatibility (Chrome, Edge, Firefox with MV3)
  - Self-contained content script for reliability
  - Dynamic CSS injection with `!important` overrides
- **CI/CD** — GitHub Actions workflow for linting and manifest validation
- **Documentation** — README, CONTRIBUTING guide, SECURITY policy
