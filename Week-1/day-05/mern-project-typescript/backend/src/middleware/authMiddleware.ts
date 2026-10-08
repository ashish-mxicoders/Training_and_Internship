// Authentication Middleware (TypeScript)
// Verifies JWT token from Authorization header and attaches typed user to request object.

import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { IAuthRequest, IJwtPayload } from "../types";

export const protect = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | null = null;

  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Extract Bearer token string
      token = authHeader.split(" ")[1];

      const secret = process.env.JWT_SECRET || "fallback_secret_key";

      // Verify token with typed payload
      const decoded = jwt.verify(token, secret) as IJwtPayload;

      // Find user by ID, exclude password
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        res.status(401).json({
          success: false,
          message: "User not found or account was removed",
        });
        return;
      }

      // Attach typed user document to request
      req.user = user;
      next();
      return;
    }

    // No token provided
    res.status(401).json({
      success: false,
      message: "Access denied. No authentication token provided.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Authentication error";
    console.error("JWT Verification error:", message);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};
