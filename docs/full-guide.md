# Troubleshooting Guide

This guide covers common issues and solutions when running the Avanan Dashboard with Docker Compose.

---

## 1. Containers Won't Start or Exit Immediately

- **Check logs:**  
  Run `docker compose logs <service>` (e.g., `docker compose logs backend`) to see error messages.
- **Common causes:**  
  - Missing or incorrect environment variables.
  - Port conflicts (another service already using 5432, 8000, or 5173).
  - Syntax errors in `docker-compose.yml`.

---

## 2. Backend Cannot Connect to Database

- **Symptoms:**  
  Backend logs show connection errors or timeouts.
- **Solutions:**  
  - Ensure `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_HOST` match in both `db` and `backend` services.
  - Make sure `POSTGRES_HOST` is set to `db` (the service name).
  - Wait a few seconds and restart the backend (`docker compose restart backend`)—the database may not be ready yet.
  - Check for typos in environment variable names.

---

## 3. Database Data Not Persisting

- **Symptoms:**  
  Data disappears after restarting containers.
- **Solutions:**  
  - Ensure you are using a persistent volume:
    ```yaml
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ```
  - If using a host directory, make sure the directory exists and is writable.

---

## 4. Frontend Not Loading or Showing Errors

- **Symptoms:**  
  Blank page, 404 errors, or "Cannot connect to backend" messages.
- **Solutions:**  
  - Make sure the frontend is running (`docker compose ps`).
  - Check the browser console for errors.
  - Ensure the backend is running and accessible at the expected URL (`http://localhost:8000`).
  - If you changed ports, update API URLs in the frontend code or environment.

---

## 5. IP Enrichment Not Working or Rate Limited

- **Symptoms:**  
  No enrichment data, errors from ip-api.com, or "rate limit exceeded" messages.
- **Solutions:**  
  - The free tier of [ip-api.com](http://ip-api.com/) allows 45 requests per minute per IP.
  - If you need more, set the `IP_API_URL` environment variable in the backend service to use a different provider or a paid plan.
  - Check backend logs for error messages from the enrichment API.

---

## 6. Docker Compose Version Issues

- **Symptoms:**  
  Errors like "unsupported Compose file version" or unknown keys.
- **Solutions:**  
  - Make sure you have Docker Compose v2 or later:  
    `docker compose version`
  - Upgrade Docker and Docker Compose if needed.

---

## 7. File Permission Issues

- **Symptoms:**  
  Errors about permission denied, especially with volumes or host directories.
- **Solutions:**  
  - Ensure your user has permission to read/write the project directory.
  - If using a host directory for Postgres data, make sure it is owned by your user or adjust permissions.

---

## 8. Port Already in Use

- **Symptoms:**  
  Errors like "port is already allocated".
- **Solutions:**  
  - Stop other services using the same port.
  - Change the port mapping in `docker-compose.yml`.

---

## 9. General Debugging Tips

- Use `docker compose ps` to see running containers.
- Use `docker compose logs <service>` to view logs.
- Use `docker compose down -v` to remove containers and volumes (warning: this deletes data).
- Restart individual services with `docker compose restart <service>`.

---

## Still Stuck?

- Check the [README.md](../README.md) and [docker-compose.md](./docker-compose.md) for more info.
- Open an issue on GitHub with your error messages and setup details.