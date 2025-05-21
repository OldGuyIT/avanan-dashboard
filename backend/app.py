from flask import Flask, request, jsonify
import requests
import psycopg2
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

conn = psycopg2.connect(
    dbname="avanan", user="user", password="pass", host="db"
)

@app.route("/api/new-entry", methods=["POST"])
def new_entry():
    data = request.json
    # Assume data contains: {timestamp, email, ip1, ip2, tenant}
    def enrich_ip(ip):
        r = requests.get(f"http://ip-api.com/json/{ip}")
        res = r.json()
        return res.get("city"), res.get("regionName"), res.get("country"), res.get("isp"), (res.get("lat"), res.get("lon"))

    ip1_data = enrich_ip(data['ip1'])
    ip2_data = enrich_ip(data['ip2'])

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

@app.route("/api/last-entries")
def last_entries():
    cur = conn.cursor()
    cur.execute("SELECT * FROM avanan_alerts ORDER BY timestamp DESC LIMIT 25")
    results = cur.fetchall()
    cur.close()
    return jsonify(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
