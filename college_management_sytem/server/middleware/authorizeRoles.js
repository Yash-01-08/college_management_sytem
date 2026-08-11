/**
 * Reusable role-based authorization middleware factory.
 *
 * Must be used AFTER authMiddleware, since it relies on req.user
 * having already been set.
 *
 * Usage:
 *   router.get("/admin-only", authMiddleware, authorizeRoles("admin"), handler);
 *   router.get("/staff", authMiddleware, authorizeRoles("admin", "faculty"), handler);
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};

module.exports = authorizeRoles;
