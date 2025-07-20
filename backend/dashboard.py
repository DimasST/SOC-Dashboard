from flask import Flask, jsonify
import psycopg2
from api.website_logs import bp as website_logs_bp
from flask_cors import CORS

app = Flask(__name__)          # <- buat app dulu
CORS(app)                      # <- lalu aktifkan CORS

app.register_blueprint(website_logs_bp)

@app.route("/")
def index():
    return jsonify({"message": "✅ API backend is running"})

@app.route("/api/logs")
def get_desktop_logs():
    conn = psycopg2.connect(
        dbname="soc-dashboard",
        user="postgres",
        password="13210909s",
        host="localhost",
        port="5432"
    )
    cur = conn.cursor()
    cur.execute("""
        SELECT objid, device, sensor, status, lastvalue, lastvalue_raw, timestamp
        FROM prtg_logs
        WHERE device = 'DESKTOP-OT2EVTR'
        ORDER BY timestamp DESC
        LIMIT 20
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    logs = []
    for row in rows:
        logs.append({
            "objid": row[0],
            "device": row[1],
            "sensor": row[2],
            "status": row[3],
            "lastvalue": row[4],
            "lastvalue_raw": row[5],
            "timestamp": row[6].isoformat() if row[6] else None
        })

    return jsonify(logs)

if __name__ == "__main__":
    app.run(debug=True)
