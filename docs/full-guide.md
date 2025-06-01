# Avanan Dashboard Full Guide

This guide provides step-by-step instructions for setting up the Avanan Dashboard on **Debian** and **Ubuntu** systems using Docker Compose.

---

## 1. Clone the Repository

```sh
# Install git if not already installed
sudo apt update
sudo apt install -y git

# Clone the repository
git clone https://github.com/yourusername/avanan-dashboard.git
cd avanan-dashboard
```

---

## 2. Configure Database Credentials (Optional)

You can change the PostgreSQL username, password, and database name in `docker-compose.yml`.
Currently the `docker-compose.yml` uses `avanan` for POSTGRES_DB, POSTGRES_USER, and POSTGRES_PASSWORD.
If you change these values, make sure to update the same variables under the `backend` service in `docker-compose.yml` so they match.
No code changes are needed—just update the environment variables in `docker-compose.yml`.

**Example `docker-compose.yml` structure for credentials:**

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: examplechange
      POSTGRES_USER: examplechange
      POSTGRES_PASSWORD: examplechange
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    environment:
      POSTGRES_DB: examplechange # Must match database enviroments
      POSTGRES_USER: examplechange # Must match database enviroments
      POSTGRES_PASSWORD: examplechange # Must match database enviroments
      POSTGRES_HOST: db
    ports:
      - "8000:8000"
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## 2.1. Configure Environment Variables

Before running the project, copy the example environment file and edit as needed:

```sh
cp .env.example .env
```

Open `.env` in your editor and adjust any values to match your setup (such as database credentials or API URLs).  
This file is used by both the backend and frontend for configuration.

---

## 3. Build and Run with Docker Compose

### Install Docker and Docker Compose (if not already installed)

```sh
# Install Docker
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add your user to the docker group (optional, for running docker without sudo)
sudo usermod -aG docker $USER
# You may need to log out and back in for group changes to take effect

# Verify Docker is installed
docker --version
docker compose version
```

### Build and Run the Project

```sh
docker compose up --build
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **PostgreSQL:** localhost:5432

To stop the services:

```sh
docker compose down
```

---

## 4. CSV Template for Tenant / Domains List

- Download the template from the UI or use this format:

```csv
tenant_name,domain
"Example Tenant, Inc.",example.com
```

- If a tenant name contains a comma, wrap it in double quotes.

---

## 5. Sample Event Entries for Dashboard Testing

To test dashboard features and see how the UI displays top users/tenants, use the sample event entries in [docs/sample-entry.md](sample-entry.md).


---

## Troubleshooting

- If the backend cannot connect to the database, double-check that the credentials and host match in both `db` and `backend` services in `docker-compose.yml`.
- If you change ports, update your URLs accordingly.
- For advanced Docker Compose usage, see the [official documentation](https://docs.docker.com/compose/).

---

## Questions?

See the main [README.md](../README.md) or open an issue for more help.