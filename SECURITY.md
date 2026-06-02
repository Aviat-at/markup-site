# Security Policy

## Supported Versions

This is a personal blog and knowledge base. Only the latest deployment at [blog.akashtharindu.com](https://blog.akashtharindu.com) is actively maintained.

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please **do not open a public GitHub issue**.

Instead, report it privately by emailing:

**akashtharindu78@gmail.com**

Please include:
- A description of the vulnerability
- Steps to reproduce it
- Potential impact

I will respond within **72 hours** and aim to resolve confirmed issues within **7 days**.

## Scope

| In scope | Out of scope |
|----------|-------------|
| XSS or injection via rendered Markdown content | Vulnerabilities in third-party dependencies (report upstream) |
| Sensitive data exposure in the repository | Issues with Vercel or Cloudflare infrastructure |
| Misconfigured headers or CSP issues | Social engineering |

## Notes

- This project contains no user authentication, no database, and no user-submitted content.
- All content is static Markdown rendered at build time.
- No personal data is collected or stored.
