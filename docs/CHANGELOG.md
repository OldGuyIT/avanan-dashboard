
All notable changes to this project will be documented in this file.

---

## [Unreleased]

## [Unreleased]

- Multi-User login with 2FA

**Reason:**  
To support companies with multiple users who need to input requests, the dashboard will add user authentication and optional two-factor authentication (2FA). This will allow secure, individualized access for each team member.

- Theme based css using DaisyUI or Tailwind

**Reason:**
To support companies who would like to theme the application based on their company colors.
---

## 1.0.0 — 2025-05-26

- Initial public release
- Full-stack dashboard with:
  - React (Vite) frontend
  - Flask backend with PostgreSQL
  - CSV upload/download for tenant/domain management
  - IP enrichment for Avanan alerts
  - Docker Compose support
  - Setup and troubleshooting documentation