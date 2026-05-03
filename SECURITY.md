# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.x     | ✅ Yes    |

## Reporting a Vulnerability

If you discover a security issue, **please do not open a public GitHub issue**.

Instead, email the maintainer directly or use GitHub's private vulnerability reporting feature:  
**Security → Report a vulnerability** on the repository page.

Please include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes (optional)

You will receive a response within **7 days**. If the issue is confirmed, a patch will be released as soon as possible and you will be credited in the changelog (unless you prefer anonymity).

## Scope

This extension:
- Only runs on `*.netflix.com` pages.
- Requests only the `storage` and `activeTab` permissions.
- Does not make any external network requests.
- Does not collect or transmit any user data.

Settings are stored locally via `chrome.storage.sync` and synced only to the user's own Chrome/Firefox profile.
