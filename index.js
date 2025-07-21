import http from "http";
import { parse } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Import route handlers
const deviceLogsHandler = require("./api/device_logs/routes.js");
const websiteLogsHandler = require("./api/website_logs/routes.js");

const server = http.createServer(async (req, res) => {
  const parsedUrl = parse(req.url, true);

  // Optional: Set CORS headers (untuk akses dari frontend React/Next.js)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // Routing
  if (parsedUrl.pathname === "/api/device_logs" && req.method === "GET") {
    deviceLogsHandler(req, res);
  } else if (parsedUrl.pathname === "/api/website_logs" && req.method === "GET") {
    websiteLogsHandler(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(3001, () => {
  console.log("✅ Server running on http://localhost:3001");
});
