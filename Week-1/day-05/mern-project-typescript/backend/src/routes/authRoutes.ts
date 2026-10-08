// Authentication Routes (TypeScript)
// Implements strictly typed Register, Login, and Profile endpoints.

import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { protect } from "../middleware/authMiddleware";
import { IAuthRequest, IRegisterInputBody, ILoginInputBody } from "../types";

const router = Router();

// Helper to generate typed JWT token
const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || "fallback_secret_key";
  return jwt.sign({ userId }, secret, {
    expiresIn: "7d",
  });
};

// ==========================================
// 1. REGISTER NEW USER
// POST /api/auth/register
// ==========================================
router.post(
  "/register",
  async (
    req: IAuthRequest<Record<string, string>, unknown, IRegisterInputBody>,
    res: Response
  ): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({
          success: false,
          message: "Please provide all required fields: name, email, and password",
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
        return;
      }

      // Check for existing user
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: "An account with this email already exists",
        });
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const newUser = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
      });

      // Generate JWT token
      const token = generateToken(newUser._id.toString());

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration error";
      console.error("Register Error:", message);
      res.status(500).json({
        success: false,
        message,
      });
    }
  }
);

// ==========================================
// 2. LOGIN USER
// POST /api/auth/login
// ==========================================
router.post(
  "/login",
  async (
    req: IAuthRequest<Record<string, string>, unknown, ILoginInputBody>,
    res: Response
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: "Please provide both email and password",
        });
        return;
      }

      // Check if user exists
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user || !user.password) {
        res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
        return;
      }

      // Verify password
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
        return;
      }

      // Generate JWT
      const token = generateToken(user._id.toString());

      res.status(200).json({
        success: true,
        message: "Logged in successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login error";
      console.error("Login Error:", message);
      res.status(500).json({
        success: false,
        message,
      });
    }
  }
);

// ==========================================
// 3. GET CURRENT USER PROFILE
// GET /api/auth/me (Protected)
// ==========================================
router.get("/me", protect, async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Profile fetch error";
    console.error("Get Profile Error:", message);
    res.status(500).json({
      success: false,
      message,
    });
  }
});

export default router;
