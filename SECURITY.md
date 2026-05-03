# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          | Status              |
|---------|-------------------|---------------------|
| 1.x     | ✅ Yes            | Actively maintained |
| < 1.0   | ❌ No             | Please upgrade      |

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

We take security seriously and appreciate your responsible disclosure. Please choose one of the following methods:

### Option 1: GitHub Private Vulnerability Reporting (Preferred)
1. Go to the repository's **Security** tab
2. Click **Report a vulnerability**
3. Fill out the form with details

### Option 2: Direct Contact
If you prefer, you can email the maintainer directly. Contact information is available on the [author's GitHub profile](https://github.com/raafy).

### What to Include
To help us respond quickly, please provide:
- **Description**: Clear explanation of the vulnerability
- **Steps to Reproduce**: Detailed instructions or proof-of-concept
- **Impact Assessment**: What could an attacker do with this?
- **Affected Versions**: Which extension versions are impacted?
- **Suggested Fix**: (Optional) Your recommendations for remediation

### Response Timeline
- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 7 days
- **Patch Released**: As soon as possible, depending on severity
- **Credit**: You'll be acknowledged in the changelog (unless you prefer anonymity)

## Security Design

This extension is designed with security and privacy in mind:

### Permissions (Minimal)
| Permission | Purpose | Justification |
|------------|---------|---------------|
| `storage` | Save user settings | Required for settings persistence |
| `activeTab` | Detect Netflix tabs | Used only for message passing |
| `tabs` | Apply settings to open Netflix tabs | Limited to `*.netflix.com` URLs |

### Host Permissions (Restricted)
- **Only** `*.netflix.com/*` — The extension cannot access any other websites
- No access to banking, email, or other sensitive sites

### Data Handling (Local Only)
- ✅ Settings stored via `chrome.storage.sync` (user's own browser profile)
- ✅ No external network requests
- ✅ No analytics or telemetry
- ✅ No data collection of any kind
- ✅ No third-party service integrations

### Code Execution (Isolated)
- Content script runs in isolated context
- No inline event handlers
- No `eval()` or dynamic code execution
- CSP-compliant

## Security Best Practices for Users

1. **Install only from official sources**:
   - Chrome Web Store (coming soon)
   - Firefox Add-ons (coming soon)
   - GitHub releases (verified)

2. **Verify the extension ID** after installation

3. **Review permissions** when prompted — should only request storage and tab permissions

4. **Keep updated** to receive security patches

## Disclosure Policy

We follow a **coordinated disclosure** approach:
- Vulnerability is reported privately
- We work with the reporter to fix the issue
- Patch is released
- Public disclosure after 30 days (or sooner by mutual agreement)

This gives users time to update before vulnerability details are public.

---

*This security policy is inspired by the [GitHub Security Lab](https://securitylab.github.com/) best practices.*
