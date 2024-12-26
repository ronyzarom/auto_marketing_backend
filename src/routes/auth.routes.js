// src/routes/auth.routes.js

const express = require("express");
const router = express.Router();

// Import the Auth Controller (which handles login, register, profile, etc.)
const authController = require("../controllers/auth.controller");

// Authentication endpoints:

/**
 * @desc    Login user
 * @route   POST /auth/login
 */
router.post("/login", authController.login);

/**
 * @desc    Register new user
 * @route   POST /auth/register
 */
router.post("/register", authController.register);

/**
 * @desc    Get current user profile
 * @route   GET /auth/me
 * @note    Typically requires a JWT middleware to verify the user’s token.
 */
router.get("/me", /* yourAuthMiddleware, */ authController.getProfile);

// Export the router function so Express can use it
module.exports = router;
