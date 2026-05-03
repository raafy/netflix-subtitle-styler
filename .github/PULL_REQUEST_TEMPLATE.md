## Summary

<!-- Provide a clear, concise summary of what this PR does -->
<!-- Example: "Adds a new 'Outline Opacity' setting that allows users to control text outline transparency" -->

Fixes #(issue number) <!-- If this PR addresses an issue, link it here -->

## Type of Change

<!-- Please check the relevant option(s) -->

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 🎨 New preset
- [ ] 📚 Documentation update
- [ ] ♻️ Refactor / code cleanup
- [ ] 🧪 Test improvements
- [ ] 🚀 Performance improvement
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)

## Changes Made

<!-- Describe the specific changes in bullet points -->

- 
- 
- 

## Testing

<!-- Please confirm what you've tested -->

### Browsers Tested
- [ ] Chrome (version: <!-- e.g., 124 -->)
- [ ] Edge (version: <!-- e.g., 124 -->)
- [ ] Firefox (version: <!-- e.g., 125 -->)

### Features Verified
- [ ] Extension loads without errors in `chrome://extensions`
- [ ] Popup UI displays correctly
- [ ] Options page navigation works
- [ ] Live preview updates immediately
- [ ] Settings persist after browser restart
- [ ] Export/Import JSON functions work
- [ ] Presets apply correctly

### Netflix Scenarios
- [ ] Tested with video playing and subtitles visible
- [ ] Tested SPA navigation (video → browse → new video)
- [ ] Tested with multiple subtitle languages (if applicable)

## Screenshots / Recordings

<!-- If UI changes were made, please include before/after screenshots or a screen recording -->

| Before | After |
|--------|-------|
| <!-- Screenshot 1 --> | <!-- Screenshot 2 --> |

## Checklist

### Code Quality
- [ ] Code follows the style guide in [CONTRIBUTING.md](../CONTRIBUTING.md)
- [ ] No `var` declarations — using `const`/`let` only
- [ ] JSDoc comments added/updated for public functions
- [ ] No `console.log` statements left in production code
- [ ] `content/content.js` remains self-contained (no ES module imports)

### Architecture
- [ ] Settings schema changes are reflected in `src/settings.js`
- [ ] New presets are added to all three locations (`src/presets.js`, `options/options.js`, `popup/popup.js`)
- [ ] CSS injection logic in `content/content.js` matches `src/style-builder.js`

### Documentation
- [ ] [CHANGELOG.md](../CHANGELOG.md) updated with user-visible changes
- [ ] [README.md](../README.md) updated if new features added
- [ ] This PR description is clear and complete

## Additional Notes

<!-- Anything else reviewers should know? -->
<!-- Technical details, design decisions, potential edge cases -->
