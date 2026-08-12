const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const coordinatorRoutes = require("./routes/coordinatorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// ----- Core middleware -----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Dynamic CORS configuration supporting credentials (cookies) across all local ports
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, curl)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        process.env.CLIENT_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5000",
        "http://127.0.0.1:5000",
      ].filter(Boolean);

      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// ----- Health check & Root API info -----
app.get(["/", "/api"], (req, res) => {
  res.status(200).json({
    success: true,
    message: "College Management System Backend API is running",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      student: "/api/student",
      faculty: "/api/faculty",
      coordinator: "/api/coordinator",
      admin: "/api/admin",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

// ----- Routes (Supports both /api/* and /*) -----
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/student", studentRoutes);
app.use("/student", studentRoutes);

app.use("/api/faculty", facultyRoutes);
app.use("/faculty", facultyRoutes);

app.use("/api/coordinator", coordinatorRoutes);
app.use("/coordinator", coordinatorRoutes);

app.use("/api/admin", adminRoutes);
app.use("/admin", adminRoutes);

// ----- 404 + error handling (must be last) -----
app.use(notFound);
app.use(errorHandler);

module.exports = app;
