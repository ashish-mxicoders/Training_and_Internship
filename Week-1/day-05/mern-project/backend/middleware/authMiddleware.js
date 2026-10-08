// Authentication Middleware
// This middleware verifies the JWT token sent in the Authorization header.
// It protects private routes so only logged-in users can access them.

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token = null;

  try {
    // Check if authorization header exists and starts with 'Bearer'
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Extract token string after 'Bearer '
      token = authHeader.split(" ")[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret_key"
      );

      // Find user in database by ID stored in token payload
      // Exclude password field from the returned user object
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found or account was removed",
        });
      }

      // Attach user object to the request for subsequent handlers
      req.user = user;
      return next();
    }

    // If no token was provided
    return res.status(401).json({
      success: false,
      message: "Access denied. No authentication token provided.",
    });
  } catch (error) {
    console.error("JWT Verification error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};

module.exports = { protect };
