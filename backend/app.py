from flask import Flask, request, jsonify, g
import requests
import psycopg2
from datetime import datetime
from flask_cors import CORS
import os
app = Flask(__name__)
CORS(app)

def get_db():
    if 'db' not in g:
        g.db = psycopg2.connect(
            dbname=os.environ.get("POSTGRES_DB", "avanan"),
            user=os.environ.get("POSTGRES_USER", "avanan"),
            password=os.environ.get("POSTGRES_PASSWORD", ""),
            host="localhost"
        )
    return g.db

@app.teardown_appcontext
def close_db(error):
    db = g.pop('db', None)
    if db is not None:
        db.close()

@app.route("/api/new-entry", methods=["POST"])
def new_entry():
    data = request.json
    def enrich_ip(ip):
        r = requests.get(f"http://ip-api.com/json/{ip}")
        res = r.json()
        return res.get("city"), res.get("regionName"), res.get("country"), res.get("isp"), (res.get("lat"), res.get("lon"))

    ip1_data = enrich_ip(data['ip1'])
    ip2_data = enrich_ip(data['ip2'])

    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO avanan_alerts (
            timestamp, tenant, user_email,
            ip1, ip1_city, ip1_state, ip1_country, ip1_isp, ip1_geo,
            ip2, ip2_city, ip2_state, ip2_country, ip2_isp, ip2_geo
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, point(%s, %s), %s, %s, %s, %s, %s, point(%s, %s))
    """, (
        data['timestamp'], data['tenant'], data['email'],
        data['ip1'], *ip1_data[:4], *ip1_data[4],
        data['ip2'], *ip2_data[:4], *ip2_data[4]
    ))
    conn.commit()
    cur.close()
    return jsonify({"status": "success"})

@app.route('/api/parse-entry', methods=['POST'])
def parse_entry():
    data = request.json
    return jsonify({"parsed": data}), 200

@app.route("/api/last-entries", methods=["GET"])
def last_entries():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT * FROM avanan_alerts
        ORDER BY timestamp DESC
        LIMIT 25
    """)
    rows = cur.fetchall()
    columns = [desc[0] for desc in cur.description]
    cur.close()
    entries = [dict(zip(columns, row)) for row in rows]
    return jsonify(entries)

@app.route("/api/all-entries", methods=["GET"])
def all_entries():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM avanan_alerts ORDER BY timestamp DESC")
    rows = cur.fetchall()
    columns = [desc[0] for desc in cur.description]
    cur.close()
    entries = [dict(zip(columns, row)) for row in rows]
    return jsonify(entries)

@app.route("/api/tenant-domains", methods=["GET", "POST", "DELETE"])
def tenant_domains():
    conn = get_db()
    cur = conn.cursor()
    if request.method == "GET":
        cur.execute("SELECT * FROM tenant_domains ORDER BY domain ASC")
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]
        cur.close()
        return jsonify([dict(zip(columns, row)) for row in rows])
    elif request.method == "POST":
        data = request.json
        cur.execute(
            "INSERT INTO tenant_domains (domain, tenant_name) VALUES (%s, %s) ON CONFLICT (domain) DO UPDATE SET tenant_name = EXCLUDED.tenant_name",
            (data["domain"], data["tenant_name"])
        )
        conn.commit()
        cur.close()
        return jsonify({"status": "success"})
    elif request.method == "DELETE":
        data = request.json
        cur.execute("DELETE FROM tenant_domains WHERE domain = %s", (data["domain"],))
        conn.commit()
        cur.close()
        return jsonify({"status": "deleted"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)