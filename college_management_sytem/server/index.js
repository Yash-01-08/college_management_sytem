const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend connection
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "CampusPulse Backend Server is running!",
    docs: "/api/status",
  });
});

// Main Status Endpoint for Frontend Status Page
app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    server: "CampusPulse Smart Campus Express Engine",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      connected: true,
      provider: "MongoDB / In-Memory Seed Repository",
    },
    services: [
      { name: "Auth & RBAC Service", status: "operational" },
      { name: "Attendance & QR Generator", status: "operational" },
      { name: "Assignments Engine", status: "operational" },
      { name: "Placement Portal", status: "operational" },
      { name: "AI Campus Chatbot", status: "operational" },
    ],
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  const memoryUsage = process.memoryUsage();
  res.json({
    health: "healthy",
    cpuStatus: "normal",
    memoryUsageMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    activeConnections: 1,
    checkedAt: new Date().toISOString(),
  });
});

// Developer Architecture Info
app.get("/api/info", (req, res) => {
  res.json({
    team: {
      backendLead: "User (Developer 1)",
      frontendLead: "Friend (Developer 2)",
    },
    stack: {
      frontend: "React + Tailwind CSS + Lucide Icons",
      backend: "Node.js + Express.js + CORS",
      database: "MongoDB / PostgreSQL via Prisma",
    },
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 Status endpoint: http://localhost:${PORT}/api/status`);
  console.log(`=================================================`);
});
