# Avanan Dashboard

A full-stack dashboard for [Avanan](https://www.avanan.com/) alerts, built with [React (Vite)](https://vitejs.dev/), [Flask](https://flask.palletsprojects.com/), and [PostgreSQL](https://www.postgresql.org/).  
Includes CSV upload/download for tenant/domain management, IP enrichment, and a modern UI.

---

**Notes:**  
Hello! I wanted to share a bit about this project and my motivation for building it.

My experience with web development started back in the old MySpace days with basic HTML/CSS, and this is my first full application/web page.  
  
In our environment, we receive 20–30 Avanan suspicious login alerts with medium or low severity every day. I needed a way to review all these alerts efficiently and spot patterns in user logins and IP addresses.  
  
Before this dashboard, it was difficult to build reliable allow-lists for each tenant. Now, with this project, I can visualize login activity, identify trends, and make informed decisions about allow-lists for each tenant in Avanan.

I hope this tool can help others in similar situations, and I welcome any feedback or contributions!

---

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**For a detailed setup and troubleshooting guide, see [docs/full-guide.md](docs/full-guide.md).**

---

## Features

- Modern dashboard UI for Avanan alerts
- CSV upload/download for tenant/domain management
- IP enrichment for alert sources
- Docker Compose for easy deployment
- REST API backend with Flask
- PostgreSQL database integration

---

## Expected Directory Structure

```
avanan-dashboard/
├── backend/
│   ├── app.py
│   ├── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
├── docker-compose.yml
├── README.md
├── docs/
│   ├── full-guide.md
│   ├── sample-entry.md
```

---

## Quick Start

### 1. Clone the repository

```sh
git clone https://github.com/OldGuyIT/avanan-dashboard.git
cd avanan-dashboard
```

### 2. Configure Database Credentials (Optional)

You can change the PostgreSQL username, password, and database name in `docker-compose.yml`:

```yaml
services:
  db:
    environment:
      POSTGRES_DB: avanan
      POSTGRES_USER: avanan
      POSTGRES_PASSWORD: avanan
```

If you change these, **make sure to update the corresponding environment variables in the `backend` service as well** so they match.  
The backend reads these values from environment variables at runtime—no code changes are needed.

---

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update values as needed:

```sh
cp .env.example .env
```

Edit `.env` to match your setup.

---

### 4. Build and Run with Docker Compose

```sh
docker compose up --build
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **PostgreSQL:** localhost:5432

---

## CSV Template for Tenant / Domains List

- Download the template from the UI or use this format:

```csv
tenant_name,domain
"Example Tenant, Inc.",example.com
```

> **Note:** If a tenant name contains a comma, wrap it in double quotes.

- Upload the CSV via the dashboard UI under the "Tenants/Domains" section.

---

## Sample Data for Dashboard Testing

To test dashboard features, including the "Top 5 Users" and "Top 5 Tenants" sections, use the sample event entries in [docs/sample-entry.md](docs/sample-entry.md).

---

## Documentation

- [Full Setup & Troubleshooting Guide](docs/full-guide.md)
- [Sample Event Entries for Dashboard Testing](docs/sample-entry.md)
- [Docker Compose Usage](docs/docker-compose.md) *(if available)*

---

## Contributing

Contributions are welcome!  
Please open issues or pull requests. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Credits

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Flask](https://flask.palletsprojects.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)

---

## Contact

For questions or support, open an issue and I will get to it as soon as I can.
