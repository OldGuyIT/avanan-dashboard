# Docker Compose Guide

This document explains how to use and customize the `docker-compose.yml` file for the Avanan Dashboard project.

---

## Overview

The `docker-compose.yml` file defines three services:

- **db**: PostgreSQL database
- **backend**: Flask API server
- **frontend**: React (Vite) frontend

All services are orchestrated together for easy local development and deployment.

---

## Environment Variables and Credentials

### Changing PostgreSQL Credentials

You can change the database name, user, and password in the `db` service:

```yaml
services:
  db:
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypass
```

**Important:**  
You must also update these variables in the `backend` service so the Flask app can connect:

```yaml
  backend:
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypass
      POSTGRES_HOST: db
```

No code changes are needed—just update the environment variables in `docker-compose.yml`.

---

## Ports

- **Frontend:** Exposed on `5173` (default Vite port)
- **Backend:** Exposed on `8000`
- **PostgreSQL:** Exposed on `5432`

You can change these ports in the `ports` section of each service if needed.

---

## Persistent Database Storage

The database uses a Docker volume for persistent storage:

```yaml
volumes:
  postgres_data:
```

This ensures your data is not lost when containers are stopped or rebuilt.

---

## Environment Variables and Credentials

Use the `.env.example` file as a template for your environment variables.  
Copy it to `.env` and adjust values as needed.

---

## Building and Running

To build and start all services:

```sh
docker-compose up --build
```

To stop:

```sh
docker-compose down
```

---

## Customizing Further

- **Add environment variables** as needed to the `backend` or `frontend` services.
- **Add more services** (e.g., for testing, caching) as your project grows.
- **Use `.env` files** if you want to keep secrets out of `docker-compose.yml` (see Docker Compose docs).

---

## Troubleshooting

- If the backend cannot connect to the database, double-check that the credentials and host match in both `db` and `backend` services.
- If you change ports, update your URLs accordingly.
- For advanced Docker Compose usage, see the [official documentation](https://docs.docker.com/compose/).

---

## Questions?

Open an issue or check the main [README.md](../README.md) for more details.