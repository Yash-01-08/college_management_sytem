const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5000;

// Dynamic Directory Tree builder
function getDirectoryTree(dirPath, depth = 0, maxDepth = 4) {
  if (depth > maxDepth) return null;
  const basename = path.basename(dirPath);

  if (["node_modules", ".next", ".git", "out", "build"].includes(basename)) {
    return null;
  }

  try {
    const stats = fs.statSync(dirPath);
    if (stats.isDirectory()) {
      const items = fs.readdirSync(dirPath);
      const children = items
        .map((item) => getDirectoryTree(path.join(dirPath, item), depth + 1, maxDepth))
        .filter(Boolean);

      return {
        name: basename,
        type: "directory",
        path: dirPath.replace(/\\/g, "/"),
        children,
      };
    } else {
      return {
        name: basename,
        type: "file",
        sizeBytes: stats.size,
        extension: path.extname(basename),
        path: dirPath.replace(/\\/g, "/"),
      };
    }
  } catch (err) {
    return null;
  }
}

const server = http.createServer((req, res) => {
  // Enable CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = reqUrl.pathname;

  // Endpoint: GET /api/health
  if (pathname === "/api/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "online",
        message: "Node.js Backend Server is running & connected successfully!",
        server: "Node.js Built-in HTTP / Express Backend",
        port: PORT,
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        nodeVersion: process.version,
        memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      })
    );
    return;
  }

  // Endpoint: ALL /api/server-test
  if (pathname === "/api/server-test") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      let parsedBody = null;
      if (body) {
        try {
          parsedBody = JSON.parse(body);
        } catch {
          parsedBody = { rawText: body };
        }
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "Server test request processed successfully by Node.js backend!",
          clientLib: "axios",
          requestDetails: {
            method: req.method,
            url: req.url,
            headers: req.headers,
            query: Object.fromEntries(reqUrl.searchParams),
            body: parsedBody,
          },
          serverDiagnostics: {
            status: "Healthy",
            environment: process.env.NODE_ENV || "development",
            uptime: `${Math.floor(process.uptime())}s`,
            memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
            nodeVersion: process.version,
            pid: process.pid,
          },
          timestamp: new Date().toISOString(),
        })
      );
    });
    return;
  }

  // Endpoint: GET /api/file-structure
  if (pathname === "/api/file-structure" && req.method === "GET") {
    const rootDir = __dirname;
    const tree = getDirectoryTree(rootDir, 0, 4);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        projectRoot: rootDir,
        structure: tree,
        timestamp: new Date().toISOString(),
      })
    );
    return;
  }

  // Endpoint: GET /api/users
  if (pathname === "/api/users" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        total: 4,
        users: [
          { id: "user-student-1", name: "Aarav Sharma", role: "STUDENT", email: "aarav.sharma@campus.edu" },
          { id: "user-faculty-1", name: "Dr. Rajesh Kulkarni", role: "FACULTY", email: "rajesh.kulkarni@campus.edu" },
          { id: "user-coord-1", name: "Priya Sundaram", role: "COORDINATOR", email: "priya.sundaram@campus.edu" },
          { id: "user-admin-1", name: "Vikramaditya Mehta", role: "ADMIN", email: "admin@campus.edu" },
        ],
      })
    );
    return;
  }

  // Default fallback 404
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Endpoint not found", path: pathname }));
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Node.js Backend Server running on http://localhost:${PORT}`);
  console.log(`HEALTH CHECK: http://localhost:${PORT}/api/health`);
  console.log(`TEST API: http://localhost:${PORT}/api/server-test`);
  console.log(`FILE STRUCTURE API: http://localhost:${PORT}/api/file-structure`);
  console.log(`=======================================================`);
});
