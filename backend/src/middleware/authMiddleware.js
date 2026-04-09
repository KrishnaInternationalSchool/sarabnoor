const jwt = require("jsonwebtoken");

const User = require("../models/User");

const protect = async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Authentication required");
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      return next(error);
    }

    next();
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
};

const adminOnly = (req, _res, next) => {
  if (req.user?.role !== "admin") {
    const error = new Error("Admin access required");
    error.statusCode = 403;
    return next(error);
  }

  next();
};

module.exports = { protect, adminOnly };
