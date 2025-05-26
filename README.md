# Avanan Dashboard

A full-stack dashboard for Avanan alerts, built with React (Vite), Flask, and PostgreSQL.  
Includes CSV upload/download for tenant/domain management, IP enrichment, and a modern UI.

**For a detailed setup and troubleshooting guide, see [docs/full-guide.md](docs/full-guide.md).**

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

Quick Start    
                                                    
### 1. Clone the repository

```sh
git clone https://github.com/yourusername/avanan-dashboard.git
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

Additional Notes                                                  
                                                                             
## CSV Template for Tenant / Domains List

- Download the template from the UI or use this format:

tenant_name,domain
"Example Tenant, Inc.",example.com

*** If a tenant name contains a comma, wrap it in double quotes.

---

## License

MIT License

---

## Credits

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Flask](https://flask.palletsprojects.com/)
- [PostgreSQL](https://www.postgresql.org/)