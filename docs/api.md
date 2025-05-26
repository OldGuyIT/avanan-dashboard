# API Reference

This document describes the main API endpoints for the Avanan Dashboard backend.

---
### IP Enrichment API Usage

This project uses [ip-api.com](http://ip-api.com/) for IP enrichment by default.  
**Note:** The free tier of ip-api.com allows up to 45 requests per minute from an IP address.  
If you expect to exceed this limit, you can set a different IP enrichment API endpoint using the `IP_API_URL` environment variable in your `docker-compose.yml` (see below).


## Tenant Domains

### `GET /api/tenant-domains`
- **Description:** List all tenant/domain pairs.
- **Response:**  
  ```json
  [
    { "tenant_name": "Example Tenant", "domain": "example.com" },
    ...
  ]
  ```

### `POST /api/tenant-domains`
- **Description:** Add or update a tenant/domain pair.
- **Body:**  
  ```json
  { "tenant_name": "Example Tenant", "domain": "example.com" }
  ```
- **Response:**  
  ```json
  { "status": "success" }
  ```

### `DELETE /api/tenant-domains`
- **Description:** Delete a tenant/domain pair.
- **Body:**  
  ```json
  { "domain": "example.com" }
  ```
- **Response:**  
  ```json
  { "status": "deleted" }
  ```

---

## Avanan Alerts

### `POST /api/new-entry`
- **Description:** Add a new Avanan alert entry (with IP enrichment).
- **Body:**  
  ```json
  {
    "timestamp": "2025-05-25 13:46:10",
    "tenant": "example.com",
    "email": "user@example.com",
    "ip1": "1.2.3.4",
    "ip2": "5.6.7.8"
  }
  ```
- **Response:**  
  ```json
  { "status": "success", "id": 42 }
  ```

### `GET /api/entry/<id>`
- **Description:** Get a single entry by ID.
- **Response:**  
  ```json
  {
    "id": 42,
    "timestamp": "...",
    "tenant": "...",
    ...
  }
  ```

### `DELETE /api/entry/<id>`
- **Description:** Delete an entry by ID.
- **Response:**  
  ```json
  { "status": "deleted" }
  ```

### `GET /api/last-entry`
- **Description:** Get the most recent entry.
- **Response:**  
  ```json
  { ... }
  ```

### `GET /api/last-entries`
- **Description:** Get the 7 most recent entries.
- **Response:**  
  ```json
  [ ... ]
  ```

### `GET /api/all-entries`
- **Description:** Get all entries.
- **Response:**  
  ```json
  [ ... ]
  ```

---

## Parsing

### `POST /api/parse-entry`
- **Description:** Parse a raw Avanan alert (for debugging).
- **Body:**  
  ```json
  { ... }
  ```
- **Response:**  
  ```json
  { "parsed": { ... } }
  ```

---

## Notes

- All endpoints return JSON.
- For authentication or advanced usage, see future documentation.