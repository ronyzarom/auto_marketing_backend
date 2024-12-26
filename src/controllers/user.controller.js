// src/controllers/user.controller.js

/**
 * User Controller
 *
 * Handles user-related administrative operations:
 *  - List all users
 *  - Get one user by ID
 *  - Update user data (role, profile fields)
 *  - Delete a user
 *
 * Typically, these endpoints are protected by an admin role or
 * some permission checks, which you can add as middleware.
 */

const userService = require("../services/user.service");

/**
 * GET /api/users
 * Retrieves a list of all users (for admin usage).
 * Supports optional query params like ?role=marketer&page=1&limit=10
 */
async function getAllUsers(req, res) {
  try {
    const { role, page, limit } = req.query;
    // Call the service layer to fetch users
    const users = await userService.getAllUsers({ role, page, limit });

    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error("[UserController] Error in getAllUsers:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve users."
    });
  }
}

/**
 * GET /api/users/:userId
 * Retrieves a single user by ID.
 * Often restricted to admin usage or the user themselves.
 */
async function getUserById(req, res) {
  try {
    const { userId } = req.params;

    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with ID: ${userId}`
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("[UserController] Error in getUserById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user."
    });
  }
}

/**
 * PATCH /api/users/:userId
 * Updates partial fields for a user (role, profile, etc.).
 * Typically restricted to admin usage or the user themselves with certain limits.
 */
async function updateUser(req, res) {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Example: If you want to block changing email or password via this route,
    // you could remove those fields from `updates` here.

    const updatedUser = await userService.updateUser(userId, updates);
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: `No user found with ID: ${userId}`
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: "User updated successfully."
    });
  } catch (error) {
    console.error("[UserController] Error in updateUser:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user."
    });
  }
}

/**
 * DELETE /api/users/:userId
 * Deletes a user by ID.
 * Often restricted to admin usage or an owner role.
 */
async function deleteUser(req, res) {
  try {
    const { userId } = req.params;

    // Possibly prevent a user from deleting themselves unless admin.
    // e.g. if (req.user._id === userId && req.user.role !== 'admin') { ... }

    const deleted = await userService.deleteUser(userId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `No user found with ID: ${userId}`
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully."
    });
  } catch (error) {
    console.error("[UserController] Error in deleteUser:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user."
    });
  }
}

// Export controller methods
module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
