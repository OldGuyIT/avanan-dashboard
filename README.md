# Avanan Dashboard

A full-stack dashboard for [Avanan](https://www.avanan.com/) alerts, built with [React (Vite)](https://vitejs.dev/), [Flask](https://flask.palletsprojects.com/), and [PostgreSQL](https://www.postgresql.org/).  
Includes CSV upload/download for tenant/domain management, IP enrichment, and a modern UI.

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
```

## Quick Start

### 1. Clone the repository

```sh
git clone https://github.com/oldguyit/avanan-dashboard.git
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

For more advanced Docker Compose usage, see [docs/docker-compose.md](docs/docker-compose.md) (if available).

---

### 3. Build and Run with Docker Compose

```sh
docker-compose up --build
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **PostgreSQL:** localhost:5432

---

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update values as needed:

```sh
cp .env.example .env
```

Edit `.env` to match your setup.

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

## Documentation

- [Full Setup & Troubleshooting Guide](docs/full-guide.md)
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

For questions or support, open an issue or contact [your email/contact info].
