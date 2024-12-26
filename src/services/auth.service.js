// src/services/auth.service.js

/**
 * Auth Service
 *
 * Handles user registration, login, and profile retrieval.
 * Uses bcrypt for password hashing/comparison and jsonwebtoken for JWT.
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Load environment variables (e.g., JWT_SECRET)
require("dotenv").config();

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};

/**
 * registerUser
 * Creates a new user account.
 * @param {Object} userData - { email, password, firstName, lastName }
 * @returns {Promise<Object>} the newly created user document (minus hashed password)
 */
async function registerUser({ email, password, firstName, lastName }) {
  // 1. Check if user with this email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("User with this email already exists.");
    error.code = 11000; // Typically used to indicate a duplicate key
    throw error;
  }

  // 2. Hash the password
  const saltRounds = 10; // or process.env.BCRYPT_SALT_ROUNDS
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // 3. Create user
  const newUser = new User({
    email,
    passwordHash,
    role: "marketer", // or default role of your choice
    profile: {
      firstName,
      lastName
    }
  });
  const savedUser = await newUser.save();

  // 4. Return user data (excluding passwordHash)
  //    Mongoose docs: you can transform or just remove in your controller if you'd like
  return {
    _id: savedUser._id,
    email: savedUser.email,
    role: savedUser.role,
    profile: savedUser.profile
  };
}

/**
 * loginUser
 * Verifies user credentials and returns a JWT token if valid.
 * @param {Object} credentials - { email, password }
 * @returns {Promise<{ token: string, user: Object }>} on success
 */
async function loginUser({ email, password }) {
  // 1. Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return { token: null, user: null };
  }

  // 2. Compare password with stored hash
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return { token: null, user: null };
  }

  // 3. Generate JWT token
  const secret = process.env.JWT_SECRET || "mySecretKey";
  const expiresIn = "1d"; // e.g., "1d" or "2h"
  const payload = {
    userId: user._id,
    role: user.role
    // Additional claims if needed
  };

  const token = jwt.sign(payload, secret, { expiresIn });

  // 4. Return token and user info
  return {
    token,
    user: {
      _id: user._id,
      email: user.email,
      role: user.role,
      profile: user.profile
    }
  };
}

/**
 * getUserProfile
 * Fetches user data for an authenticated user (e.g., after login).
 * @param {String} userId - The ID of the user to retrieve
 * @returns {Promise<Object|null>} the user doc, or null if not found
 */
async function getUserProfile(userId) {
  const user = await User.findById(userId).lean();
  if (!user) return null;

  // Optionally remove passwordHash from the returned object
  const { passwordHash, ...userData } = user;
  return userData;
}
