from flask import Blueprint, jsonify
import psycopg2

bp = Blueprint("website_logs", __name__)

@bp.route("/api/website_logs", methods=["GET"])
def get_website_logs():
    try:
        conn = psycopg2.connect(
            dbname="soc-dashboard",
            user="postgres",
            password="13210909s",
            host="localhost",
            port="5432"
        )
        cur = conn.cursor()
        cur.execute("SELECT objid, device, sensor, status, lastvalue, lastvalue_raw, timestamp FROM website_logs ORDER BY timestamp DESC")
        rows = cur.fetchall()
        cur.close()
        conn.close()

        result = []
        for row in rows:
            result.append({
                "objid": row[0],
                "device": row[1],
                "sensor": row[2],
                "status": row[3],
                "lastvalue": row[4],
                "lastvalue_raw": row[5],
                "timestamp": row[6].strftime("%Y-%m-%d %H:%M:%S")
            })

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
