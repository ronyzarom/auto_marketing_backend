// src/services/user.service.js

/**
 * User Service
 *
 * Handles listing, retrieving, updating, and deleting user records.
 * Usually, auth logic (registration, login) is handled in auth.service.js,
 * so this service focuses on administrative or profile management tasks.
 */

const User = require("../models/user.model");

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};

/**
 * getAllUsers
 * Retrieves all users in the system, possibly filtered by role or paginated.
 * @param {Object} options - { role, page, limit } (optional)
 * @returns {Promise<Array>} array of user documents
 */
async function getAllUsers({ role, page, limit } = {}) {
  // Build a query object if you want to filter by role
  const query = {};
  if (role) {
    query.role = role;
  }

  // Basic pagination
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  // Retrieve users
  // .lean() returns plain JS objects rather than Mongoose docs (optional)
  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  return users;
}

/**
 * getUserById
 * Retrieves a single user by their Mongo _id.
 * @param {String} userId
 * @returns {Promise<Object|null>} user document or null if not found
 */
async function getUserById(userId) {
  if (!userId) {
    throw new Error("userId is required to retrieve user.");
  }

  const user = await User.findById(userId).lean();
  return user;
}

/**
 * updateUser
 * Partially updates a user's fields (e.g., role, profile info).
 * @param {String} userId
 * @param {Object} updates - e.g. { role: "admin", profile: { firstName: "Alice" } }
 * @returns {Promise<Object|null>} the updated user doc or null if not found
 */
async function updateUser(userId, updates) {
  if (!userId) {
    throw new Error("userId is required to update user.");
  }

  // If you want to prevent certain fields from being updated, you can do so here
  // e.g., const { email, passwordHash, ...allowedUpdates } = updates;
  // and only apply allowedUpdates.

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true } // return the updated doc
  );

  return updatedUser;
}

/**
 * deleteUser
 * Deletes a user from the database by ID.
 * @param {String} userId
 * @returns {Promise<Boolean>} true if deleted, false otherwise
 */
async function deleteUser(userId) {
  if (!userId) {
    throw new Error("userId is required to delete user.");
  }

  const result = await User.findByIdAndDelete(userId);
  return !!result; // returns true if a doc was found & deleted, false otherwise
}
