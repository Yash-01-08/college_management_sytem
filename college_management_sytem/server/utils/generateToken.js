const jwt = require("jsonwebtoken");

/**
 * Generates a signed JWT for an authenticated user and sets it as an
 * HTTP-only cookie on the response.
 *
 * The token payload intentionally contains only non-sensitive
 * identifiers needed to identify/authorize the user on subsequent
 * requests. It never contains the password or other sensitive data.
 *
 * @param {import("express").Response} res
 * @param {{ userId: string, role: string, scholarNumber?: string }} payload
 */
const generateTokenAndSetCookie = (res, { userId, role, scholarNumber }) => {
  const token = jwt.sign(
    {
      userId,
      role,
      scholarNumber: scholarNumber || null,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  const isProduction = process.env.NODE_ENV === "production";

  
  const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

  res.cookie("token", token, {
    httpOnly: true, // JS on the client can never read this cookie (XSS protection)
    secure: isProduction, // only sent over HTTPS in production
    sameSite: isProduction ? "none" : "lax", // "none" needed for cross-site prod deployments (requires secure:true)
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return token;
};

module.exports = generateTokenAndSetCookie;
