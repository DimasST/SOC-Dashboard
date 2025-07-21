const { query } = require("../../libary/db");

module.exports = async (req, res) => {
  if (req.method === "GET") {
    try {
      const result = await query("SELECT * FROM prtg_logs ORDER BY timestamp DESC");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.rows));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
  } else {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
  }
};
