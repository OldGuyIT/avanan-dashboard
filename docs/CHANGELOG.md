
All notable changes to this project will be documented in this file.

## Upcoming Changes ##

*Multi-User login with 2FA*
- To support companies with multiple users who need to input requests, the dashboard will add user authentication and optional two-factor authentication (2FA). This will allow secure, individualized access for each team member.

*Theme based css using DaisyUI or Tailwind*
-To support companies who would like to theme the application based on their company colors.

*API*
- Add API change to docker-compose for users to input their own API

*Display*
- New Entry Form:
  - Move Map and last entries
  - Highlight the entry that was inputed in table
- Dashboard:
  - Top 5 Tenants, Top 5 Entries, Top 5 IP Addresses, Top 5 ????
- Adjust sidebar and shrink
  
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
