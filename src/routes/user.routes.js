// src/routes/user.routes.js

const express = require("express");
const router = express.Router();

// Import the User Controller
const userController = require("../controllers/user.controller");

// Optional authentication or role-based middlewares:
// const authMiddleware = require("../middlewares/auth.middleware");
// const roleMiddleware = require("../middlewares/role.middleware");

/**
 * GET /api/users
 * Retrieve a list of all users. Typically for admin usage.
 */
router.get(
  "/users",
  // authMiddleware,
  // roleMiddleware("admin"),
  userController.getAllUsers
);

/**
 * GET /api/users/:userId
 * Retrieve a single user by ID.
 */
router.get(
  "/users/:userId",
  // authMiddleware,
  // roleMiddleware("admin"),
  userController.getUserById
);

/**
 * PATCH /api/users/:userId
 * Update a user's data (e.g., role, profile).
 */
router.patch(
  "/users/:userId",
  // authMiddleware,
  // roleMiddleware("admin"),
  userController.updateUser
);

/**
 * DELETE /api/users/:userId
 * Delete a user by ID. Typically for admin usage.
 */
router.delete(
  "/users/:userId",
  // authMiddleware,
  // roleMiddleware("admin"),
  userController.deleteUser
);

module.exports = router;
