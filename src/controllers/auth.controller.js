// src/controllers/auth.controller.js

/**
 * Auth Controller
 *
 * Handles user registration, login, and authenticated profile retrieval.
 * Depends on authService to handle hashing, token creation, and user queries.
 */

const authService = require("../services/auth.service");

/**
 * POST /auth/register
 * Creates a new user account.
 * Expects req.body with { email, password, firstName, lastName }.
 */
async function register(req, res) {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: email or password.",
      });
    }

    // Register user via authService
    const newUser = await authService.registerUser({
      email,
      password,
      firstName,
      lastName,
    });

    return res.status(201).json({
      success: true,
      data: newUser,
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error("[AuthController] Error in register:", error);

    // Example: handle duplicate email error if code === 11000
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to register user.",
    });
  }
}

/**
 * POST /auth/login
 * Authenticates a user with email and password.
 * Returns a JWT token if valid.
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: email or password.",
      });
    }

    const { token, user } = await authService.loginUser({ email, password });

    // If token is null, credentials are invalid
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Return the token and user data
    return res.status(200).json({
      success: true,
      data: {
        token,
        user,
      },
      message: "Login successful.",
    });
  } catch (error) {
    console.error("[AuthController] Error in login:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to login.",
    });
  }
}

/**
 * GET /auth/me
 * Returns the currently authenticated user's profile.
 * Requires authentication middleware that sets req.user (with userId).
 */
async function getProfile(req, res) {
  try {
    // Assuming a JWT middleware sets req.user = { userId, role, ... }
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. No valid user token found.",
      });
    }

    const userProfile = await authService.getUserProfile(userId);
    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    console.error("[AuthController] Error in getProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user profile.",
    });
  }
}

module.exports = {
  register,
  login,
  getProfile,
};
