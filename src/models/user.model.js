// src/models/user.model.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * User Schema
 *
 * Represents an application user with credentials (email, passwordHash),
 * role (admin, marketer, etc.), and profile fields.
 * 
 * This model is typically used with an auth system (JWT or session-based).
 */
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,       // ensures no two users share the same email
    lowercase: true,    // convert email to lowercase before saving
    trim: true
  },
  // Store only the hashed password, not the raw password
  passwordHash: {
    type: String,
    required: true
  },
  // e.g. "admin", "marketer", "viewer"
  role: {
    type: String,
    default: "marketer"
    // You could also use an enum: enum: ["admin", "marketer", "viewer"], etc.
  },
  // Profile data, e.g. name, avatar, etc.
  profile: {
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    avatarUrl: {
      type: String
    }
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

// Optional: you could add an index for email if needed, but unique: true often suffices
// userSchema.index({ email: 1 }, { unique: true });

/**
 * Pre-save hook to update 'updatedAt' before saving.
 */
userSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

/**
 * Export the Mongoose model.
 * Usage in other files:
 *   const User = require("../models/user.model");
 *   const newUser = new User({ email: "...", passwordHash: "...", role: "admin" });
 *   await newUser.save();
 */
module.exports = mongoose.model("User", userSchema);
