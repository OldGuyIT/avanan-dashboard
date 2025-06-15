from flask import Flask, request, jsonify, g
import requests
import psycopg2
from psycopg2 import OperationalError, DatabaseError
from datetime import datetime
from flask_cors import CORS
import os
import re
import csv

app = Flask(__name__)
CORS(app)

def get_db():
    """Get a database connection for the current request context."""
    if 'db' not in g:
        try:
            g.db = psycopg2.connect(
                dbname=os.environ.get("POSTGRES_DB", "avanan"),
                user=os.environ.get("POSTGRES_USER", "avanan"),
                password=os.environ.get("POSTGRES_PASSWORD", "avanan"),
                host=os.environ.get("POSTGRES_HOST", "localhost")
            )
        except OperationalError as e:
            app.logger.error(f"Database connection failed: {e}")
            raise
    return g.db

@app.teardown_appcontext
def close_db(error):
    """Close the database connection at the end of the request."""
    db = g.pop('db', None)
    if db is not None:
        db.close()

def fetch_all_dicts(cur):
    """Return all rows from a cursor as a list of dicts."""
    rows = cur.fetchall()
    columns = [desc[0] for desc in cur.description]
    return [dict(zip(columns, row)) for row in rows]

def get_domain_from_email(email):
    """Extract the domain from an email address."""
    match = re.search(r'@([A-Za-z0-9.-]+)$', email)
    return match.group(1).lower() if match else None

def get_tenant_name_for_domain(conn, domain):
    """Look up the tenant name for a given domain, or return the domain if not found."""
    with conn.cursor() as cur:
        cur.execute("SELECT tenant_name FROM tenant_domains WHERE domain = %s", (domain,))
        row = cur.fetchone()
        return row[0] if row else domain  # fallback to domain if not found

@app.route("/api/new-entry", methods=["POST"])
def new_entry():
    """Add a new Avanan alert entry with IP enrichment."""
    data = request.json
    required_fields = ["timestamp", "ip1", "ip2"]
    missing = [f for f in required_fields if f not in data or not data[f]]
    if missing:
        return jsonify({"status": "error", "message": f"Missing fields: {', '.join(missing)}"}), 400

    def enrich_ip(ip):
        ip_api_url = os.environ.get("IP_API_URL", "http://ip-api.com/json/")
        try:
            r = requests.get(f"{ip_api_url}{ip}", timeout=5)
            r.raise_for_status()
            res = r.json()
            return res.get("city"), res.get("regionName"), res.get("country"), res.get("isp"), (res.get("lat"), res.get("lon"))
        except Exception as e:
            app.logger.error(f"IP enrichment failed for {ip}: {e}")
            return None, None, None, None, (None, None)

    try:
        ip1_data = enrich_ip(data['ip1'])
        ip2_data = enrich_ip(data['ip2'])

        conn = get_db()
        email = data.get('email') or data.get('user_email', '')
        domain = get_domain_from_email(email)
        tenant_name = get_tenant_name_for_domain(conn, domain) if domain else domain

        with conn.cursor() as cur:
            # Check for duplicate
            cur.execute("SELECT 1 FROM avanan_alerts WHERE timestamp = %s AND user_email = %s", (data['timestamp'], email))
            if cur.fetchone():
                return jsonify({"status": "error", "message": "Duplicate entry"}), 409

            cur.execute("""
                INSERT INTO avanan_alerts (
                    timestamp, tenant, user_email,
                    ip1, ip1_city, ip1_state, ip1_country, ip1_isp, ip1_geo,
                    ip2, ip2_city, ip2_state, ip2_country, ip2_isp, ip2_geo
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, point(%s, %s), %s, %s, %s, %s, %s, point(%s, %s))
                RETURNING id
            """, (
                data['timestamp'], tenant_name, email,
                data['ip1'], *ip1_data[:4], *ip1_data[4],
                data['ip2'], *ip2_data[:4], *ip2_data[4]
            ))
            new_id = cur.fetchone()[0]
            conn.commit()
        return jsonify({"status": "success", "id": new_id})
    except (DatabaseError, OperationalError) as e:
        app.logger.error(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error"}), 500
    except Exception as e:
        app.logger.error(f"Failed to add new entry: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/parse-entry', methods=['POST'])
def parse_entry():
    data = request.json
    return jsonify({"parsed": data}), 200

@app.route("/api/last-entries", methods=["GET"])
def last_entries():
    try:
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM avanan_alerts ORDER BY timestamp DESC LIMIT 7")
            entries = fetch_all_dicts(cur)
        return jsonify(entries)
    except Exception as e:
        app.logger.error(f"Failed to fetch last entries: {e}")
        return jsonify([]), 500


@app.route("/api/all-entries", methods=["GET"])
def all_entries():
    try:
        conn = get_db()
        with conn.cursor() as cur:
            # Sort by entry_number DESC so newest is first
            cur.execute("SELECT * FROM avanan_alerts ORDER BY entry_number DESC")
            entries = fetch_all_dicts(cur)
        return jsonify(entries)
    except Exception as e:
        app.logger.error(f"Failed to fetch all entries: {e}")
        return jsonify([]), 500

@app.route("/api/tenant-domains", methods=["GET", "POST", "DELETE"])
def tenant_domains():
    try:
        conn = get_db()
        with conn.cursor() as cur:
            if request.method == "GET":
                cur.execute("SELECT * FROM tenant_domains ORDER BY domain ASC")
                return jsonify(fetch_all_dicts(cur))
            elif request.method == "POST":
                data = request.json
                if not data or "domain" not in data or "tenant_name" not in data:
                    return jsonify({"status": "error", "message": "Missing domain or tenant_name"}), 400
                cur.execute(
                    "INSERT INTO tenant_domains (domain, tenant_name) VALUES (%s, %s) ON CONFLICT (domain) DO UPDATE SET tenant_name = EXCLUDED.tenant_name",
                    (data["domain"], data["tenant_name"])
                )
                conn.commit()
                return jsonify({"status": "success"})
            elif request.method == "DELETE":
                data = request.json
                if not data or "domain" not in data:
                    return jsonify({"status": "error", "message": "Missing domain"}), 400
                cur.execute("DELETE FROM tenant_domains WHERE domain = %s", (data["domain"],))
                conn.commit()
                return jsonify({"status": "deleted"})
    except (DatabaseError, OperationalError) as e:
        app.logger.error(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error"}), 500
    except Exception as e:
        app.logger.error(f"Tenant domains error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/api/entry/<int:entry_id>", methods=["GET", "DELETE"])
def entry_by_id(entry_id):
    try:
        conn = get_db()
        if request.method == "GET":
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM avanan_alerts WHERE id = %s", (entry_id,))
                row = cur.fetchone()
                if not row:
                    return jsonify({}), 404
                columns = [desc[0] for desc in cur.description]
                return jsonify(dict(zip(columns, row)))
        elif request.method == "DELETE":
            with conn.cursor() as cur:
                cur.execute("DELETE FROM avanan_alerts WHERE id = %s", (entry_id,))
                conn.commit()
            return jsonify({"status": "deleted"})
    except (DatabaseError, OperationalError) as e:
        app.logger.error(f"Database error: {e}")
        return jsonify({"status": "error", "message": "Database error"}), 500
    except Exception as e:
        app.logger.error(f"Entry by ID error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/api/update-tenants", methods=["POST"])
def update_all_tenants():
    """Update all avanan_alerts entries with the correct tenant name based on tenant_domains."""
    try:
        conn = get_db()
        with conn.cursor() as cur:
            # Fetch all entries with their id and user_email
            cur.execute("SELECT id, user_email FROM avanan_alerts")
            entries = cur.fetchall()
            for entry_id, email in entries:
                domain = get_domain_from_email(email or "")
                if not domain:
                    continue
                tenant_name = get_tenant_name_for_domain(conn, domain)
                cur.execute(
                    "UPDATE avanan_alerts SET tenant = %s WHERE id = %s",
                    (tenant_name, entry_id)
                )
            conn.commit()
        return jsonify({"status": "success", "updated": len(entries)})
    except Exception as e:
        app.logger.error(f"Failed to update tenants: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/upload-csv', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return {"error": "No file uploaded"}, 400
    file = request.files['file']
    if not file.filename.endswith('.csv'):
        return {"error": "File must be a CSV"}, 400

    reader = csv.DictReader(file.stream.read().decode("utf-8").splitlines())
    conn = get_db()
    with conn.cursor() as cur:
        for row in reader:
            # Adjust columns as needed
            cur.execute("""
                INSERT INTO avanan_alerts
                (timestamp, tenant, user_email, ip1, ip1_city, ip1_state, ip1_country, ip1_isp,
                 ip2, ip2_city, ip2_state, ip2_country, ip2_isp)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT DO NOTHING
            """, (
                row.get("timestamp"), row.get("tenant"), row.get("user_email"),
                row.get("ip1"), row.get("ip1_city"), row.get("ip1_state"), row.get("ip1_country"), row.get("ip1_isp"),
                row.get("ip2"), row.get("ip2_city"), row.get("ip2_state"), row.get("ip2_country"), row.get("ip2_isp"),
            ))
        conn.commit()
    return {"status": "success"}