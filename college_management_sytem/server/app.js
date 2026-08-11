const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// ----- Core middleware -----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS: the React frontend runs on a different origin, so we must
// explicitly allow it and enable credentials so the HTTP-only cookie
// is sent/received cross-origin. `origin: "*"` is NOT allowed when
// `credentials: true` is set (browsers will reject it), so we use the
// specific CLIENT_URL from the environment instead.
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// ----- Health check -----
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

// ----- Routes -----
app.use("/api/auth", authRoutes);

// ----- 404 + error handling (must be last) -----
app.use(notFound);
app.use(errorHandler);

module.exports = app;
